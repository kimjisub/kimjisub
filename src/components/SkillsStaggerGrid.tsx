'use client';

import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';

import { type SkillT } from '@/api/notion/skills';
import { IconSlugView } from '@/components/IconSlugView';
import { SkillIconWrapper } from '@/components/introduce/SkillIconWrapper';
import { SafeSkillIcon } from '@/components/SafeSkillIcon';

// ── Variants ──────────────────────────────────────────────
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.75, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// ── Component ─────────────────────────────────────────────
interface SkillsStaggerGridProps {
  skills: SkillT[];
}

/**
 * SkillsStaggerGrid
 * Skills 아이콘들을 viewport 진입 시 staggerChildren 효과로 순차 표시.
 */
export const SkillsStaggerGrid = ({ skills }: SkillsStaggerGridProps) => {
  return (
    <motion.div
      className="flex flex-wrap gap-2"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
    >
      {skills.map((skill) => (
        <motion.div key={skill.id} variants={itemVariants}>
          <Link href={`/skills/${encodeURIComponent(skill.id)}`}>
            <SkillIconWrapper>
              <SafeSkillIcon skill={skill} />
            </SkillIconWrapper>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};
