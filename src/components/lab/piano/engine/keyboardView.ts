// 화면 건반. DOM 은 처음 한 번만 만들고, 조옮김·옥타브·도 위치가 바뀌면
// 만들어 둔 요소의 값만 갈아끼운다. 타건 경로에 DOM 생성이 끼지 않게 한다.

import { BLACK_SLOT_CODES, capOf, noteName, WHITE_CODES } from './keymap';
import type { Layout } from './keymap';

const WHITE_W = 100 / WHITE_CODES.length;
const BLACK_W = WHITE_W * 0.64;

interface KeyNodes {
  el: HTMLDivElement;
  sol: HTMLSpanElement;
  name: HTMLSpanElement;
}

export interface KeyboardHandlers {
  onNoteOn(id: string, midi: number): void;
  onNoteOff(id: string): void;
}

export class Keyboard {
  private el: HTMLElement;
  private onNoteOn: KeyboardHandlers['onNoteOn'];
  private onNoteOff: KeyboardHandlers['onNoteOff'];
  private nodes = new Map<string, KeyNodes>();
  private layout: Layout | null = null;
  private pending = new Map<string, boolean>();
  private flushing = false;
  private pointerCode: string | null = null;
  private cleanups: (() => void)[] = [];

  constructor(el: HTMLElement, { onNoteOn, onNoteOff }: KeyboardHandlers) {
    this.el = el;
    this.onNoteOn = onNoteOn;
    this.onNoteOff = onNoteOff;

    this.buildDom();
    this.bindPointer();
  }

  private buildDom() {
    const frag = document.createDocumentFragment();

    for (let i = 0; i < WHITE_CODES.length; i++) {
      frag.appendChild(this.makeKey(WHITE_CODES[i], 'white', {
        left: `${i * WHITE_W}%`,
        width: `${WHITE_W}%`,
      }));
    }
    for (let i = 0; i < BLACK_SLOT_CODES.length; i++) {
      frag.appendChild(this.makeKey(BLACK_SLOT_CODES[i], 'black', {
        left: `${(i + 1) * WHITE_W - BLACK_W / 2}%`,
        width: `${BLACK_W}%`,
      }));
    }
    this.el.appendChild(frag);
  }

  private makeKey(code: string, kind: 'white' | 'black', style: { left: string; width: string }): HTMLDivElement {
    const el = document.createElement('div');
    el.className = `key ${kind}`;
    el.dataset.code = code;
    el.style.left = style.left;
    el.style.width = style.width;

    const cap = document.createElement('span');
    cap.className = 'cap';
    cap.textContent = capOf(code);

    const sol = document.createElement('span');
    sol.className = 'sol';

    const name = document.createElement('span');
    name.className = 'name';

    el.append(cap, sol, name);
    this.nodes.set(code, { el, sol, name });
    return el;
  }

  applyLayout(layout: Layout): void {
    this.layout = layout;
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
    const start = (el: HTMLElement) => {
      const code = el.dataset.code as string;
      this.pointerCode = code;
      this.onNoteOn(`m:${code}`, Number(el.dataset.midi));
      this.press(code);
    };
    const stop = () => {
      if (this.pointerCode == null) return;
      this.onNoteOff(`m:${this.pointerCode}`);
      this.release(this.pointerCode);
      this.pointerCode = null;
    };

    const onDown = (e: PointerEvent) => {
      e.preventDefault();
      const el = this.keyAt(e.clientX, e.clientY);
      if (el) start(el);
    };

    // 누른 채로 끌면 글리산도가 된다.
    const onMove = (e: PointerEvent) => {
      if (this.pointerCode == null) return;
      const el = this.keyAt(e.clientX, e.clientY);
      if (!el || el.dataset.code === this.pointerCode) return;
      stop();
      start(el);
    };

    this.el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', stop);
    window.addEventListener('pointercancel', stop);

    this.cleanups.push(() => {
      this.el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', stop);
      window.removeEventListener('pointercancel', stop);
    });
  }

  // 페이지를 떠날 때 창에 걸어 둔 리스너와 만들어 둔 건반을 걷어낸다.
  destroy(): void {
    for (const off of this.cleanups) off();
    this.cleanups = [];
    this.nodes.clear();
    this.el.replaceChildren();
  }
}
