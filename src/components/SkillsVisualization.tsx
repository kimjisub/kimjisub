'use client';

import { useRef,useState } from 'react';
import { AnimatePresence,motion, useInView } from 'framer-motion';

import { SkillT } from '@/api/notion/skills';
import { IconSlugSvg, slugToData } from '@/components/IconSlugView';
import { SkillItem } from '@/components/SkillItem';
import { proficiencyConfig,SkillTooltip } from '@/components/SkillTooltip';

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

type ViewMode = 'grid' | 'list';

interface Category {
  key: string;
  title: string;
}

interface SkillsVisualizationProps {
  skills: SkillT[];
  categories: Category[];
}

// ─────────────────────────────────────────────────────────
// Proficiency bar (list view row)
// ─────────────────────────────────────────────────────────

const SkillListRow = ({
  skill,
  index,
}: {
  skill: SkillT;
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });
  const slugData = slugToData(skill.slug);
  const proficiency = skill.숙련도 ? proficiencyConfig[skill.숙련도] : null;
  const projectCount =
    (skill.projectUsedBySkill?.length ?? 0) +
    (skill.projectUsedByLanguage?.length ?? 0);

  return (
    <motion.a
      href={`/skills/${skill.id}`}
      ref={ref}
      initial={{ opacity: 0, x: -16 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
      whileHover={{ x: 4 }}
      transition={{
        default: {
          duration: 0.35,
          delay: Math.min(index * 0.04, 0.3),
          ease: [0.25, 0.46, 0.45, 0.94],
        },
        x: { type: 'spring', stiffness: 400, damping: 30 },
      }}
      className="group flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-muted/50 transition-colors duration-200"
    >
      {/* Icon */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
        style={{ background: `#${slugData.hex}` }}
      >
        <IconSlugSvg slugData={slugData} />
      </div>

      {/* Name */}
      <span className="text-sm font-medium text-foreground w-28 flex-shrink-0 truncate">
        {skill.title}
      </span>

      {/* Bar + label */}
      <div className="flex-1 flex items-center gap-3 min-w-0">
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          {proficiency ? (
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: `${proficiency.percent}%` } : { width: 0 }}
              transition={{
                duration: 0.8,
                delay: Math.min(index * 0.04, 0.3) + 0.2,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="h-full rounded-full"
              style={{ background: proficiency.color }}
            />
          ) : (
            <div className="h-full bg-muted-foreground/20 rounded-full" style={{ width: '5%' }} />
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {proficiency ? (
            <span
              className="text-xs font-medium w-24 hidden sm:block"
              style={{ color: proficiency.color }}
            >
              {proficiency.label}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground w-24 hidden sm:block">—</span>
          )}
          {projectCount > 0 && (
            <span className="text-xs text-muted-foreground/50 tabular-nums">
              {projectCount}p
            </span>
          )}
        </div>
      </div>
    </motion.a>
  );
};

// ─────────────────────────────────────────────────────────
// Grid skill badge (wraps existing SkillItem + tooltip)
// ─────────────────────────────────────────────────────────

const SkillGridBadge = ({
  skill,
  index,
  isVisible,
}: {
  skill: SkillT;
  index: number;
  isVisible: boolean;
}) => {
  return (
    <SkillTooltip skill={skill}>
      <motion.div
        initial={{ opacity: 0, scale: 0.75 }}
        animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.75 }}
        whileHover={{ scale: 1.08, y: -2 }}
        transition={{
          default: {
            duration: 0.3,
            delay: Math.min(index * 0.025, 0.25),
            ease: [0.25, 0.46, 0.45, 0.94],
          },
          scale: { type: 'spring', stiffness: 400, damping: 20 },
          y: { type: 'spring', stiffness: 400, damping: 20 },
        }}
      >
        <SkillItem skill={skill} variant="inline" />
      </motion.div>
    </SkillTooltip>
  );
};

// ─────────────────────────────────────────────────────────
// Category section
// ─────────────────────────────────────────────────────────

const CategorySection = ({
  title,
  skills,
  categoryIndex,
  viewMode,
}: {
  title: string;
  skills: SkillT[];
  categoryIndex: number;
  viewMode: ViewMode;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{
        duration: 0.5,
        delay: Math.min(categoryIndex * 0.06, 0.4),
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="mb-10"
    >
      {/* Category header */}
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold whitespace-nowrap">
          {title}
        </h3>
        <div className="flex-1 h-px bg-border/40" />
        <span className="text-xs text-muted-foreground/50 tabular-nums">{skills.length}</span>
      </div>

      {/* Grid view */}
      {viewMode === 'grid' && (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, idx) => (
            <SkillGridBadge
              key={skill.id}
              skill={skill}
              index={idx}
              isVisible={isInView}
            />
          ))}
        </div>
      )}

      {/* List view with proficiency bars */}
      {viewMode === 'list' && (
        <div className="space-y-0.5">
          {skills.map((skill, idx) => (
            <SkillListRow key={skill.id} skill={skill} index={idx} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────
// View toggle
// ─────────────────────────────────────────────────────────

const ViewToggle = ({
  mode,
  onChange,
}: {
  mode: ViewMode;
  onChange: (m: ViewMode) => void;
}) => {
  return (
    <div className="flex items-center gap-1 bg-muted/60 rounded-lg p-1">
      {(['grid', 'list'] as ViewMode[]).map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={`relative px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
            mode === m
              ? 'text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {mode === m && (
            <motion.div
              layoutId="view-indicator"
              className="absolute inset-0 bg-background rounded-md shadow-sm"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            {m === 'grid' ? (
              <>
                <GridIcon />
                <span>Grid</span>
              </>
            ) : (
              <>
                <ListIcon />
                <span>Proficiency</span>
              </>
            )}
          </span>
        </button>
      ))}
    </div>
  );
};

const GridIcon = () => (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16">
    <rect x="1" y="1" width="6" height="6" rx="1" />
    <rect x="9" y="1" width="6" height="6" rx="1" />
    <rect x="1" y="9" width="6" height="6" rx="1" />
    <rect x="9" y="9" width="6" height="6" rx="1" />
  </svg>
);

const ListIcon = () => (
  <svg
    className="w-3.5 h-3.5"
    fill="none"
    viewBox="0 0 16 16"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <line x1="1" y1="4" x2="15" y2="4" />
    <line x1="1" y1="8" x2="15" y2="8" />
    <line x1="1" y1="12" x2="15" y2="12" />
  </svg>
);

// ─────────────────────────────────────────────────────────
// Legend (list mode only)
// ─────────────────────────────────────────────────────────

const ProficiencyLegend = () => {
  const levels = Object.entries(proficiencyConfig);
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25 }}
      className="overflow-hidden"
    >
      <div className="flex flex-wrap gap-3 mb-8 p-4 bg-muted/30 rounded-xl">
        <span className="text-xs text-muted-foreground font-medium self-center mr-1">
          Proficiency:
        </span>
        {levels.map(([, config]) => (
          <div key={config.label} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: config.color }}
            />
            <span className="text-xs text-muted-foreground">{config.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────

export const SkillsVisualization = ({
  skills,
  categories,
}: SkillsVisualizationProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const activeCategories = categories.filter((cat) =>
    skills.some((s) => s.분류.includes(cat.key)),
  );

  return (
    <div>
      {/* Controls bar */}
      <div className="flex items-center justify-between mb-8">
        <p className="text-xs text-muted-foreground">
          {skills.length} skills · {activeCategories.length} categories
        </p>
        <ViewToggle mode={viewMode} onChange={setViewMode} />
      </div>

      {/* Legend (list mode) */}
      <AnimatePresence>
        {viewMode === 'list' && <ProficiencyLegend key="legend" />}
      </AnimatePresence>

      {/* Category sections */}
      <div>
        {categories.map((cat, index) => {
          const filtered = skills.filter((skill) =>
            skill.분류.includes(cat.key),
          );
          if (filtered.length === 0) return null;

          return (
            <CategorySection
              key={cat.key}
              title={cat.title}
              skills={filtered}
              categoryIndex={index}
              viewMode={viewMode}
            />
          );
        })}
      </div>
    </div>
  );
};
