'use client';

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
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase] = useState<Phase>('typing');
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  return (
    <span className={`inline-flex items-baseline ${className}`} aria-label={texts[currentIndex]}>
      <span>{displayed}</span>
      <span
        className="ml-[2px] inline-block w-[2px] h-[1.1em] bg-current align-middle"
        style={{
          animation: 'typewriter-cursor-blink 1s step-end infinite',
        }}
      />
      <style>{`
        @keyframes typewriter-cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </span>
  );
};
