// 컨트롤 바에서 맞춰 놓은 것을 다음 방문까지 들고 간다.
//
// 저장은 값이 바뀔 때만 하고, 읽기는 마운트 때 한 번이다. 저장이 막혀 있어도
// (사생활 보호 모드, 용량 초과) 그냥 기본값으로 간다. 피아노가 안 열리는 것보다
// 설정이 안 남는 편이 낫다.

const KEY = 'kb-piano/settings';

export interface Settings {
  presetIndex: number;
  gmName: string;
  octave: number;
  transpose: number;
  anchorIndex: number;
  volume: number;
  space: number;
  pedalLatched: boolean;
}

export const DEFAULTS: Settings = {
  presetIndex: 0,
  gmName: '',
  octave: 0,
  transpose: 0,
  anchorIndex: 0,
  volume: 80,
  space: 30,
  pedalLatched: false,
};

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

const num = (v: unknown, fallback: number, lo: number, hi: number) =>
  typeof v === 'number' && Number.isFinite(v) ? clamp(Math.round(v), lo, hi) : fallback;

/**
 * 저장된 값은 남이 고칠 수 있고 앱이 바뀌면 범위도 달라진다. 읽을 때마다
 * 범위를 다시 확인해서, 이상한 값이 들어와도 기본값으로 떨어지게 한다.
 */
export function load(): Settings {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    const v = JSON.parse(raw) as Partial<Settings>;
    return {
      presetIndex: num(v.presetIndex, DEFAULTS.presetIndex, 0, 5),
      gmName: typeof v.gmName === 'string' ? v.gmName : DEFAULTS.gmName,
      octave: num(v.octave, DEFAULTS.octave, -3, 3),
      transpose: num(v.transpose, DEFAULTS.transpose, -12, 12),
      anchorIndex: num(v.anchorIndex, DEFAULTS.anchorIndex, 0, 22),
      volume: num(v.volume, DEFAULTS.volume, 0, 100),
      space: num(v.space, DEFAULTS.space, 0, 70),
      pedalLatched: v.pedalLatched === true,
    };
  } catch {
    return DEFAULTS;
  }
}

export function save(settings: Settings): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(settings));
  } catch {
    /* 저장이 막혀 있으면 이번 방문에만 적용된다 */
  }
}
