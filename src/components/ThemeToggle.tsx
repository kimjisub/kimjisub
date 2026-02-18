'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from 'next-themes';

import { ACCENT_COLORS, AccentColorKey, useAccentColor } from '@/hooks/useAccentColor';

/* ── Icons ────────────────────────────────────────────────────────────── */

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="w-4 h-4">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2m-7.07-14.07 1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2m-15.07 5.66-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="w-4 h-4">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function PaletteIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="w-3.5 h-3.5">
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  );
}

/* ── View Transition helper type ──────────────────────────────────────── */

type DocumentWithViewTransition = Document & {
  startViewTransition?: (callback: () => void | Promise<void>) => {
    ready: Promise<void>;
    finished: Promise<void>;
    updateCallbackDone: Promise<void>;
  };
};

/* ── Component ────────────────────────────────────────────────────────── */

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const { accentColor, setAccentColor } = useAccentColor();
  const [mounted, setMounted] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // Close palette on outside click / Escape
  useEffect(() => {
    if (!paletteOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setPaletteOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPaletteOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [paletteOpen]);

  /* Placeholder before hydration – prevents layout shift */
  if (!mounted) {
    return (
      <div className="flex items-center gap-1">
        <button className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground" aria-label="Toggle theme">
          <span className="w-4 h-4" />
        </button>
        <button className="w-6 h-6 flex items-center justify-center rounded-md text-muted-foreground" aria-label="Choose accent color">
          <span className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  const isDark = resolvedTheme === 'dark';
  const currentColor = ACCENT_COLORS[accentColor];

  /* ── Circular reveal on theme toggle ─────────────────────────────── */
  const handleThemeToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const nextTheme = isDark ? 'light' : 'dark';

    const doc = document as DocumentWithViewTransition;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Use View Transitions API if available and user hasn't requested reduced motion
    if (!prefersReduced && typeof doc.startViewTransition === 'function') {
      const { clientX: x, clientY: y } = e;
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );
      const clipFrom = `circle(0px at ${x}px ${y}px)`;
      const clipTo   = `circle(${radius}px at ${x}px ${y}px)`;

      const vt = doc.startViewTransition(() => {
        setTheme(nextTheme);
      });

      void vt.ready.then(() => {
        document.documentElement.animate(
          { clipPath: [clipFrom, clipTo] },
          {
            duration: 500,
            easing: 'ease-in-out',
            pseudoElement: '::view-transition-new(root)',
          },
        );
      });
    } else {
      setTheme(nextTheme);
    }
  };

  return (
    <div ref={containerRef} className="relative flex items-center gap-1">
      {/* Dark / Light toggle – animated icon */}
      <button
        onClick={handleThemeToggle}
        className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background focus-visible:outline-none transition-colors overflow-hidden"
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={isDark ? 'sun' : 'moon'}
            initial={{ rotate: isDark ? -90 : 90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: isDark ? 90 : -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="flex items-center justify-center"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </motion.div>
        </AnimatePresence>
      </button>

      {/* Palette trigger – shows current accent color dot */}
      <button
        onClick={() => setPaletteOpen(prev => !prev)}
        className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background focus-visible:outline-none transition-colors relative"
        aria-label="Choose accent color"
        aria-expanded={paletteOpen}
        aria-haspopup="listbox"
        title="Choose accent color"
      >
        <PaletteIcon />
        {/* tiny color indicator */}
        <span
          className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full ring-1 ring-background"
          style={{ background: currentColor.preview }}
        />
      </button>

      {/* Color palette panel */}
      <div
        className={`
          absolute right-0 top-full mt-2 z-50
          flex flex-col gap-1 items-end
          transition-all duration-200 ease-out origin-top-right
          ${paletteOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'}
        `}
        role="listbox"
        aria-label="Accent color options"
      >
        {/* Floating card */}
        <div className="bg-card border border-border rounded-xl shadow-lg p-2.5 flex flex-col gap-1.5 min-w-[9rem]">
          <p className="text-[10px] font-medium text-muted-foreground tracking-wider uppercase px-0.5 mb-0.5">
            Accent color
          </p>
          <div className="flex gap-2">
            {(Object.entries(ACCENT_COLORS) as [AccentColorKey, typeof ACCENT_COLORS[AccentColorKey]][]).map(
              ([key, cfg], i) => {
                const isActive = key === accentColor;
                return (
                  <button
                    key={key}
                    role="option"
                    aria-selected={isActive}
                    onClick={() => {
                      setAccentColor(key);
                      setPaletteOpen(false);
                    }}
                    title={cfg.label}
                    aria-label={`${cfg.label} accent`}
                    className={`
                      w-6 h-6 rounded-full flex-shrink-0
                      transition-all duration-200
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card
                      ${paletteOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}
                      ${isActive ? 'scale-110' : 'hover:scale-110 active:scale-95'}
                    `}
                    style={{
                      background: cfg.preview,
                      transitionDelay: paletteOpen ? `${i * 30}ms` : '0ms',
                      ...(isActive
                        ? { boxShadow: `0 0 0 2px var(--card), 0 0 0 3.5px ${cfg.preview}` }
                        : {}),
                    } as React.CSSProperties}
                  />
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
