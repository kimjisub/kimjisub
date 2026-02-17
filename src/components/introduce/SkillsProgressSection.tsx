'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

import { type SkillT } from '@/api/notion/skills';
import { proficiencyConfig } from '@/components/SkillTooltip';

// ─────────────────────────────────────────────────────────
// Category definitions
// ─────────────────────────────────────────────────────────

const FEATURED_CATEGORIES = [
  {
    title: 'Frontend',
    accent: '#60a5fa',
    skills: ['TypeScript', 'JavaScript', 'React', 'Next.js'],
  },
  {
    title: 'Backend',
    accent: '#34d399',
    skills: ['Python', 'Node.js', 'FastAPI'],
  },
  {
    title: 'DevOps',
    accent: '#a78bfa',
    skills: ['Linux', 'Docker', 'Kubernetes', 'Tailscale'],
  },
  {
    title: 'Firmware',
    accent: '#fb923c',
    skills: ['C', 'C++'],
  },
  {
    title: 'AI / ML',
    accent: '#f472b6',
    skills: ['Ollama', 'vLLM'],
  },
] as const;

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────

const findSkill = (allSkills: SkillT[], name: string): SkillT | undefined =>
  allSkills.find(
    (s) =>
      s.title?.toLowerCase() === name.toLowerCase() ||
      s.title?.toLowerCase().startsWith(name.toLowerCase()),
  );

// ─────────────────────────────────────────────────────────
// Single skill progress row
// ─────────────────────────────────────────────────────────

interface SkillBarRowProps {
  name: string;
  skill: SkillT | undefined;
  accent: string;
  globalIndex: number;
}

const SkillBarRow = ({ name, skill, accent, globalIndex }: SkillBarRowProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });

  const proficiency = skill?.숙련도
    ? proficiencyConfig[skill.숙련도]
    : { label: '—', percent: 20, color: '#94a3b8' };

  const delay = Math.min(globalIndex * 0.05, 0.4);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -12 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
      transition={{ duration: 0.38, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group flex items-center gap-3 py-1.5"
    >
      {/* Skill name */}
      <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors duration-200 w-24 flex-shrink-0 truncate">
        {name}
      </span>

      {/* Bar track */}
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${proficiency.percent}%` } : { width: 0 }}
          transition={{
            duration: 0.9,
            delay: delay + 0.18,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="h-full rounded-full"
          style={{ background: accent }}
        />
      </div>

      {/* Label */}
      <span
        className="text-xs font-medium w-20 flex-shrink-0 text-right hidden sm:block"
        style={{ color: accent }}
      >
        {proficiency.label}
      </span>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────
// Category block
// ─────────────────────────────────────────────────────────

interface CategoryBlockProps {
  title: string;
  accent: string;
  skills: readonly string[];
  allSkills: SkillT[];
  categoryIndex: number;
}

const CategoryBlock = ({
  title,
  accent,
  skills,
  allSkills,
  categoryIndex,
}: CategoryBlockProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.45,
        delay: Math.min(categoryIndex * 0.07, 0.35),
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="space-y-2"
    >
      {/* Category header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: accent }} />
        <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
          {title}
        </h3>
        <div className="flex-1 h-px" style={{ background: `${accent}22` }} />
      </div>

      {/* Skill bars */}
      <div className="space-y-0.5">
        {skills.map((name, idx) => (
          <SkillBarRow
            key={name}
            name={name}
            skill={findSkill(allSkills, name)}
            accent={accent}
            globalIndex={categoryIndex * 4 + idx}
          />
        ))}
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────

interface SkillsProgressSectionProps {
  skills: SkillT[];
}

export const SkillsProgressSection = ({ skills }: SkillsProgressSectionProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
      {FEATURED_CATEGORIES.map((cat, index) => (
        <CategoryBlock
          key={cat.title}
          title={cat.title}
          accent={cat.accent}
          skills={cat.skills}
          allSkills={skills}
          categoryIndex={index}
        />
      ))}
    </div>
  );
};
