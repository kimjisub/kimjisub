// 샘플 그랜드 피아노. 합성으로는 진짜 피아노 소리에 닿지 못해서 실제 녹음을
// 쓴다. 음원은 AKAI 가 2000년대 초 퍼블릭 도메인으로 푼 Steinway 샘플이고
// smplr 이 GitHub Pages 에서 받아온다.
//
// 두 가지를 지킨다.
//   페이지를 막지 않는다   합성 엔진이 먼저 소리를 내고, 다 받으면 갈아탄다.
//                          못 받아오면 합성이 그대로 남는다.
//   안 치는 음은 안 받는다 지금 건반에 올라와 있는 음역만 받는다. 옥타브나
//                          조옮김으로 범위를 벗어나면 그때 넓혀서 다시 받는다.

import { CacheStorage, SplendidGrandPiano } from 'smplr';

import { midiToFreq } from './keymap';
import { hammer } from './presets';

/** 넓힐 때는 요청 범위보다 조금 더 받아 둔다. 한 칸 옮길 때마다 다시 받지 않으려고. */
const MARGIN = 6;

// 음원에는 세기별 레이어가 다섯 있다 (PPP 1-40, PP 41-67, MP 68-84,
// MF 85-100, FF 101-127). 자판에는 세기가 없어 한 대역만 쓰므로 그 두 층만
// 받는다. 다섯 층을 다 받으면 기본 음역만 해도 9.3MB 인데 두 층이면 5.4MB 다.
const VEL_RANGE: [number, number] = [68, 100];
/** 메조포르테. 포르티시모로 고정하면 모든 음이 때리는 소리가 된다. */
const VEL_CENTER = 88;
const VEL_JITTER = 8;

// 녹음은 최대 진폭까지 20ms 가 걸린다(50% 도달에 7~8ms). 실제 피아노가 원래
// 그렇지만, 그만큼 타건이 늦게 느껴진다. 두 가지로 앞을 당긴다.
// 0.8ms 에 최대인 해머 소리를 샘플 위에 깐다. 몸통은 샘플 그대로 두고 첫
// 순간의 반응만 되살린다. smplr 은 노트 단위 offset 을 안 받아서 샘플 앞을
// 잘라내는 방법은 쓸 수 없다.
const HAMMER_LEVEL = 0.055;

// 손을 뗐을 때 소리가 잦아드는 시간. smplr 은 이 값만큼 선형으로 줄인다.
// 실제 피아노 댐퍼는 저음일수록 느리게 닿는다. 여기를 길게 잡으면 짧게 친
// 음도 길게 울려서 스타카토가 안 된다.
function damperSec(midi: number): number {
  if (midi < 45) return 0.28;
  if (midi < 72) return 0.16;
  return 0.09;
}
const LOWEST = 21;  // A0
const HIGHEST = 108; // C8

const clamp = (v: number) => Math.max(LOWEST, Math.min(HIGHEST, v));

const range = (lo: number, hi: number) =>
  Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);

type Instrument = ReturnType<typeof SplendidGrandPiano>;

export type SampledState = 'idle' | 'loading' | 'ready' | 'failed';

export interface SampledProgress {
  state: SampledState;
  loaded: number;
  total: number;
}

export class SampledGrand {
  private ctx: BaseAudioContext;
  private out: AudioNode;
  private instrument: Instrument | null = null;
  private onProgress?: (p: SampledProgress) => void;
  private storage = CacheStorage();
  private low = 0;
  private high = -1;
  private pending: Promise<void> | null = null;

  state: SampledState = 'idle';
  loaded = 0;
  total = 0;

  constructor(ctx: BaseAudioContext, out: AudioNode, onProgress?: (p: SampledProgress) => void) {
    this.ctx = ctx;
    this.out = out;
    this.onProgress = onProgress;
  }

  private emit(): void {
    this.onProgress?.({ state: this.state, loaded: this.loaded, total: this.total });
  }

  /**
   * 이 음역을 낼 수 있게 만든다. 이미 덮고 있으면 아무것도 안 한다.
   * 처음 부를 때는 합성이 소리를 내는 동안 뒤에서 받는다.
   */
  ensure(lo: number, hi: number): void {
    if (lo >= this.low && hi <= this.high) return;
    if (this.pending) return;

    const nextLow = clamp(Math.min(lo, this.low === 0 ? lo : this.low) - MARGIN);
    const nextHigh = clamp(Math.max(hi, this.high) + MARGIN);

    this.state = this.instrument ? this.state : 'loading';
    this.emit();

    this.pending = (async () => {
      try {
        const next = SplendidGrandPiano(this.ctx, {
          destination: this.out,
          // 재방문 때 다시 받지 않는다. GitHub Pages 는 초당 요청도 제한한다.
          storage: this.storage,
          volume: 110,
          decayTime: 0.16, // 음마다 ampRelease 로 덮어쓰지만 기본값도 맞춰 둔다
          notesToLoad: { notes: range(nextLow, nextHigh), velocityRange: VEL_RANGE },
          onLoadProgress: ({ loaded, total }) => {
            this.loaded = loaded;
            this.total = total;
            this.emit();
          },
        });
        await next.ready;

        const previous = this.instrument;
        this.instrument = next;
        this.low = nextLow;
        this.high = nextHigh;
        this.state = 'ready';
        // 울리던 음이 끊기지 않게 조금 뒤에 정리한다.
        if (previous) setTimeout(() => previous.dispose(), 4000);
      } catch {
        // 넓히기에 실패해도 이미 받아 둔 음역은 그대로 쓴다.
        if (!this.instrument) this.state = 'failed';
      } finally {
        this.pending = null;
        this.emit();
      }
    })();
  }

  get ready(): boolean {
    return this.state === 'ready' && this.instrument != null;
  }

  /** 이 음이 지금 받아 둔 범위 안인가. 벗어나면 합성으로 낸다. */
  covers(midi: number): boolean {
    return midi >= this.low && midi <= this.high;
  }

  /**
   * 음 하나를 t 에 울리고 멈추는 함수를 돌려준다. 세기는 받아 둔 레이어 안에서만
   * 흔든다. 밖으로 나가면 해당 샘플이 없어 소리가 안 난다.
   */
  /** 이 음의 댐퍼 시간. 보이스 정리 시점을 맞추는 데 쓴다. */
  releaseSec(midi: number): number {
    return damperSec(midi);
  }

  start(midi: number, velocity: number, t: number): (at: number) => void {
    const jitter = (Math.random() * 2 - 1) * VEL_JITTER;
    const v = Math.round(VEL_CENTER * (0.6 + 0.4 * velocity / 0.85) + jitter);
    const stop = this.instrument!.start({
      note: midi,
      velocity: Math.max(VEL_RANGE[0] + 2, Math.min(VEL_RANGE[1] - 2, v)),
      time: t,
      ampRelease: damperSec(midi),
    });
    hammer(this.ctx, this.out, midiToFreq(midi), HAMMER_LEVEL * velocity, t);
    return (at: number) => stop(at);
  }

  dispose(): void {
    this.instrument?.dispose();
    this.instrument = null;
    this.state = 'idle';
    this.low = 0;
    this.high = -1;
  }
}
