// 지금 눌린 음들로 코드 이름을 만든다. Logic Pro 의 코드 표시와 같은 자리다.
//
// 인식은 @tonaljs/chord-detect 가 한다. 음이 둘 이하면 코드로 보지 않고
// 음이름만 늘어놓는다. 셋부터가 코드다.

import { detect } from '@tonaljs/chord-detect';

import { noteName, pitchClassOf } from './keymap';

// tonal 은 후보를 여러 개 돌려주는데 순서를 그대로 믿으면 안 된다. 베이스가
// 근음이 아닌 전위에서 흔한 화음의 전위보다 드문 해석을 앞에 둔다.
//   A C F -> ["Am#5", "FM/A"]   라도파는 F/A 지 Am#5 가 아니다
//   E G C -> ["Em#5", "CM/E"]
// 그래서 화음의 성질을 보고 흔한 것을 먼저 고른다.
const COMMON = [
  'M', 'm', '7', 'maj7', 'm7', 'm7b5', 'dim', 'dim7', 'aug',
  'sus2', 'sus4', '7sus4', '6', 'm6', '69',
  '9', 'm9', 'maj9', 'add9', 'M9', '11', 'm11', '13', 'm13', 'mMaj7',
];

/** `FM/A` 를 성질 `M` 과 베이스 있음으로 가른다. */
function parse(symbol: string): { quality: string; slash: boolean } {
  const slash = symbol.indexOf('/') >= 0;
  const chord = slash ? symbol.slice(0, symbol.indexOf('/')) : symbol;
  // 근음은 알파벳 하나에 올림표·내림표가 붙는다.
  const quality = chord.replace(/^[A-G][#b]*/, '');
  return { quality, slash };
}

// 세 가지를 이 순서로 본다. 자릿수를 갈라 앞의 기준이 뒤를 항상 이기게 한다.
//   흔한 성질인가   Am#5 보다 F/A 가 낫다
//   근음 위치인가   Fsus2/C 보다 Csus4 가 낫다
//   더 흔한 성질인가 같은 조건이면 목록 앞쪽을 고른다
function rank(symbol: string): number {
  const { quality, slash } = parse(symbol);
  const known = COMMON.indexOf(quality);
  if (known < 0) return 10000;
  return (slash ? 100 : 0) + known;
}

/** 화면에 그대로 쓰는 문자열. 없으면 빈 문자열. */
export function describe(midis: number[]): string {
  if (midis.length === 0) return '';

  const sorted = [...midis].sort((a, b) => a - b);
  if (sorted.length === 1) return noteName(sorted[0]);
  if (sorted.length === 2) return sorted.map(noteName).join(' · ');

  // 낮은 음부터 넣으면 tonal 이 전위까지 구분해 준다.
  const names = sorted.map(pitchClassOf);
  const found = detect(names, { assumePerfectFifth: true });
  if (found.length > 0) {
    const best = found.slice().sort((a, b) => rank(a) - rank(b))[0];
    // tonal 은 장3화음을 CM 으로 쓴다. Logic Pro 처럼 C 로 보여준다.
    return best.replace(/M(?=$|\/)/, '');
  }

  // 코드로 안 잡히면 음이름만 보여준다. 억지로 이름을 붙이지 않는다.
  const unique: string[] = [];
  for (const n of names) if (unique.indexOf(n) < 0) unique.push(n);
  return unique.join(' · ');
}
