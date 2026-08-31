// 오디오 엔진. AudioContext 수명, 보이스 할당, 서스테인 페달, 지연 측정을 맡는다.
//
// 지연을 줄이는 규칙이 여기 다 들어 있다.
//   1. latencyHint 'interactive' 로 출력 버퍼를 최소로 잡는다.
//   2. 컨텍스트는 페이지가 뜰 때 미리 만들고 첫 입력에서 resume 만 한다.
//   3. noteOn 안에 await 가 하나도 없다. 전부 동기로 스케줄한다.
//   4. ctx.currentTime 에 바로 건다. 룩어헤드를 두지 않는다.
//   5. 리미터는 WaveShaper 다. DynamicsCompressor 는 룩어헤드만큼 소리를 늦춘다.

import { midiToFreq } from './keymap';
import { PRESETS, warmup } from './presets';
import type { Preset, Voice } from './presets';
import { GmBank } from './gmInstrument';
import type { GmProgress } from './gmInstrument';
import { SampledGrand } from './sampledGrand';
import type { SampledProgress } from './sampledGrand';

const MAX_VOICES = 32;

// 임펄스 응답을 파일로 받지 않고 그 자리에서 만든다. 잡음을 지수적으로 줄이면서
// 갈수록 어둡게 깎으면 작은 홀 비슷한 잔향이 된다.
function impulseResponse(ctx: BaseAudioContext, seconds = 1.8): AudioBuffer {
  const sr = ctx.sampleRate;
  const len = Math.floor(sr * seconds);
  const preDelay = Math.floor(sr * 0.012);
  const buf = ctx.createBuffer(2, len, sr);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    let lp = 0;
    for (let i = preDelay; i < len; i++) {
      const x = (i - preDelay) / (len - preDelay);
      lp += ((Math.random() * 2 - 1) - lp) * (0.6 - 0.45 * x);
      d[i] = lp * Math.pow(1 - x, 2.4);
    }
  }
  return buf;
}

// 소프트 리미터. WaveShaper 입력은 -1..1 로 잘리므로 앞에 DRIVE 를 곱해
// 네 배 여유를 두고 곡선 쪽에서 그만큼 되돌린다. 0.7 아래는 손대지 않고
// 그 위만 눕히므로 보통 연주에는 왜곡이 붙지 않는다.
const LIMITER_DRIVE = 0.25;
const LIMITER_KNEE = 0.7;

function softClipCurve(n = 8192) {
  const curve = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const s = ((i / (n - 1)) * 2 - 1) / LIMITER_DRIVE;
    const a = Math.abs(s);
    const y = a <= LIMITER_KNEE
      ? a
      : LIMITER_KNEE + (1 - LIMITER_KNEE) * Math.tanh((a - LIMITER_KNEE) / (1 - LIMITER_KNEE));
    curve[i] = Math.sign(s) * y;
  }
  return curve;
}

/** 보이스에 어느 입력이 붙잡고 있는지 표시해 둔다. 키보드는 code, 마우스는 `m:code`. */
type HeldVoice = Voice & { id?: string };

export class AudioEngine {
  readonly ctx: AudioContext;
  readonly limiter: WaveShaperNode;
  readonly drive: GainNode;
  readonly master: GainNode;
  readonly bus: GainNode;
  readonly reverb: ConvolverNode;
  readonly wet: GainNode;

  preset: Preset;
  sustain: boolean;
  /** Grand Piano 만 샘플로 대체한다. 나머지 합성 톤은 용량이 0 이라 그대로 둔다. */
  sampled: SampledGrand | null = null;
  /** General MIDI 악기. 고른 뒤에 받으므로 첫 방문 용량은 안 늘어난다. */
  gm: GmBank | null = null;
  /** 비어 있지 않으면 합성 프리셋 대신 이 GM 악기를 쓴다. */
  gmName = '';
  /** 입력 id -> 보이스 */
  held: Map<string, HeldVoice>;
  /** 페달이 붙잡고 있는 보이스 */
  pedal: HeldVoice[];
  /** 스틸링 순서 (오래된 것이 앞) */
  active: HeldVoice[];
  lastScheduleMs: number;

  constructor() {
    const Ctor: typeof AudioContext =
      window.AudioContext
      ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new Ctor({ latencyHint: 'interactive' });
    warmup(this.ctx);

    this.limiter = this.ctx.createWaveShaper();
    this.limiter.curve = softClipCurve();
    this.limiter.oversample = 'none'; // 오버샘플링은 지연을 만든다
    this.limiter.connect(this.ctx.destination);

    this.drive = this.ctx.createGain();
    this.drive.gain.value = LIMITER_DRIVE;
    this.drive.connect(this.limiter);

    this.master = this.ctx.createGain();
    this.master.gain.value = 0.8;
    this.master.connect(this.drive);

    // 보이스는 전부 bus 로 들어온다. bus 에서 master 로 가는 직접음은 컨볼버를
    // 거치지 않으므로, 잔향을 켜도 타건에서 소리까지의 지연은 그대로다.
    this.bus = this.ctx.createGain();
    this.bus.connect(this.master);

    this.reverb = this.ctx.createConvolver();
    this.reverb.buffer = impulseResponse(this.ctx);
    this.wet = this.ctx.createGain();
    this.wet.gain.value = 0.3;
    this.bus.connect(this.reverb);
    this.reverb.connect(this.wet);
    this.wet.connect(this.master);

    this.preset = PRESETS[0];
    this.sustain = false;

    this.held = new Map();
    this.pedal = [];
    this.active = [];

    this.lastScheduleMs = 0;
  }

  get running(): boolean {
    return this.ctx.state === 'running';
  }

  // 첫 사용자 입력에서 한 번만 부른다. 이후 타건 경로에는 이 호출이 없다.
  resume(): Promise<void> {
    if (this.ctx.state !== 'running') return this.ctx.resume();
    return Promise.resolve();
  }

  setPreset(preset: Preset): void {
    this.preset = preset;
  }

  /**
   * 샘플 음원을 뒤에서 받기 시작한다. 받는 동안에도 합성으로 소리가 나고,
   * 다 받으면 Grand Piano 만 조용히 갈아탄다.
   */
  loadSamples(onProgress?: (p: SampledProgress) => void): void {
    if (this.sampled) return;
    this.sampled = new SampledGrand(this.ctx, this.bus, onProgress);
  }

  prepareGm(onProgress?: (p: GmProgress) => void): void {
    if (this.gm) return;
    this.gm = new GmBank(this.ctx, this.bus, onProgress);
  }

  /** 빈 문자열이면 합성 프리셋으로 돌아간다. */
  selectGm(name: string): void {
    this.gmName = name;
    if (name) this.gm?.select(name);
  }

  /**
   * 건반에 올라온 음역을 알린다. 아직 안 받은 범위면 뒤에서 받기 시작한다.
   * 배치가 바뀔 때만 부르므로 타건 경로에는 없다.
   */
  coverRange(lo: number, hi: number): void {
    this.sampled?.ensure(lo, hi);
  }

  /** 지금 이 음을 샘플로 낼 수 있는가. 아직 안 받은 음은 합성으로 낸다. */
  private useSampled(midi: number): boolean {
    return !this.gmName
      && this.preset.id === 'grand'
      && this.sampled?.ready === true
      && this.sampled.covers(midi);
  }

  private useGm(): boolean {
    return this.gmName !== '' && this.gm?.ready === true && this.gm.current === this.gmName;
  }

  /** 샘플러가 낸 음을 보이스 모양으로 감싼다. 페달·스틸링 로직을 그대로 쓰려는 것이다. */
  private wrapSampled(stop: (at: number) => void, t: number, tail: number): Voice {
    let dead = false;
    return {
      naturalEnd: t + 14,
      get dead() { return dead; },
      release(rt: number, fast?: boolean): number {
        if (dead) return rt;
        dead = true;
        stop(rt);
        return rt + (fast ? 0.05 : tail);
      },
      dispose(): void { dead = true; },
    };
  }



  setVolume(v: number): void {
    this.master.gain.setTargetAtTime(v, this.ctx.currentTime, 0.01);
  }

  setSpace(v: number): void {
    this.wet.gain.setTargetAtTime(v, this.ctx.currentTime, 0.02);
  }

  noteOn(id: string, midi: number, vel = 0.85): void {
    const t0 = performance.now();
    const t = this.ctx.currentTime;

    const prev = this.held.get(id);
    if (prev) this.retire(prev, t, true);

    this.prune(t);
    while (this.active.length >= MAX_VOICES) this.retire(this.active[0], t, true);

    let voice: HeldVoice;
    if (this.useGm()) {
      voice = this.wrapSampled(this.gm!.start(midi, vel, t), t, 0.25);
    } else if (this.useSampled(midi)) {
      voice = this.wrapSampled(this.sampled!.start(midi, vel, t), t, 0.7);
    } else {
      voice = this.preset.build(this.ctx, this.bus, midiToFreq(midi), midi, vel, t);
    }
    voice.id = id;
    this.held.set(id, voice);
    this.active.push(voice);

    this.lastScheduleMs = performance.now() - t0;
  }

  noteOff(id: string): void {
    const voice = this.held.get(id);
    if (!voice) return;
    this.held.delete(id);
    if (this.sustain) {
      this.pedal.push(voice);
      return;
    }
    this.retire(voice, this.ctx.currentTime, false);
  }

  setSustain(on: boolean): void {
    if (on === this.sustain) return;
    this.sustain = on;
    if (on) return;
    const t = this.ctx.currentTime;
    for (const voice of this.pedal.slice()) this.retire(voice, t, false);
    this.pedal.length = 0;
  }

  // 창이 포커스를 잃었을 때 keyup 을 놓쳐 음이 물리는 것을 막는다.
  releaseAll(): void {
    const t = this.ctx.currentTime;
    const sounding = Array.from(this.held.values()).concat(this.pedal);
    for (const voice of sounding) this.retire(voice, t, false);
    this.held.clear();
    this.pedal.length = 0;
  }

  latency(): { outputMs: number; scheduleMs: number; sampleRate: number } {
    const base = this.ctx.baseLatency ?? 0;
    const out = this.ctx.outputLatency ?? 0;
    return {
      outputMs: (base + out) * 1000,
      scheduleMs: this.lastScheduleMs,
      sampleRate: this.ctx.sampleRate,
    };
  }

  // 페이지를 떠날 때 오디오 컨텍스트까지 닫는다. 남겨두면 탭이 계속 오디오
  // 장치를 붙잡고 있고, 뒤로 갔다 다시 들어오면 컨텍스트가 하나 더 생긴다.
  destroy(): void {
    this.releaseAll();
    this.sampled?.dispose();
    this.sampled = null;
    this.gm?.dispose();
    this.gm = null;
    void this.ctx.close().catch(() => { /* 이미 닫힘 */ });
  }

  private retire(voice: HeldVoice, t: number, fast: boolean): void {
    const end = voice.release(t, fast);
    this.drop(voice);
    const wait = Math.max(0, (end - this.ctx.currentTime) * 1000) + 80;
    setTimeout(() => voice.dispose(), wait);
  }

  private drop(voice: HeldVoice): void {
    let i = this.active.indexOf(voice);
    if (i >= 0) this.active.splice(i, 1);
    i = this.pedal.indexOf(voice);
    if (i >= 0) this.pedal.splice(i, 1);
    if (voice.id != null && this.held.get(voice.id) === voice) this.held.delete(voice.id);
  }

  // 손을 뗀 적 없지만 이미 다 사그라든 보이스가 자리를 차지하지 않게 한다.
  private prune(t: number): void {
    if (this.active.length === 0) return;
    const still: HeldVoice[] = [];
    for (const voice of this.active) {
      if (voice.naturalEnd > t) { still.push(voice); continue; }
      voice.dispose();
      const i = this.pedal.indexOf(voice);
      if (i >= 0) this.pedal.splice(i, 1);
    }
    this.active = still;
  }
}
