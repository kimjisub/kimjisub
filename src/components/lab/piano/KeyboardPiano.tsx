'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import './piano.css';

import { AudioEngine } from './engine/audio';
import { Keyboard } from './engine/keyboardView';
import {
	BLACK_SLOT_CODES,
	buildLayout,
	capOf,
	pitchClass,
	TONIC_MIDI,
	WHITE_CODES,
} from './engine/keymap';
import type { Layout } from './engine/keymap';
import { PRESETS } from './engine/presets';
import type { SampledProgress } from './engine/sampledGrand';

const NOTE_CODES = new Set([...WHITE_CODES, ...BLACK_SLOT_CODES]);

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const signed = (v: number) => (v > 0 ? `+${v}` : String(v));

export default function KeyboardPiano() {
	const [presetIndex, setPresetIndex] = useState(0);
	const [octave, setOctave] = useState(0);
	const [transpose, setTranspose] = useState(0);
	const [anchorIndex, setAnchorIndex] = useState(0);
	const [pedalHeld, setPedalHeld] = useState(false);
	const [pedalLatched, setPedalLatched] = useState(false);
	const [started, setStarted] = useState(false);
	const [samples, setSamples] = useState<SampledProgress>({ state: 'idle', loaded: 0, total: 0 });

	const mountRef = useRef<HTMLDivElement>(null);
	const meterRef = useRef<HTMLDivElement>(null);
	const engineRef = useRef<AudioEngine | null>(null);
	const keyboardRef = useRef<Keyboard | null>(null);

	const layout = useMemo(
		() => buildLayout({ anchorIndex, transpose, octave }),
		[anchorIndex, transpose, octave],
	);

	// 타건 경로에서 React 를 거치지 않으려고 현재 배치를 ref 로도 들고 있는다.
	const layoutRef = useRef<Layout>(layout);
	layoutRef.current = layout;

	// ── 엔진과 건반 (마운트 때 한 번) ──────────────────────────────────────
	useEffect(() => {
		const engine = new AudioEngine();
		engineRef.current = engine;

		const keyboard = new Keyboard(mountRef.current as HTMLElement, {
			onNoteOn: (id, midi) => engine.noteOn(id, midi),
			onNoteOff: id => engine.noteOff(id),
		});
		keyboardRef.current = keyboard;
		keyboard.applyLayout(layoutRef.current);
		setStarted(engine.running);

		// 샘플은 뒤에서 받는다. 받는 동안에도 합성으로 소리가 나므로 화면이 막히지 않는다.
		engine.loadSamples(setSamples);

		// 좁은 화면에서는 자판의 두 줄과 같은 자리로 접는다. 한 줄로 23개를 두면
		// 폰에서 건반 하나가 17px 이라 칠 수가 없다.
		const narrow = window.matchMedia('(max-width: 720px)');
		const applySplit = () => keyboard.setSplit(narrow.matches);
		applySplit();
		narrow.addEventListener('change', applySplit);

		return () => {
			narrow.removeEventListener('change', applySplit);
			keyboard.destroy();
			engine.destroy();
			engineRef.current = null;
			keyboardRef.current = null;
		};
	}, []);

	useEffect(() => {
		keyboardRef.current?.applyLayout(layout);
		// 지금 건반에 올라온 음역만 샘플로 받는다. 옥타브나 조옮김으로 벗어나면
		// 그때 넓혀서 받고, 받는 동안 그 음들은 합성으로 난다.
		const midis = [...layout.white, ...layout.black].filter(k => k.exists).map(k => k.midi);
		engineRef.current?.coverRange(Math.min(...midis), Math.max(...midis));
	}, [layout]);

	useEffect(() => {
		engineRef.current?.setPreset(PRESETS[presetIndex]);
	}, [presetIndex]);

	useEffect(() => {
		engineRef.current?.setSustain(pedalHeld || pedalLatched);
	}, [pedalHeld, pedalLatched]);

	const panic = useCallback(() => {
		keyboardRef.current?.releasePointers();
		engineRef.current?.releaseAll();
		setPedalHeld(false);
		NOTE_CODES.forEach(code => keyboardRef.current?.release(code));
	}, []);

	// ── 키보드 입력 ───────────────────────────────────────────────────────
	// 노트 키는 오디오를 먼저 스케줄하고 화면 갱신은 그 뒤에 둔다. 화면 갱신은
	// 다시 requestAnimationFrame 으로 미뤄지므로 타건 경로에 남지 않는다.
	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.metaKey || e.ctrlKey) return;

			const key = layoutRef.current.map.get(e.code);
			if (key) {
				e.preventDefault();
				if (e.repeat) return; // OS 자동 반복은 새 타건이 아니다
				engineRef.current?.noteOn(e.code, key.midi);
				keyboardRef.current?.press(e.code);
				return;
			}

			switch (e.code) {
				case 'Space':
					e.preventDefault();
					if (!e.repeat) setPedalHeld(true);
					return;
				case 'Tab':
					e.preventDefault();
					if (!e.repeat) setPedalLatched(v => !v);
					return;
				case 'ArrowLeft':
					e.preventDefault();
					setTranspose(v => clamp(v - 1, -12, 12));
					return;
				case 'ArrowRight':
					e.preventDefault();
					setTranspose(v => clamp(v + 1, -12, 12));
					return;
				case 'ArrowDown':
					e.preventDefault();
					setOctave(v => clamp(v - 1, -3, 3));
					return;
				case 'ArrowUp':
					e.preventDefault();
					setOctave(v => clamp(v + 1, -3, 3));
					return;
				case 'Backquote':
					e.preventDefault();
					if (!e.repeat) setPresetIndex(v => (v - 1 + PRESETS.length) % PRESETS.length);
					return;
				case 'Digit1':
					e.preventDefault();
					if (!e.repeat) setPresetIndex(v => (v + 1) % PRESETS.length);
					return;
				case 'Escape':
					e.preventDefault();
					panic();
					return;
				default:
			}
		};

		// 배치가 바뀌어 지금은 소리가 없는 자리가 되었어도, 누르고 있던 음은 놓아야 한다.
		const onKeyUp = (e: KeyboardEvent) => {
			if (NOTE_CODES.has(e.code)) {
				engineRef.current?.noteOff(e.code);
				keyboardRef.current?.release(e.code);
				return;
			}
			if (e.code === 'Space') setPedalHeld(false);
		};

		window.addEventListener('keydown', onKeyDown, { passive: false });
		window.addEventListener('keyup', onKeyUp);
		window.addEventListener('blur', panic);
		return () => {
			window.removeEventListener('keydown', onKeyDown);
			window.removeEventListener('keyup', onKeyUp);
			window.removeEventListener('blur', panic);
		};
	}, [panic]);

	// ── 오디오 시동 ───────────────────────────────────────────────────────
	// 컨텍스트는 이미 만들어져 있고 여기서는 resume 만 한다. 타건 경로에는 없다.
	useEffect(() => {
		if (started) return;
		const unlock = () => {
			void engineRef.current?.resume().then(() => {
				if (engineRef.current?.running) setStarted(true);
			});
		};
		window.addEventListener('keydown', unlock, true);
		window.addEventListener('pointerdown', unlock, true);
		return () => {
			window.removeEventListener('keydown', unlock, true);
			window.removeEventListener('pointerdown', unlock, true);
		};
	}, [started]);

	// ── 지연 표시 ─────────────────────────────────────────────────────────
	// 초당 네 번 다시 렌더하지 않으려고 DOM 에 직접 쓴다.
	useEffect(() => {
		const id = window.setInterval(() => {
			const engine = engineRef.current;
			const node = meterRef.current;
			if (!engine || !node) return;
			const l = engine.latency();
			node.textContent =
				`지연 ${(l.outputMs + l.scheduleMs).toFixed(1)}ms `
				+ `(출력 ${l.outputMs.toFixed(1)} + 스케줄 ${l.scheduleMs.toFixed(2)}) `
				+ `| ${(l.sampleRate / 1000).toFixed(1)}kHz`;
		}, 250);
		return () => window.clearInterval(id);
	}, []);

	const sustainOn = pedalHeld || pedalLatched;

	return (
		<div className="kb-piano">
			<header className="bar">
				<div className="brand">
					Keyboard<span>Piano</span>
				</div>

				<div className="group tones">
					{PRESETS.map((preset, i) => (
						<button
							key={preset.id}
							type="button"
							className={i === presetIndex ? 'tone on' : 'tone'}
							onClick={e => {
								setPresetIndex(i);
								e.currentTarget.blur();
							}}>
							{preset.name}
							{preset.id === 'grand' && samples.state === 'loading' && (
								<span
									className="loading"
									style={{ width: `${samples.total ? (samples.loaded / samples.total) * 100 : 0}%` }}
								/>
							)}
						</button>
					))}
				</div>

				<div className="group">
					<span className="glabel">옥타브</span>
					<div className="stepper">
						<button
							type="button"
							title="↓"
							onClick={e => {
								setOctave(v => clamp(v - 1, -3, 3));
								e.currentTarget.blur();
							}}>
							−
						</button>
						<output>{signed(octave)}</output>
						<button
							type="button"
							title="↑"
							onClick={e => {
								setOctave(v => clamp(v + 1, -3, 3));
								e.currentTarget.blur();
							}}>
							+
						</button>
					</div>
				</div>

				<div className="group">
					<span className="glabel">조옮김</span>
					<div className="stepper">
						<button
							type="button"
							title="←"
							onClick={e => {
								setTranspose(v => clamp(v - 1, -12, 12));
								e.currentTarget.blur();
							}}>
							−
						</button>
						<output>{`${pitchClass(TONIC_MIDI + transpose)} ${signed(transpose)}`}</output>
						<button
							type="button"
							title="→"
							onClick={e => {
								setTranspose(v => clamp(v + 1, -12, 12));
								e.currentTarget.blur();
							}}>
							+
						</button>
					</div>
				</div>

				<div className="group">
					<span className="glabel">도 위치</span>
					<select
						value={anchorIndex}
						onChange={e => {
							setAnchorIndex(Number(e.target.value));
							e.target.blur();
						}}>
						{WHITE_CODES.map((code, i) => (
							<option key={code} value={i}>
								{capOf(code).toUpperCase()}
							</option>
						))}
					</select>
				</div>

				<div className="group">
					<span className="glabel">볼륨</span>
					<input
						type="range"
						min="0"
						max="100"
						defaultValue="80"
						onInput={e => engineRef.current?.setVolume(Number(e.currentTarget.value) / 100)}
					/>
				</div>

				<div className="group">
					<span className="glabel">공간감</span>
					<input
						type="range"
						min="0"
						max="70"
						defaultValue="30"
						onInput={e => engineRef.current?.setSpace(Number(e.currentTarget.value) / 100)}
					/>
				</div>

				<div className="group">
					<button
						type="button"
						className={`sustain${sustainOn ? ' on' : ''}${pedalLatched ? ' latched' : ''}`}
						onClick={e => {
							setPedalLatched(v => !v);
							e.currentTarget.blur();
						}}>
						서스테인
					</button>
				</div>
			</header>

			<div className="stage">
				<div className="keyboard" ref={mountRef} />
			</div>

			<footer className="bar foot">
				<div className="help">
					<span>
						<kbd>Space</kbd> 서스테인
					</span>
					<span>
						<kbd>Tab</kbd> 고정
					</span>
					<span>
						<kbd>←</kbd>
						<kbd>→</kbd> 반음
					</span>
					<span>
						<kbd>↑</kbd>
						<kbd>↓</kbd> 옥타브
					</span>
					<span>
						<kbd>`</kbd>
						<kbd>1</kbd> 톤
					</span>
					<span>
						<kbd>Esc</kbd> 전부 끄기
					</span>
				</div>
				<div className="meter" ref={meterRef}>
					–
				</div>
			</footer>

			<div className={started ? 'gate hidden' : 'gate'}>
				아무 키나 누르거나 화면을 클릭하면 시작합니다
			</div>
		</div>
	);
}
