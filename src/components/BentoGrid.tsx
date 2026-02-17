'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export type BentoCardSize =
  | '1x1' // 1 col × 1 row
  | '2x1' // 2 col × 1 row
  | '1x2' // 1 col × 2 row
  | '2x2'; // 2 col × 2 row

export interface BentoCardProps {
  size?: BentoCardSize;
  children: ReactNode;
  className?: string;
  /** Accent glow on hover */
  accent?: boolean;
}

const sizeClasses: Record<BentoCardSize, string> = {
  '1x1': 'col-span-1 row-span-1',
  '2x1': 'col-span-2 row-span-1',
  '1x2': 'col-span-1 row-span-2',
  '2x2': 'col-span-2 row-span-2',
};

/**
 * BentoCard — individual card inside a BentoGrid.
 * Hover: slight scale-up + elevated shadow + optional accent glow.
 */
export function BentoCard({
  size = '1x1',
  children,
  className = '',
  accent = false,
}: BentoCardProps) {
  return (
    <motion.div
      className={[
        sizeClasses[size],
        'relative overflow-hidden rounded-2xl',
        'bg-card border border-border',
        'p-5',
        accent ? 'hover:border-accent/40' : 'hover:border-foreground/20',
        'transition-colors duration-300',
        className,
      ].join(' ')}
      whileHover={{
        scale: 1.025,
        boxShadow: accent
          ? '0 12px 40px -8px var(--accent, #16a34a)33'
          : '0 12px 40px -8px rgba(0,0,0,0.18)',
        transition: { duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] },
      }}
      initial={false}
    >
      {/* Subtle inner glow when accent */}
      {accent && (
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/5 to-transparent" />
      )}
      {children}
    </motion.div>
  );
}

export interface BentoGridProps {
  children: ReactNode;
  className?: string;
  /** Number of columns on desktop (default: 4) */
  cols?: number;
}

/**
 * BentoGrid — responsive grid container.
 * Mobile: 1 col | Tablet: 2 cols | Desktop: 4 cols (default)
 */
export function BentoGrid({ children, className = '', cols = 4 }: BentoGridProps) {
  // Tailwind requires full class strings to be present at build time,
  // so we use a fixed mapping instead of dynamic strings.
  const colClass =
    cols === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : cols === 3
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'; // default 4

  return (
    <div
      className={[
        'grid gap-4 auto-rows-[minmax(120px,auto)]',
        colClass,
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}
