// 화면 건반. DOM 은 처음 한 번만 만들고, 조옮김·옥타브·도 위치가 바뀌면
// 만들어 둔 요소의 값만 갈아끼운다. 타건 경로에 DOM 생성이 끼지 않게 한다.

import { BLACK_SLOT_CODES, capOf, noteName, ROW_SPLIT, WHITE_CODES } from './keymap';
import type { Layout } from './keymap';

const SPLIT = ROW_SPLIT;

// 한 줄로 펼칠 때도 두 줄 사이를 조금 벌린다. 줄마다 옥타브가 따로라 음이
// 이어지지 않는데, 붙여 놓으면 건반 하나가 깨진 것처럼 보인다.
const GAP_KEYS = 0.5;

// 좁은 화면에서 두 줄로 접을 때도 건반 폭은 그대로 둔다. 두 줄 모두 13분할
// 폭을 쓰고 아랫줄이 10개에서 끝나 오른쪽이 남는다.
const WHITE_W_WIDE = 100 / (WHITE_CODES.length + GAP_KEYS);
const WHITE_W_SPLIT = 100 / SPLIT;
const BLACK_RATIO = 0.64;

interface KeyNodes {
  el: HTMLDivElement;
  sol: HTMLSpanElement;
  name: HTMLSpanElement;
  kind: 'white' | 'black';
  /** 흰건반은 자기 자리, 검은건반은 왼쪽 흰건반의 자리 */
  slot: number;
}

export interface KeyboardHandlers {
  onNoteOn(id: string, midi: number): void;
  onNoteOff(id: string): void;
}

export class Keyboard {
  private el: HTMLElement;
  private onNoteOn: KeyboardHandlers['onNoteOn'];
  private onNoteOff: KeyboardHandlers['onNoteOff'];
  private rows: HTMLDivElement[] = [];
  private nodes = new Map<string, KeyNodes>();
  private pending = new Map<string, boolean>();
  private flushing = false;
  /** 손가락 하나마다 지금 누르고 있는 건반. 여러 개가 동시에 눌린다. */
  private pointers = new Map<number, string>();
  private cleanups: (() => void)[] = [];
  private split = false;

  constructor(el: HTMLElement, { onNoteOn, onNoteOff }: KeyboardHandlers) {
    this.el = el;
    this.onNoteOn = onNoteOn;
    this.onNoteOff = onNoteOff;

    this.buildDom();
    this.setSplit(false);
    this.bindPointer();
  }

  private buildDom() {
    for (let r = 0; r < 2; r++) {
      const row = document.createElement('div');
      row.className = 'row';
      this.rows.push(row);
      this.el.appendChild(row);
    }
    for (let i = 0; i < WHITE_CODES.length; i++) {
      this.makeKey(WHITE_CODES[i], 'white', i);
    }
    for (let i = 0; i < BLACK_SLOT_CODES.length; i++) {
      this.makeKey(BLACK_SLOT_CODES[i], 'black', i);
    }
  }

  private makeKey(code: string, kind: 'white' | 'black', slot: number): void {
    const el = document.createElement('div');
    el.className = `key ${kind}`;
    el.dataset.code = code;

    const cap = document.createElement('span');
    cap.className = 'cap';
    cap.textContent = capOf(code);

    const sol = document.createElement('span');
    sol.className = 'sol';

    const name = document.createElement('span');
    name.className = 'name';

    el.append(cap, sol, name);
    this.nodes.set(code, { el, sol, name, kind, slot });
  }

  /**
   * 한 줄로 펼칠지 두 줄로 접을지 정한다. 접으면 자판의 두 줄과 같은 자리로
   * 나뉜다. 줄이 갈리는 자리의 검은건반(`a`)은 아랫줄 맨 왼쪽에 붙인다.
   */
  setSplit(split: boolean): void {
    this.split = split;
    const whiteW = split ? WHITE_W_SPLIT : WHITE_W_WIDE;
    const blackW = whiteW * BLACK_RATIO;

    this.rows[1].classList.toggle('hidden', !split);
    this.el.classList.toggle('split', split);

    this.nodes.forEach(node => {
      // 검은건반은 왼쪽 흰건반 다음 자리에 걸친다.
      const whiteIndex = node.kind === 'white' ? node.slot : node.slot + 1;
      const rowIndex = split && whiteIndex >= SPLIT ? 1 : 0;
      const local = whiteIndex - (rowIndex === 1 ? SPLIT : 0);
      // 한 줄로 펼쳤을 때만 아랫줄 자리를 오른쪽으로 밀어 사이를 벌린다.
      const gap = !split && whiteIndex >= SPLIT ? GAP_KEYS * whiteW : 0;

      const left = node.kind === 'white'
        ? local * whiteW + gap
        : Math.max(0, local * whiteW - blackW / 2 + gap);

      node.el.style.left = `${left}%`;
      node.el.style.width = `${node.kind === 'white' ? whiteW : blackW}%`;

      const row = this.rows[rowIndex];
      if (node.el.parentElement !== row) row.appendChild(node.el);
    });
  }

  applyLayout(layout: Layout): void {
    for (const key of [...layout.white, ...layout.black]) {
      const node = this.nodes.get(key.code);
      if (!node) continue;
      const exists = key.kind === 'white' || key.exists;
      node.el.classList.toggle('mute', !exists);
      node.el.classList.toggle('tonic', !!key.isTonic);
      node.el.dataset.midi = exists ? String(key.midi) : '';
      node.sol.textContent = exists ? key.solfege : '';
      node.name.textContent = exists ? noteName(key.midi) : '';
    }
  }

  press(code: string): void { this.queue(code, true); }
  release(code: string): void { this.queue(code, false); }

  private queue(code: string, on: boolean): void {
    if (!this.nodes.has(code)) return;
    this.pending.set(code, on);
    if (this.flushing) return;
    this.flushing = true;
    requestAnimationFrame(() => {
      this.pending.forEach((state, c) => {
        this.nodes.get(c)?.el.classList.toggle('down', state);
      });
      this.pending.clear();
      this.flushing = false;
    });
  }

  private keyAt(x: number, y: number): HTMLElement | null {
    const found = document.elementFromPoint(x, y);
    const key = found instanceof Element ? found.closest<HTMLElement>('.key') : null;
    if (!key || key.classList.contains('mute') || !key.dataset.midi) return null;
    return key;
  }

  private bindPointer(): void {
    const start = (pointerId: number, el: HTMLElement) => {
      const code = el.dataset.code as string;
      this.pointers.set(pointerId, code);
      this.onNoteOn(`m:${code}`, Number(el.dataset.midi));
      this.press(code);
    };
    const stop = (pointerId: number) => {
      const code = this.pointers.get(pointerId);
      if (code == null) return;
      this.pointers.delete(pointerId);
      this.onNoteOff(`m:${code}`);
      this.release(code);
    };

    const onDown = (e: PointerEvent) => {
      e.preventDefault();
      const el = this.keyAt(e.clientX, e.clientY);
      if (el) start(e.pointerId, el);
    };

    // 누른 채로 끌면 글리산도가 된다. 손가락마다 따로 따라간다.
    const onMove = (e: PointerEvent) => {
      const code = this.pointers.get(e.pointerId);
      if (code == null) return;
      const el = this.keyAt(e.clientX, e.clientY);
      if (!el || el.dataset.code === code) return;
      stop(e.pointerId);
      start(e.pointerId, el);
    };

    const onUp = (e: PointerEvent) => stop(e.pointerId);

    this.el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);

    this.cleanups.push(() => {
      this.el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    });
  }

  /** 손가락이 다 떨어진 것으로 치고 울리던 음을 놓는다. */
  releasePointers(): void {
    this.pointers.forEach(code => {
      this.onNoteOff(`m:${code}`);
      this.release(code);
    });
    this.pointers.clear();
  }

  // 페이지를 떠날 때 창에 걸어 둔 리스너와 만들어 둔 건반을 걷어낸다.
  destroy(): void {
    for (const off of this.cleanups) off();
    this.cleanups = [];
    this.nodes.clear();
    this.rows = [];
    this.el.replaceChildren();
  }
}
