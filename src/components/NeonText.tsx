'use client';

import { motion, useAnimationControls } from 'framer-motion';
import { useEffect, useRef, type ReactNode } from 'react';
import { useTheme } from 'next-themes';

interface NeonTextProps {
  children: ReactNode;
  className?: string;
  /** Override glow color. Defaults to CSS accent green. */
  lightColor?: string;
  darkColor?: string;
}

function buildGlow(hex: string, intensity: number): string {
  const r1 = Math.round(4 * intensity);
  const r2 = Math.round(12 * intensity);
  const r3 = Math.round(24 * intensity);
  const r4 = Math.round(48 * intensity);
  return [
    `0 0 ${r1}px ${hex}`,
    `0 0 ${r2}px ${hex}`,
    `0 0 ${r3}px ${hex}60`,
    `0 0 ${r4}px ${hex}30`,
  ].join(', ');
}

/**
 * Wraps children in a <span> with an animated neon glow effect.
 * Uses accent green by default. Subtle in light mode, vivid in dark.
 *
 * @example
 *   <h1><NeonText>김지섭</NeonText></h1>
 */
export function NeonText({
  children,
  className = '',
  lightColor = '#16a34a',
  darkColor = '#22c55e',
}: NeonTextProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const glowColor = isDark ? darkColor : lightColor;
  const baseIntensity = isDark ? 1.0 : 0.3;
  const peakIntensity = isDark ? 1.35 : 0.5;

  const controls = useAnimationControls();
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    controls.set({ textShadow: buildGlow(glowColor, baseIntensity) });

    const breathe = async () => {
      while (alive.current) {
        await controls.start({
          textShadow: buildGlow(glowColor, peakIntensity),
          transition: { duration: 1.1, ease: 'easeInOut' },
        });
        if (!alive.current) break;
        await controls.start({
          textShadow: buildGlow(glowColor, baseIntensity),
          transition: { duration: 1.6, ease: 'easeInOut' },
        });
      }
    };

    void breathe();

    return () => {
      alive.current = false;
    };
  // Re-run when theme or colors change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [glowColor, baseIntensity, peakIntensity]);

  return (
    <motion.span
      animate={controls}
      className={className}
      style={{ color: glowColor }}
    >
      {children}
    </motion.span>
  );
}
