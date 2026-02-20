'use client';

import { useRef,useState } from 'react';
import { AnimatePresence,motion } from 'framer-motion';

import { SkillT } from '@/api/notion/skills';
import { IconSlugSvg, slugToData } from '@/components/IconSlugView';

export const proficiencyConfig: Record<string, { label: string; percent: number; color: string }> = {
  '상': { label: 'Expert', percent: 90, color: '#22c55e' },
  '중상': { label: 'Advanced', percent: 75, color: '#84cc16' },
  '중': { label: 'Intermediate', percent: 55, color: '#eab308' },
  '중하': { label: 'Familiar', percent: 35, color: '#f97316' },
  '하': { label: 'Learning', percent: 20, color: '#ef4444' },
};

interface SkillTooltipProps {
  skill: SkillT;
  children: React.ReactNode;
}

export const SkillTooltip = ({ skill, children }: SkillTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [side, setSide] = useState<'top' | 'bottom'>('top');
  const ref = useRef<HTMLDivElement>(null);

  const proficiency = skill.숙련도
    ? proficiencyConfig[skill.숙련도]
    : null;

  const projectCount =
    (skill.projectUsedBySkill?.length ?? 0) +
    (skill.projectUsedByLanguage?.length ?? 0);

  const slugData = slugToData(skill.slug);

  const handleMouseEnter = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const spaceAbove = rect.top;
      setSide(spaceAbove < 200 ? 'bottom' : 'top');
    }
    setIsVisible(true);
  };

  return (
    <div
      ref={ref}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: side === 'top' ? 8 : -8, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: side === 'top' ? 8 : -8, scale: 0.92 }}
            transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`absolute z-50 ${
              side === 'top'
                ? 'bottom-full mb-2'
                : 'top-full mt-2'
            } left-1/2 -translate-x-1/2 w-56 pointer-events-none`}
          >
            {/* Arrow */}
            <div
              className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-card border border-border rotate-45 ${
                side === 'top' ? '-bottom-1' : '-top-1'
              }`}
            />

            {/* Tooltip card */}
            <div className="bg-card border border-border rounded-xl shadow-xl p-3 space-y-2.5">
              {/* Header */}
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `#${slugData.hex}` }}
                >
                  {slugData.type !== 'unknown' && <IconSlugSvg slugData={slugData} />}
                </div>
                <span className="font-semibold text-sm text-foreground leading-tight">
                  {skill.title}
                </span>
              </div>

              {/* Description */}
              {skill.description && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {skill.description}
                </p>
              )}

              {/* Proficiency bar */}
              {proficiency && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Proficiency</span>
                    <span
                      className="text-xs font-medium"
                      style={{ color: proficiency.color }}
                    >
                      {proficiency.label}
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${proficiency.percent}%` }}
                      transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: proficiency.color }}
                    />
                  </div>
                </div>
              )}

              {/* Project count */}
              {projectCount > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                  </svg>
                  <span>Used in {projectCount} project{projectCount !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
