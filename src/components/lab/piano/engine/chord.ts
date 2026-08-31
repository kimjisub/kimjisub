// 지금 눌린 음들로 코드 이름을 만든다. Logic Pro 의 코드 표시와 같은 자리다.
//
// 인식은 @tonaljs/chord-detect 가 한다. 음이 둘 이하면 코드로 보지 않고
// 음이름만 늘어놓는다. 셋부터가 코드다.

import { detect } from '@tonaljs/chord-detect';

import { noteName, pitchClassOf } from './keymap';

/** 화면에 그대로 쓰는 문자열. 없으면 빈 문자열. */
export function describe(midis: number[]): string {
  if (midis.length === 0) return '';

  const sorted = [...midis].sort((a, b) => a - b);
  if (sorted.length === 1) return noteName(sorted[0]);
  if (sorted.length === 2) return sorted.map(noteName).join(' · ');

  // 낮은 음을 베이스로 알려주면 전위(inversion)까지 구분해 준다.
  const names = sorted.map(pitchClassOf);
  const found = detect(names, { assumePerfectFifth: true });
  // tonal 은 장3화음을 CM 으로 쓴다. Logic Pro 처럼 C 로 보여준다.
  if (found.length > 0) return found[0].replace(/M(?=$|\/)/, '');

  // 코드로 안 잡히면 음이름만 보여준다. 억지로 이름을 붙이지 않는다.
  const unique: string[] = [];
  for (const n of names) if (unique.indexOf(n) < 0) unique.push(n);
  return unique.join(' · ');
}
