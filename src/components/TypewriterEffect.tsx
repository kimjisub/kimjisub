'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

interface TypewriterEffectProps {
  texts: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
}

type Phase = 'typing' | 'pausing' | 'deleting' | 'switching';

export const TypewriterEffect = ({
  texts,
  className = '',
  typingSpeed = 80,
  deletingSpeed = 45,
  pauseTime = 1800,
}: TypewriterEffectProps) => {
  const prefersReduced = useReducedMotion();
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase] = useState<Phase>('typing');
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Show static first text if reduced motion is preferred
  if (prefersReduced) {
    return (
      <span className={`inline-flex items-baseline ${className}`} aria-label={texts[0]}>
        <span>{texts[0]}</span>
      </span>
    );
  }

  useEffect(() => {
    if (texts.length === 0) return;

    const currentText = texts[currentIndex];

    const schedule = (fn: () => void, delay: number) => {
      timeoutRef.current = setTimeout(fn, delay);
    };

    if (phase === 'typing') {
      if (displayed.length < currentText.length) {
        schedule(() => {
          setDisplayed(currentText.slice(0, displayed.length + 1));
        }, typingSpeed);
      } else {
        setPhase('pausing');
      }
    } else if (phase === 'pausing') {
      schedule(() => setPhase('deleting'), pauseTime);
    } else if (phase === 'deleting') {
      if (displayed.length > 0) {
        schedule(() => {
          setDisplayed(prev => prev.slice(0, -1));
        }, deletingSpeed);
      } else {
        setPhase('switching');
      }
    } else if (phase === 'switching') {
      setCurrentIndex(prev => (prev + 1) % texts.length);
      setPhase('typing');
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [displayed, phase, currentIndex, texts, typingSpeed, deletingSpeed, pauseTime]);

  // Cursor blinks faster while typing/deleting, slower while pausing
  const cursorBlinkDuration = phase === 'pausing' ? 0.6 : 0.4;

  return (
    <span
      className={`inline-flex items-baseline ${className}`}
      aria-label={texts[currentIndex]}
    >
      <span>{displayed}</span>

      {/* framer-motion cursor blink */}
      <motion.span
        className="ml-[2px] inline-block w-[2px] rounded-sm bg-current align-middle self-center"
        style={{ height: '1.1em' }}
        animate={{ opacity: [1, 1, 0, 0] }}
        transition={{
          duration: cursorBlinkDuration,
          repeat: Infinity,
          ease: 'linear',
          times: [0, 0.45, 0.5, 0.95],
        }}
        aria-hidden
      />
    </span>
  );
};
