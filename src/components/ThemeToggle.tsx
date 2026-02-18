'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Palette, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { ACCENT_COLORS, AccentColorKey, useAccentColor } from '@/hooks/useAccentColor';

/* ── View Transition helper type ──────────────────────────────────────── */

type DocumentWithViewTransition = Document & {
  startViewTransition?: (_callback: () => void | Promise<void>) => {
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
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
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
        <Palette className="w-3.5 h-3.5" />
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
