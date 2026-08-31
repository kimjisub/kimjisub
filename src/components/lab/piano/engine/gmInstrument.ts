// General MIDI 악기. smplr 의 Soundfont 로 125종을 다 쓸 수 있다.
//
// 고를 때만 받는다. 첫 방문에 받는 것은 그랜드 피아노뿐이고, 다른 악기는
// 사용자가 그 악기를 고른 뒤에 받기 시작한다. 받는 동안에는 소리가 안 나므로
// 진행률을 화면에 띄운다.

import { CacheStorage, getSoundfontNames, Soundfont } from 'smplr';

type Instrument = ReturnType<typeof Soundfont>;

export type GmState = 'idle' | 'loading' | 'ready' | 'failed';

export interface GmProgress {
  name: string;
  state: GmState;
  loaded: number;
  total: number;
}

/** `acoustic_grand_piano` 를 `Acoustic Grand Piano` 로. */
export function gmLabel(name: string): string {
  return name
    .split('_')
    .map(w => (w.length > 2 ? w[0].toUpperCase() + w.slice(1) : w.toUpperCase()))
    .join(' ');
}

export function gmNames(): string[] {
  return getSoundfontNames().slice().sort();
}

export class GmBank {
  private ctx: BaseAudioContext;
  private out: AudioNode;
  private onProgress?: (p: GmProgress) => void;
  private storage = CacheStorage();
  private loaded = new Map<string, Instrument>();
  private loading = new Set<string>();

  current = '';
  state: GmState = 'idle';

  constructor(ctx: BaseAudioContext, out: AudioNode, onProgress?: (p: GmProgress) => void) {
    this.ctx = ctx;
    this.out = out;
    this.onProgress = onProgress;
  }

  private emit(loaded = 0, total = 0): void {
    this.onProgress?.({ name: this.current, state: this.state, loaded, total });
  }

  /** 이 악기로 바꾼다. 아직 안 받았으면 받기 시작한다. */
  select(name: string): void {
    this.current = name;
    if (this.loaded.has(name)) {
      this.state = 'ready';
      this.emit();
      return;
    }
    this.state = 'loading';
    this.emit();
    if (this.loading.has(name)) return;
    this.loading.add(name);

    void (async () => {
      try {
        const inst = Soundfont(this.ctx, {
          instrument: name,
          destination: this.out,
          storage: this.storage,
          volume: 105,
          onLoadProgress: ({ loaded, total }) => {
            if (this.current === name) {
              this.state = 'loading';
              this.emit(loaded, total);
            }
          },
        });
        await inst.ready;
        this.loaded.set(name, inst);
        if (this.current === name) {
          this.state = 'ready';
          this.emit();
        }
      } catch {
        if (this.current === name) {
          this.state = 'failed';
          this.emit();
        }
      } finally {
        this.loading.delete(name);
      }
    })();
  }

  get ready(): boolean {
    return this.state === 'ready' && this.loaded.has(this.current);
  }

  start(midi: number, velocity: number, t: number): (at: number) => void {
    const stop = this.loaded.get(this.current)!.start({
      note: midi,
      velocity: Math.max(1, Math.min(127, Math.round(velocity * 110))),
      time: t,
    });
    return (at: number) => stop(at);
  }

  dispose(): void {
    this.loaded.forEach(i => i.dispose());
    this.loaded.clear();
    this.loading.clear();
    this.current = '';
    this.state = 'idle';
  }
}
