'use client';

import { useCallback,useMemo, useRef, useState } from 'react';
import { AnimatePresence,motion, useInView } from 'framer-motion';

import { SkillT } from '@/api/notion/skills';

// ─────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────

const PROFICIENCY_SCORE: Record<string, number> = {
  '상': 90,
  '중상': 75,
  '중': 58,
  '중하': 38,
  '하': 20,
};

const PROFICIENCY_LABEL: Record<string, { text: string; color: string }> = {
  '상':   { text: 'Expert',        color: '#22c55e' },
  '중상':  { text: 'Advanced',      color: '#84cc16' },
  '중':   { text: 'Intermediate',  color: '#eab308' },
  '중하':  { text: 'Familiar',      color: '#f97316' },
  '하':   { text: 'Learning',      color: '#ef4444' },
};

interface RadarDimension {
  key: string;
  label: string;
  shortLabel: string;
  categories: string[];
  emoji: string;
}

const DIMENSIONS: RadarDimension[] = [
  { key: 'language',  label: 'Languages',      shortLabel: 'Lang',    categories: ['언어'],                        emoji: '💬' },
  { key: 'framework', label: 'Frameworks',     shortLabel: 'FW',      categories: ['기술'],                        emoji: '⚡' },
  { key: 'database',  label: 'Database',       shortLabel: 'DB',      categories: ['DB'],                          emoji: '🗄️' },
  { key: 'infra',     label: 'Infrastructure', shortLabel: 'Infra',   categories: ['Infra', 'CI/CD', 'OS'],        emoji: '☁️' },
  { key: 'tools',     label: 'Dev Tools',      shortLabel: 'Tools',   categories: ['IDE', '개발 도구'],             emoji: '🔧' },
  { key: 'collab',    label: 'Collaboration',  shortLabel: 'Collab',  categories: ['협업/문서', '디자인', '플랫폼'], emoji: '🤝' },
];

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────

function calcDimensionData(
  skills: SkillT[],
  categories: string[],
): { score: number; topSkills: SkillT[] } {
  const filtered = skills.filter(s =>
    s.분류.some(c => categories.includes(c)) && s.visible,
  );

  if (filtered.length === 0) return { score: 0, topSkills: [] };

  const scored = filtered
    .map(s => ({
      skill: s,
      pts:
        (PROFICIENCY_SCORE[s.숙련도] ?? 10) +
        Math.min((s.사용한_횟수 ?? 0) * 1.5, 15),
    }))
    .sort((a, b) => b.pts - a.pts);

  const topN = Math.min(scored.length, 6);
  const avgScore =
    scored.slice(0, topN).reduce((sum, s) => sum + s.pts, 0) / topN;
  const depthBonus = Math.min(filtered.length * 1.2, 12);

  return {
    score: Math.min(Math.round(avgScore + depthBonus), 100),
    topSkills: scored.slice(0, 5).map(s => s.skill),
  };
}

/** SVG polygon path string for radar */
function toPolygonPoints(
  scores: number[],
  cx: number,
  cy: number,
  maxR: number,
  max = 100,
): string {
  const n = scores.length;
  return scores
    .map((score, i) => {
      const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
      const r = (score / max) * maxR;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    })
    .join(' ');
}

/** A single axis endpoint */
function axisPoint(
  i: number,
  n: number,
  cx: number,
  cy: number,
  r: number,
): { x: number; y: number } {
  const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

/** Label anchor based on position */
function textAnchor(x: number, cx: number): 'start' | 'middle' | 'end' {
  if (x > cx + 10) return 'start';
  if (x < cx - 10) return 'end';
  return 'middle';
}

/** Label dy offset based on position */
function labelDy(y: number, cy: number): string {
  if (y < cy - 10) return '-0.5em';
  if (y > cy + 10) return '1.2em';
  return '0.35em';
}

// ─────────────────────────────────────────────────────────
// Tooltip panel
// ─────────────────────────────────────────────────────────

interface DimTooltipProps {
  dim: RadarDimension;
  score: number;
  topSkills: SkillT[];
  x: number;
  y: number;
  svgSize: number;
}

const DimTooltip = ({ dim, score, topSkills, x, y, svgSize }: DimTooltipProps) => {
  // Decide which side to show the tooltip based on position in SVG
  const onRight = x > svgSize / 2;
  const onBottom = y > svgSize / 2;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: onBottom ? -8 : 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.88, y: onBottom ? -8 : 8 }}
      transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`absolute z-50 w-52 pointer-events-none
        ${onBottom ? 'bottom-full mb-2' : 'top-full mt-2'}
        ${onRight ? 'right-0' : 'left-0'}
      `}
    >
      <div className="bg-card border border-border rounded-xl shadow-2xl p-3.5 space-y-2.5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">{dim.emoji}</span>
            <span className="text-sm font-semibold text-foreground">{dim.label}</span>
          </div>
          <span className="text-sm font-bold text-foreground tabular-nums">{score}</span>
        </div>

        {/* Score bar */}
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary"
          />
        </div>

        {/* Top skills */}
        {topSkills.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Top skills
            </p>
            {topSkills.map(skill => {
              const prof = PROFICIENCY_LABEL[skill.숙련도];
              return (
                <div key={skill.id} className="flex items-center justify-between gap-2">
                  <span className="text-xs text-foreground truncate">{skill.title}</span>
                  {prof && (
                    <span
                      className="text-xs font-medium flex-shrink-0"
                      style={{ color: prof.color }}
                    >
                      {prof.text}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────

export interface SkillsRadarChartProps {
  skills: SkillT[];
  /** Chart SVG size (px). Default 340. */
  size?: number;
}

export const SkillsRadarChart = ({ skills, size = 340 }: SkillsRadarChartProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [hoveredDim, setHoveredDim] = useState<string | null>(null);

  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.37;
  const RINGS = [0.25, 0.5, 0.75, 1];
  const RING_LABELS = ['25', '50', '75', '100'];
  const n = DIMENSIONS.length;

  // Calculate dimension data
  const dimData = useMemo(
    () =>
      DIMENSIONS.map(dim => ({
        ...dim,
        ...calcDimensionData(skills, dim.categories),
      })),
    [skills],
  );

  const scores = dimData.map(d => d.score);
  const dataPoints = toPolygonPoints(scores, cx, cy, maxR);

  // Build axis endpoints for labels and vertex dots
  const axes = DIMENSIONS.map((dim, i) => {
    const pt = axisPoint(i, n, cx, cy, maxR);
    const labelPt = axisPoint(i, n, cx, cy, maxR + 28);
    return { dim, pt, labelPt };
  });

  const handleMouseEnter = useCallback((key: string) => setHoveredDim(key), []);
  const handleMouseLeave = useCallback(() => setHoveredDim(null), []);

  return (
    <div ref={ref} className="flex flex-col items-center gap-6">
      {/* SVG chart */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-label="Skills radar chart"
          className="overflow-visible"
        >
          {/* Background rings */}
          {RINGS.map((ring, ri) => (
            <polygon
              key={ring}
              points={toPolygonPoints(
                DIMENSIONS.map(() => ring * 100),
                cx,
                cy,
                maxR,
              )}
              fill="none"
              stroke="currentColor"
              strokeWidth={ri === RINGS.length - 1 ? 1 : 0.6}
              className="text-border/50"
            />
          ))}

          {/* Ring labels (on rightmost axis) */}
          {RINGS.map((ring, ri) => {
            const { x, y } = axisPoint(0, n, cx, cy, ring * maxR);
            return (
              <text
                key={ring}
                x={x + 4}
                y={y}
                fontSize={8}
                fill="currentColor"
                className="text-muted-foreground/50"
                dominantBaseline="middle"
              >
                {RING_LABELS[ri]}
              </text>
            );
          })}

          {/* Axis lines */}
          {axes.map(({ pt }, i) => (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={pt.x}
              y2={pt.y}
              stroke="currentColor"
              strokeWidth={0.6}
              className="text-border/50"
            />
          ))}

          {/* Data polygon — animated fill */}
          <motion.polygon
            points={dataPoints}
            fill="currentColor"
            className="text-primary/15 dark:text-primary/20"
            stroke="none"
            initial={{ opacity: 0, scale: 0, originX: `${cx}px`, originY: `${cy}px` }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
            transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />

          {/* Data polygon stroke */}
          <motion.polygon
            points={dataPoints}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinejoin="round"
            className="text-primary"
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
            transition={{ duration: 0.8, delay: 0.05, ease: [0.34, 1.56, 0.64, 1] }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />

          {/* Axis vertex dots + hover hit area */}
          {axes.map(({ dim, pt }, i) => {
            const isHovered = hoveredDim === dim.key;
            return (
              <g key={dim.key}>
                {/* Invisible hit area */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={22}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => handleMouseEnter(dim.key)}
                  onMouseLeave={handleMouseLeave}
                />
                {/* Outer glow on hover */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.circle
                      cx={pt.x}
                      cy={pt.y}
                      r={10}
                      fill="currentColor"
                      className="text-primary/20"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatePresence>
                {/* Dot */}
                <motion.circle
                  cx={pt.x}
                  cy={pt.y}
                  r={4}
                  fill="currentColor"
                  className="text-primary"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={
                    isInView
                      ? { opacity: 1, scale: isHovered ? 1.5 : 1 }
                      : { opacity: 0, scale: 0 }
                  }
                  transition={{
                    opacity: { duration: 0.4, delay: 0.5 + i * 0.07 },
                    scale: { type: 'spring', stiffness: 400, damping: 20 },
                  }}
                />
              </g>
            );
          })}

          {/* Axis labels */}
          {axes.map(({ dim, labelPt }) => {
            const isHovered = hoveredDim === dim.key;
            const anchor = textAnchor(labelPt.x, cx);
            const dy = labelDy(labelPt.y, cy);

            return (
              <text
                key={dim.key}
                x={labelPt.x}
                y={labelPt.y}
                textAnchor={anchor}
                dy={dy}
                fontSize={11}
                fontWeight={isHovered ? 700 : 500}
                fill="currentColor"
                className={`transition-colors duration-150 cursor-pointer select-none ${
                  isHovered ? 'text-foreground' : 'text-muted-foreground'
                }`}
                onMouseEnter={() => handleMouseEnter(dim.key)}
                onMouseLeave={handleMouseLeave}
              >
                {dim.shortLabel}
              </text>
            );
          })}

          {/* Score dots on axes */}
          {dimData.map(({ key, score }, i) => {
            const { x, y } = axisPoint(i, n, cx, cy, (score / 100) * maxR);
            const isHovered = hoveredDim === key;
            return (
              <motion.circle
                key={key}
                cx={x}
                cy={y}
                r={isHovered ? 4.5 : 3}
                fill="currentColor"
                className="text-primary/80 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: isHovered ? 1 : 0.6, r: isHovered ? 4.5 : 3 } : { opacity: 0 }}
                transition={{ duration: 0.25, delay: 0.6 + i * 0.06 }}
              />
            );
          })}
        </svg>

        {/* Tooltip overlays — positioned relative to vertex dots */}
        {axes.map(({ dim, pt }, i) => {
          const data = dimData[i];
          if (!data || hoveredDim !== dim.key) return null;

          // Convert SVG coords to percentage for CSS positioning
          const leftPct = (pt.x / size) * 100;
          const topPct = (pt.y / size) * 100;

          return (
            <div
              key={dim.key}
              className="absolute pointer-events-none"
              style={{ left: `${leftPct}%`, top: `${topPct}%` }}
            >
              <AnimatePresence>
                <DimTooltip
                  key={dim.key}
                  dim={dim}
                  score={data.score}
                  topSkills={data.topSkills}
                  x={pt.x}
                  y={pt.y}
                  svgSize={size}
                />
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Legend — dimension scores as mini bars */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-2 w-full max-w-sm"
      >
        {dimData.map(dim => (
          <button
            key={dim.key}
            onMouseEnter={() => handleMouseEnter(dim.key)}
            onMouseLeave={handleMouseLeave}
            className="text-left group"
          >
            <div className="flex items-center justify-between mb-0.5">
              <span className={`text-xs font-medium transition-colors ${
                hoveredDim === dim.key ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {dim.label}
              </span>
              <span className="text-xs tabular-nums text-muted-foreground/60">
                {dim.score}
              </span>
            </div>
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={isInView ? { width: `${dim.score}%` } : { width: 0 }}
                transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
                className={`h-full rounded-full transition-colors duration-200 ${
                  hoveredDim === dim.key
                    ? 'bg-primary'
                    : 'bg-primary/50'
                }`}
              />
            </div>
          </button>
        ))}
      </motion.div>
    </div>
  );
};
