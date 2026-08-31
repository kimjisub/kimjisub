// QWERTY 물리 배치를 피아노 건반으로 옮긴다.
// 흰건반 두 줄(q…\, z…/)이 낮은음에서 높은음으로 이어지고,
// 각 흰건반 줄 바로 위의 줄(숫자행, asdf행)이 그 줄의 검은건반이다.
//
// 모든 식별자는 event.key 가 아니라 event.code 다. 물리 위치 기준이라
// 한글 입력 상태에서도, Shift 를 눌러도 같은 건반이 눌린다.

export const WHITE_CODES = [
  'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP',
  'BracketLeft', 'BracketRight', 'Backslash',
  'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash',
];

// BLACK_SLOT_CODES[i] 는 WHITE_CODES[i] 와 WHITE_CODES[i + 1] 사이 위쪽 자리다.
// 윗줄 흰건반의 검은건반은 숫자행이고, `[` `]` `\` 위는 `-` `=` Backspace 다.
// `\` 와 `z` 는 줄이 갈리는 자리라 그 사이 검은건반은 asdf 행 맨 왼쪽인 `a` 가 맡는다.
export const BLACK_SLOT_CODES = [
  'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0',
  'Minus', 'Equal', 'Backspace',
  'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon',
];

const CAP: Record<string, string> = {
  Comma: ',', Period: '.', Slash: '/', Semicolon: ';', Quote: "'",
  Minus: '-', Equal: '=', Backspace: '⌫', Backquote: '`',
  BracketLeft: '[', BracketRight: ']', Backslash: '\\',
};

export function capOf(code: string): string {
  return CAP[code] ?? code.replace(/^(Key|Digit)/, '');
}

const MAJOR = [0, 2, 4, 5, 7, 9, 11];
const SOLFEGE = ['도', '레', '미', '파', '솔', '라', '시'];
const NOTE = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];

const mod = (n: number, m: number) => ((n % m) + m) % m;

export function pitchClass(midi: number): string {
  return NOTE[mod(midi, 12)];
}

export function noteName(midi: number): string {
  return NOTE[mod(midi, 12)] + (Math.floor(midi / 12) - 1);
}

export function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// 도를 0 으로 놓은 음계 위치를 반음 수로 바꾼다. 음수는 아래 옥타브다.
function degreeToSemitone(d: number): number {
  return MAJOR[mod(d, 7)] + 12 * Math.floor(d / 7);
}

// 흰건반 23개가 3옥타브를 조금 넘게 덮는다. 기본 도를 C3 에 두면 가온다가
// 가운데쯤(`i`)에 오고 위아래가 고르게 남는다.
export const TONIC_MIDI = 48;

export interface PianoKey {
  code: string;
  slot: number;
  kind: 'white' | 'black';
  /** 검은건반 자리 중 실제로 음이 있는 자리인지. 흰건반은 항상 true. */
  exists: boolean;
  midi: number;
  cap: string;
  solfege: string;
  isTonic: boolean;
}

export interface LayoutOptions {
  /** 흰건반 23개 중 도가 놓일 자리 (0 이면 q) */
  anchorIndex: number;
  /** 반음 단위 조옮김 */
  transpose: number;
  /** 옥타브 시프트 */
  octave: number;
}

export interface Layout {
  white: PianoKey[];
  black: PianoKey[];
  map: Map<string, PianoKey>;
  tonicMidi: number;
}

export function buildLayout({ anchorIndex, transpose, octave }: LayoutOptions): Layout {
  const base = TONIC_MIDI + transpose + 12 * octave;

  const white: PianoKey[] = WHITE_CODES.map((code, slot) => {
    const degree = slot - anchorIndex;
    return {
      code,
      slot,
      kind: 'white',
      exists: true,
      midi: base + degreeToSemitone(degree),
      cap: capOf(code),
      solfege: SOLFEGE[mod(degree, 7)],
      isTonic: mod(degree, 7) === 0,
    };
  });

  // 이웃한 흰건반이 온음 간격일 때만 그 사이에 검은건반이 있다.
  const black: PianoKey[] = BLACK_SLOT_CODES.map((code, slot) => ({
    code,
    slot,
    kind: 'black',
    exists: white[slot + 1].midi - white[slot].midi === 2,
    midi: white[slot].midi + 1,
    cap: capOf(code),
    solfege: white[slot].solfege + '♯',
    isTonic: false,
  }));

  const map = new Map<string, PianoKey>();
  for (const k of white) map.set(k.code, k);
  for (const k of black) if (k.exists) map.set(k.code, k);

  return { white, black, map, tonicMidi: base };
}
