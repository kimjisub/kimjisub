'use client';

import confetti from 'canvas-confetti';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

// Konami Code sequence
const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

const ASCII_ART = `
%c
 ██╗██╗███████╗██╗   ██╗██████╗     ██╗  ██╗██╗███╗   ███╗
 ██║██║██╔════╝██║   ██║██╔══██╗    ██║ ██╔╝██║████╗ ████║
 ██║██║███████╗██║   ██║██████╔╝    █████╔╝ ██║██╔████╔██║
██ ██║██║╚════██║██║   ██║██╔══██╗    ██╔═██╗ ██║██║╚██╔╝██║
╚█████╔╝██║███████║╚██████╔╝██████╔╝    ██║  ██╗██║██║ ╚═╝ ██║
 ╚════╝ ╚═╝╚══════╝ ╚═════╝ ╚═════╝     ╚═╝  ╚═╝╚═╝╚═╝     ╚═╝

  👀 코드도 구경하러 왔나요? 반가워요!
  🔥 GitHub: https://github.com/kimjisub
  🎮 힌트: 코나미 코드를 입력해보세요...
     ↑ ↑ ↓ ↓ ← → ← → B A

%c  Made with ❤️  by Jisub Kim
`;

function fireConfetti() {
  const duration = 3000;
  const end = Date.now() + duration;

  // Initial burst
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.5 },
    colors: ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff'],
  });

  // Side streams
  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff'],
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff'],
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

interface EasterEggsProps {
  clickCount?: number;
}

export default function EasterEggs({ clickCount = 0 }: EasterEggsProps) {
  const [discoMode, setDiscoMode] = useState(false);
  const [showKonamiMsg, setShowKonamiMsg] = useState(false);
  const [showClickMsg, setShowClickMsg] = useState(false);
  const konamiRef = useRef<string[]>([]);
  const discoRafRef = useRef<number | null>(null);
  const discoHueRef = useRef(0);

  // 1. Console ASCII art on mount
  useEffect(() => {
    console.log(
      ASCII_ART,
      'color: #54a0ff; font-family: monospace; font-size: 11px; font-weight: bold;',
      'color: #ff9ff3; font-family: monospace; font-size: 12px;',
    );
  }, []);

  // 2. Konami Code + 4. Disco Mode keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const isEditable =
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        (e.target as HTMLElement)?.isContentEditable;

      // Konami Code tracking
      konamiRef.current = [...konamiRef.current, e.key].slice(-KONAMI_CODE.length);
      if (JSON.stringify(konamiRef.current) === JSON.stringify(KONAMI_CODE)) {
        fireConfetti();
        setShowKonamiMsg(true);
        setTimeout(() => setShowKonamiMsg(false), 4000);
        konamiRef.current = [];
      }

      // Disco Mode toggle ('d' key, not in input)
      if (e.key === 'd' && !isEditable) {
        setDiscoMode((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Disco mode animation loop
  useEffect(() => {
    if (discoMode) {
      const animate = () => {
        discoHueRef.current = (discoHueRef.current + 2) % 360;
        document.documentElement.style.filter = `hue-rotate(${discoHueRef.current}deg) saturate(1.4)`;
        discoRafRef.current = requestAnimationFrame(animate);
      };
      discoRafRef.current = requestAnimationFrame(animate);
    } else {
      if (discoRafRef.current !== null) {
        cancelAnimationFrame(discoRafRef.current);
        discoRafRef.current = null;
      }
      document.documentElement.style.filter = '';
    }

    return () => {
      if (discoRafRef.current !== null) {
        cancelAnimationFrame(discoRafRef.current);
        document.documentElement.style.filter = '';
      }
    };
  }, [discoMode]);

  // 3. Profile click counter — trigger on 10th click
  useEffect(() => {
    if (clickCount === 10) {
      setShowClickMsg(true);
      setTimeout(() => setShowClickMsg(false), 5000);
    }
  }, [clickCount]);

  return (
    <>
      {/* Disco Mode indicator */}
      <AnimatePresence>
        {discoMode && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] px-5 py-2 rounded-full text-sm font-medium bg-black/80 text-white backdrop-blur-sm border border-white/20 shadow-lg select-none pointer-events-none"
          >
            🕺 DISCO MODE — &apos;d&apos; 키로 끄기
          </motion.div>
        )}
      </AnimatePresence>

      {/* Konami Code message */}
      <AnimatePresence>
        {showKonamiMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 40 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-2xl text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-2xl select-none pointer-events-none"
          >
            🎉 코나미 코드 해제! 이스터에그를 발견하셨군요!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile click counter message */}
      <AnimatePresence>
        {showClickMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 40 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[9999] px-6 py-4 rounded-2xl text-sm bg-card border border-border shadow-2xl max-w-xs text-center select-none pointer-events-none"
          >
            <div className="text-2xl mb-1">🫡</div>
            <div className="font-semibold mb-0.5">10번이나 눌렀군요!</div>
            <div className="text-muted-foreground text-xs">
              끈기 있는 분이시네요. 저도 그런 사람입니다 :)
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
