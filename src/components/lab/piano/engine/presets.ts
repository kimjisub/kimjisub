// 톤 프리셋. 오디오 파일을 쓰지 않고 오실레이터와 필터로만 소리를 만든다.
// 받아올 것이 없으므로 건반을 누른 시점과 소리가 나는 시점 사이에
// 네트워크도 디코드도 끼어들지 않는다.
//
// build(ctx, out, freq, midi, vel, t) 는 음 하나를 t 에 스케줄하고 보이스를 돌려준다.

/** 멈출 시각을 함께 들고 다니는 소리 원본. 이미 예약한 정지를 뒤로 미루지 않으려고 쓴다. */
interface Source {
  node: AudioScheduledSourceNode;
  stopTime: number;
}

export interface Voice {
  /** 손을 대지 않아도 소리가 완전히 사그라드는 시각. 지속음은 Infinity. */
  naturalEnd: number;
  readonly dead: boolean;
  /** 릴리즈를 예약하고 소리가 끝나는 시각을 돌려준다. fast 는 보이스 스틸링용 급정지. */
  release(t: number, fast?: boolean): number;
  dispose(): void;
}

export interface Preset {
  id: string;
  name: string;
  build(
    ctx: BaseAudioContext,
    out: AudioNode,
    freq: number,
    midi: number,
    vel: number,
    t: number,
  ): Voice;
}

let noiseBuffer: AudioBuffer | null = null;
let sineWaves: PeriodicWave[] | null = null;
let sawWaves: PeriodicWave[] | null = null;

// OscillatorNode 는 언제 시작하든 위상 0 에서 출발한다. 여러 음을 동시에 치면
// 모든 배음의 마루가 정확히 겹쳐 합이 음 개수만큼 뛰고, 그 순간만 리미터를
// 넘어 왜곡된다. 위상만 다른 파형을 미리 만들어 두고 오실레이터마다 골라 쓴다.
function phaseBank(ctx: BaseAudioContext, harmonics: number[], count = 24): PeriodicWave[] {
  const bank: PeriodicWave[] = [];
  const n = harmonics.length + 1;
  for (let i = 0; i < count; i++) {
    const phase = 2 * Math.PI * i / count;
    const real = new Float32Array(n);
    const imag = new Float32Array(n);
    for (let k = 1; k < n; k++) {
      const a = harmonics[k - 1];
      // sum a_k * sin(k(theta + phase)) 가 되도록 놓는다. cos 쪽에 a*cos 을
      // 넣으면 코사인 급수가 되어 톱니파가 원점에서 치솟는다.
      real[k] = a * Math.sin(phase * k);
      imag[k] = a * Math.cos(phase * k);
    }
    bank.push(ctx.createPeriodicWave(real, imag, { disableNormalization: true }));
  }
  return bank;
}

const pick = <T,>(bank: T[]): T => bank[(Math.random() * bank.length) | 0];

// 위상이 임의인 사인파. 이 파일에서 오실레이터는 전부 이걸로 만든다.
function sine(ctx: BaseAudioContext): OscillatorNode {
  const o = ctx.createOscillator();
  if (sineWaves) o.setPeriodicWave(pick(sineWaves));
  return o;
}

function saw(ctx: BaseAudioContext): OscillatorNode {
  const o = ctx.createOscillator();
  if (sawWaves) o.setPeriodicWave(pick(sawWaves));
  else o.type = 'sawtooth';
  return o;
}

// 노이즈 버퍼와 파형 뱅크를 첫 타건 때 만들면 그 한 번이 느려진다.
// 엔진을 만들 때 미리 채운다.
export function warmup(ctx: BaseAudioContext): void {
  const n = Math.floor(ctx.sampleRate * 0.5);
  noiseBuffer = ctx.createBuffer(1, n, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < n; i++) data[i] = Math.random() * 2 - 1;

  sineWaves = phaseBank(ctx, [1]);
  const sawHarmonics: number[] = [];
  for (let k = 1; k <= 48; k++) sawHarmonics.push(2 / (Math.PI * k));
  sawWaves = phaseBank(ctx, sawHarmonics);
}

function noise(ctx: BaseAudioContext): AudioBufferSourceNode {
  const s = ctx.createBufferSource();
  s.buffer = noiseBuffer;
  s.loop = true;
  return s;
}

const src = (node: AudioScheduledSourceNode, stopTime = Infinity): Source => ({ node, stopTime });

interface VoiceParts {
  sources: Source[];
  master: GainNode;
  /** 신호는 안 나르지만 정리할 때 같이 끊어야 하는 노드 (패너 등) */
  extras?: AudioNode[];
  naturalEnd?: number;
  releaseTime?: number;
}

function makeVoice(
  { sources, master, extras = [], naturalEnd = Infinity, releaseTime = 0.15 }: VoiceParts,
): Voice {
  let dead = false;
  return {
    naturalEnd,
    get dead() { return dead; },

    // 키에서 손을 뗐을 때. fast 는 보이스 스틸링용 급정지다.
    release(t: number, fast?: boolean): number {
      if (dead) return t;
      dead = true;
      const end = t + (fast ? 0.02 : releaseTime);
      master.gain.cancelScheduledValues(t);
      master.gain.setValueAtTime(master.gain.value, t);
      master.gain.linearRampToValueAtTime(0, end);
      for (const s of sources) {
        // 이미 더 이른 시각에 멈추기로 한 소스를 다시 늘리지 않는다.
        if (s.stopTime > end + 0.02) {
          try { s.node.stop(end + 0.02); } catch { /* 이미 멈춤 */ }
        }
      }
      return end;
    },

    dispose(): void {
      dead = true;
      for (const s of sources) {
        try { s.node.stop(); } catch { /* 이미 멈춤 */ }
        try { s.node.disconnect(); } catch { /* 이미 끊김 */ }
      }
      try { master.disconnect(); } catch { /* 이미 끊김 */ }
      for (const node of extras) {
        try { node.disconnect(); } catch { /* 이미 끊김 */ }
      }
    },
  };
}

// 엔벨로프를 걸 게인 노드는 반드시 0 에서 시작해야 한다. createGain() 의 기본값은
// 1 이고, 스케줄한 시각이 오디오 스레드 기준으로 이미 지나간 경우 타임라인이
// 적용되기 전 블록이 그 기본값 1 로 나간다. 엔벨로프 값은 0.05 언저리라 20배가
// 그대로 터진다. 0 에서 시작하면 같은 상황에서 아주 짧은 무음이 될 뿐이다.
function envGain(ctx: BaseAudioContext): GainNode {
  const g = ctx.createGain();
  g.gain.value = 0;
  return g;
}

function bus(ctx: BaseAudioContext, out: AudioNode): GainNode {
  const g = ctx.createGain();
  g.gain.value = 1;
  g.connect(out);
  return g;
}

// setTargetAtTime 의 시상수. T60(60dB 감쇠) 기준 대략 decay / 6.9 다.
const tau = (decay: number) => decay / 6.9;

// ── Grand Piano ────────────────────────────────────────────────────────────
// 배음마다 오실레이터를 따로 두고 각각 다른 속도로 감쇠시킨다. 진짜 피아노처럼
// 들리려면 배음 개수만으로는 모자라고 아래 네 가지가 같이 맞아야 한다.
//
//   비조화도    현이 뻣뻣해서 배음이 정수배보다 조금씩 높게 울린다.
//   타현 위치   해머가 현 길이의 1/8 을 때리므로 8배음과 그 배수가 죽는다.
//   2단 감쇠    한 음에 걸린 두 현이 처음에는 같이 울다가 위상이 어긋나면서
//               빠르게 한 번 꺾이고, 그 뒤로 훨씬 느리게 길게 남는다.
//   유니즌      두 현의 음높이가 미세하게 달라 배음마다 다른 속도로 맥놀이한다.
function grand(
  ctx: BaseAudioContext, out: AudioNode,
  freq: number, midi: number, vel: number, t: number,
): Voice {
  const nyq = ctx.sampleRate / 2;

  // 같은 건반을 연달아 쳐도 똑같이 들리지 않게 세기를 조금 흔든다.
  const v = vel * (0.93 + Math.random() * 0.14);

  const master = ctx.createGain();
  master.gain.value = 1;
  // 연주자가 앉은 자리에서 들리는 대로 저음은 왼쪽, 고음은 오른쪽에 둔다.
  const panner = ctx.createStereoPanner();
  panner.pan.value = Math.max(-0.5, Math.min(0.5, (midi - 60) / 48));
  master.connect(panner);
  panner.connect(out);

  const decay = 20 * Math.pow(2, -(midi - 21) / 27);
  const fastTau = 0.055 + 0.10 * Math.pow(2, -(midi - 21) / 45);
  const knee = 0.30;
  const B = 0.00022 + 0.0018 * Math.max(0, (midi - 45) / 45);
  const strike = 1 / 8;
  const bright = 20 * Math.pow(2, -(midi - 36) / 40);   // 배음이 몇 번째까지 사나
  const unison = midi < 33 ? 0 : 1.3;   // 최저음역은 현이 하나라 맥놀이가 없다

  // 저음현은 배음이 훨씬 위까지 살아 있다. 20개로 끊으면 먹먹해진다.
  const limit = Math.max(5, Math.min(midi < 48 ? 32 : 20, Math.floor(nyq * 0.7 / freq)));
  const parts: { n: number; f: number; a: number }[] = [];
  let norm = 0;
  for (let n = 1; n <= limit; n++) {
    const f = freq * n * Math.sqrt(1 + B * n * n);
    if (f > nyq * 0.92) break;
    const a = Math.pow(n, -0.55) * Math.exp(-(n - 1) / bright)
      * Math.abs(Math.sin(Math.PI * n * strike));
    if (a < 0.002) continue;            // 타현 위치가 죽인 배음
    parts.push({ n, f, a });
    norm += a * a;
  }
  norm = Math.sqrt(norm) || 1;

  const naturalEnd = t + decay + 0.4;
  const sources: Source[] = [];

  for (const { n, f, a } of parts) {
    const pair = unison > 0 && n <= 8;
    const peak = v * 0.48 * a / norm / (pair ? 2 : 1);
    const rest = peak * 0.36 * Math.pow(0.93, n - 1);   // 꺾인 뒤 남는 양
    const atk = 0.0015 + 0.0025 / n;                    // 고배음이 먼저 도착한다

    const g = envGain(ctx);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + atk);
    // 첫 꺾임의 속도는 배음마다 비슷하다. 배음별 차이는 뒷울림 쪽에 둔다.
    g.gain.setTargetAtTime(rest, t + atk, fastTau / (1 + 0.08 * (n - 1)));
    g.gain.setTargetAtTime(0, t + knee, tau(decay / (1 + 0.6 * (n - 1))));
    g.connect(master);

    for (const cents of pair ? [-unison, unison] : [0]) {
      const o = sine(ctx);
      o.frequency.value = f;
      o.detune.value = cents;
      o.connect(g);
      o.start(t);
      o.stop(naturalEnd);
      sources.push(src(o, naturalEnd));
    }
  }

  // 해머가 현을 때리는 소리. 짧고 넓게 퍼져야 "톡" 하고 들린다.
  const hammer = noise(ctx);
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = Math.min(freq * 1.2, 900);
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = Math.min(freq * 18, nyq * 0.6);
  lp.Q.value = 0.5;
  const hg = envGain(ctx);
  hg.gain.setValueAtTime(0.0001, t);
  hg.gain.linearRampToValueAtTime(v * 0.10, t + 0.0008);
  hg.gain.exponentialRampToValueAtTime(0.0001, t + 0.028);
  hammer.connect(hp); hp.connect(lp); lp.connect(hg); hg.connect(master);
  hammer.start(t, Math.random() * 0.4);
  hammer.stop(t + 0.04);
  sources.push(src(hammer, t + 0.04));

  // 댐퍼는 저음일수록 느리게 닿는다.
  const releaseTime = midi < 45 ? 0.24 : midi < 72 ? 0.13 : 0.07;
  return makeVoice({ sources, master, extras: [panner], naturalEnd, releaseTime });
}

// ── Electric Piano ─────────────────────────────────────────────────────────
// 2-operator FM. 모듈레이터를 빠르게 죽여 어택에만 금속성 종소리가 남게 한다.
function electric(
  ctx: BaseAudioContext, out: AudioNode,
  freq: number, midi: number, vel: number, t: number,
): Voice {
  const master = bus(ctx, out);
  const decay = 5.5 * Math.pow(2, -(midi - 36) / 30);
  const naturalEnd = t + decay + 0.3;

  const car = sine(ctx);
  car.frequency.value = freq;
  const ce = envGain(ctx);
  ce.gain.setValueAtTime(0, t);
  ce.gain.linearRampToValueAtTime(vel * 0.42, t + 0.004);
  ce.gain.setTargetAtTime(0, t + 0.004, tau(decay));
  car.connect(ce); ce.connect(master);

  const mod = sine(ctx);
  mod.frequency.value = freq * 13;
  const mg = envGain(ctx);
  mg.gain.setValueAtTime(freq * 6.5 * vel, t);
  mg.gain.setTargetAtTime(0, t, 0.042);
  mod.connect(mg); mg.connect(car.frequency);

  const body = sine(ctx);
  body.frequency.value = freq * 2;
  const be = envGain(ctx);
  be.gain.setValueAtTime(0, t);
  be.gain.linearRampToValueAtTime(vel * 0.11, t + 0.006);
  be.gain.setTargetAtTime(0, t + 0.006, tau(decay * 0.5));
  body.connect(be); be.connect(master);

  const sources: Source[] = [];
  for (const o of [car, mod, body]) {
    o.start(t);
    o.stop(naturalEnd);
    sources.push(src(o, naturalEnd));
  }
  return makeVoice({ sources, master, naturalEnd, releaseTime: 0.16 });
}

// ── Organ ──────────────────────────────────────────────────────────────────
// 드로바 가산합성. 감쇠하지 않고 손을 뗄 때까지 지속한다.
const DRAWBARS: [number, number][] = [[1, 1], [2, 0.55], [3, 0.34], [4, 0.24], [6, 0.13], [8, 0.10]];

function organ(
  ctx: BaseAudioContext, out: AudioNode,
  freq: number, midi: number, vel: number, t: number,
): Voice {
  const nyq = ctx.sampleRate / 2;
  const master = bus(ctx, out);
  const env = envGain(ctx);
  env.gain.setValueAtTime(0, t);
  env.gain.linearRampToValueAtTime(vel * 0.16, t + 0.008);
  env.connect(master);

  const sources: Source[] = [];
  for (const [mult, level] of DRAWBARS) {
    const f = freq * mult;
    if (f > nyq * 0.9) continue;
    const g = ctx.createGain();
    g.gain.value = level;
    const o = sine(ctx);
    o.frequency.value = f;
    o.connect(g); g.connect(env);
    o.start(t);
    sources.push(src(o));
  }
  // 살짝 어긋난 기음 하나가 코러스감을 만든다.
  const det = sine(ctx);
  det.frequency.value = freq;
  det.detune.value = 6;
  const dg = ctx.createGain();
  dg.gain.value = 0.5;
  det.connect(dg); dg.connect(env);
  det.start(t);
  sources.push(src(det));

  return makeVoice({ sources, master, releaseTime: 0.05 });
}

// ── Music Box ──────────────────────────────────────────────────────────────
// 정수배가 아닌 배음비로 종·오르골 특유의 금속성 울림을 낸다.
const BELL: [number, number, number][] = [[1, 1, 1.1], [2.76, 0.48, 0.55], [5.40, 0.26, 0.34], [8.93, 0.14, 0.22]];

function musicbox(
  ctx: BaseAudioContext, out: AudioNode,
  freq: number, midi: number, vel: number, t: number,
): Voice {
  const nyq = ctx.sampleRate / 2;
  const master = bus(ctx, out);
  const scale = Math.pow(2, -(midi - 60) / 34);
  const sources: Source[] = [];
  let longest = 0;

  for (const [ratio, amp, dec] of BELL) {
    const f = freq * ratio;
    if (f > nyq * 0.9) continue;
    const d = dec * scale;
    longest = Math.max(longest, d);
    const g = envGain(ctx);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vel * 0.30 * amp, t + 0.002);
    g.gain.setTargetAtTime(0, t + 0.002, tau(d));
    const o = sine(ctx);
    o.frequency.value = f;
    o.connect(g); g.connect(master);
    o.start(t);
    sources.push(src(o, 0));
  }
  const naturalEnd = t + longest + 0.3;
  for (const s of sources) {
    s.stopTime = naturalEnd;
    try { s.node.stop(naturalEnd); } catch { /* noop */ }
  }
  return makeVoice({ sources, master, naturalEnd, releaseTime: 0.2 });
}

// ── Synth Pad ──────────────────────────────────────────────────────────────
function pad(
  ctx: BaseAudioContext, out: AudioNode,
  freq: number, midi: number, vel: number, t: number,
): Voice {
  const master = bus(ctx, out);
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.Q.value = 1.2;
  lp.frequency.setValueAtTime(Math.min(freq * 2, 700), t);
  lp.frequency.linearRampToValueAtTime(Math.min(freq * 7, 4200), t + 0.9);
  const env = envGain(ctx);
  env.gain.setValueAtTime(0, t);
  env.gain.linearRampToValueAtTime(vel * 0.16, t + 0.25);
  lp.connect(env); env.connect(master);

  const sources: Source[] = [];
  for (const cents of [-7, 7]) {
    const o = saw(ctx);
    o.frequency.value = freq;
    o.detune.value = cents;
    o.connect(lp);
    o.start(t);
    sources.push(src(o));
  }
  return makeVoice({ sources, master, releaseTime: 0.7 });
}

// ── Pluck ──────────────────────────────────────────────────────────────────
// 컷오프를 빠르게 떨어뜨려 뜯은 현이 어두워지며 사라지는 것을 흉내낸다.
function pluck(
  ctx: BaseAudioContext, out: AudioNode,
  freq: number, midi: number, vel: number, t: number,
): Voice {
  const nyq = ctx.sampleRate / 2;
  const master = bus(ctx, out);
  const decay = 1.6 * Math.pow(2, -(midi - 48) / 30);
  const naturalEnd = t + decay + 0.2;

  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.Q.value = 3;
  lp.frequency.setValueAtTime(Math.min(freq * 14, nyq * 0.9), t);
  lp.frequency.exponentialRampToValueAtTime(Math.max(freq * 1.8, 60), t + 0.28);
  const env = envGain(ctx);
  env.gain.setValueAtTime(0, t);
  env.gain.linearRampToValueAtTime(vel * 0.26, t + 0.002);
  env.gain.setTargetAtTime(0, t + 0.002, tau(decay));
  lp.connect(env); env.connect(master);

  const o = saw(ctx);
  o.frequency.value = freq;
  o.connect(lp);
  o.start(t);
  o.stop(naturalEnd);

  const click = noise(ctx);
  const cg = envGain(ctx);
  cg.gain.setValueAtTime(0.0001, t);
  cg.gain.linearRampToValueAtTime(vel * 0.14, t + 0.001);
  cg.gain.exponentialRampToValueAtTime(0.0001, t + 0.02);
  click.connect(cg); cg.connect(lp);
  click.start(t, Math.random() * 0.4);
  click.stop(t + 0.03);

  return makeVoice({
    sources: [src(o, naturalEnd), src(click, t + 0.03)],
    master, naturalEnd, releaseTime: 0.09,
  });
}

export const PRESETS: Preset[] = [
  { id: 'grand', name: 'Grand Piano', build: grand },
  { id: 'electric', name: 'Electric Piano', build: electric },
  { id: 'organ', name: 'Organ', build: organ },
  { id: 'musicbox', name: 'Music Box', build: musicbox },
  { id: 'pad', name: 'Synth Pad', build: pad },
  { id: 'pluck', name: 'Pluck', build: pluck },
];
