'use client';

import { ElementType, useCallback, useEffect, useRef, useState } from 'react';

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*<>[]{}';

function randomChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

interface TextScrambleProps {
  text: string;
  className?: string;
  /** characters resolved per rAF tick. Higher = faster. Default: 1 */
  speed?: number;
  /** frames each char stays scrambled before resolving. Default: 3 */
  frameDelay?: number;
  as?: ElementType;
}

/**
 * Renders text that scrambles into random characters on hover,
 * then resolves back to the original text left-to-right.
 * Uses requestAnimationFrame only — no extra deps, no layout thrash.
 */
export function TextScramble({
  text,
  className,
  speed = 1,
  frameDelay = 3,
  as: Tag = 'span',
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text);
  const rafRef = useRef<number | null>(null);
  const stateRef = useRef({ frame: 0, resolved: 0 });

  /** Single animation tick — resolves one more char every `frameDelay` frames */
  const tick = useCallback(() => {
    const s = stateRef.current;
    s.frame++;

    if (s.frame % frameDelay === 0) {
      s.resolved = Math.min(s.resolved + speed, text.length);
    }

    const next = text
      .split('')
      .map((char, i) => {
        if (char === ' ') return ' ';       // preserve spaces
        if (i < s.resolved) return char;    // already resolved
        return randomChar();                // still scrambled
      })
      .join('');

    setDisplayText(next);

    if (s.resolved < text.length) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      // Ensure we always end on the exact original text
      setDisplayText(text);
    }
  }, [text, speed, frameDelay]);

  const startScramble = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }
    stateRef.current = { frame: 0, resolved: 0 };
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Sync display text if `text` prop changes externally
  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  return (
    <Tag
      className={className}
      onMouseEnter={startScramble}
      aria-label={text}
      style={{ cursor: 'default', display: 'inline' }}
    >
      {displayText}
    </Tag>
  );
}
