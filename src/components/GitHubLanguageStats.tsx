'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

import type { LanguageStat } from '@/api/github';

interface GitHubLanguageStatsProps {
  languages: LanguageStat[];
}

export default function GitHubLanguageStats({ languages }: GitHubLanguageStatsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  if (!languages.length) return null;

  return (
    <div ref={ref} className="w-full">
      {/* Stacked bar (colour swatch across full width) */}
      <div
        className="flex w-full h-2.5 rounded-full overflow-hidden mb-5"
        aria-label="Language distribution bar"
      >
        {languages.map((lang, i) => (
          <motion.div
            key={lang.name}
            title={`${lang.name} ${lang.percentage.toFixed(1)}%`}
            style={{ backgroundColor: lang.color, width: `${lang.percentage}%` }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{
              duration: 0.7,
              delay: i * 0.06,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          />
        ))}
      </div>

      {/* Legend grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-3">
        {languages.map((lang, i) => (
          <motion.div
            key={lang.name}
            className="flex items-center gap-2 min-w-0"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{
              duration: 0.4,
              delay: 0.3 + i * 0.05,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {/* Dot */}
            <span
              className="flex-shrink-0 w-3 h-3 rounded-full"
              style={{ backgroundColor: lang.color }}
            />
            {/* Name + percentage */}
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-foreground truncate leading-tight">
                {lang.name}
              </span>
              <span className="text-[10px] text-muted-foreground tabular-nums leading-tight">
                {lang.percentage.toFixed(1)}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
