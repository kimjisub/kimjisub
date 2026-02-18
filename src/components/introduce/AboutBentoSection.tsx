'use client';

import { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';

import { AnimatedCounter } from '@/components/AnimatedCounter';
import { BentoCard, BentoGrid } from '@/components/BentoGrid';

// ── Tech stack icons (simple-icons slugs / emoji fallbacks) ───────────────
const TECH_STACK = [
  { name: 'TypeScript', color: '#3178c6' },
  { name: 'React', color: '#61dafb' },
  { name: 'Next.js', color: '#000000' },
  { name: 'Python', color: '#3776ab' },
  { name: 'Rust', color: '#ce412b' },
  { name: 'Go', color: '#00add8' },
  { name: 'Docker', color: '#2496ed' },
  { name: 'Kubernetes', color: '#326ce5' },
  { name: 'LLM / AI', color: '#22c55e' },
  { name: 'Tailwind', color: '#38bdf8' },
] as const;

// ── Interest tags ─────────────────────────────────────────────────────────
const INTERESTS = ['AI / LLM', 'DevTools', 'Startup', 'IoT', 'Infrastructure'] as const;

// ── Stagger animation helpers ─────────────────────────────────────────────
const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut' },
  },
};

// ── Section title ─────────────────────────────────────────────────────────
function SectionTitle({ isInView }: { isInView: boolean }) {
  return (
    <motion.h2
      className="font-serif text-2xl md:text-3xl text-foreground mb-8 italic"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      About
    </motion.h2>
  );
}

// ── Clock widget (live KST time) ──────────────────────────────────────────
function KSTClock() {
  const now = new Date();
  const kstTime = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(now);

  return (
    <p className="text-2xl font-mono font-semibold text-foreground mt-1 tabular-nums">
      {kstTime}
    </p>
  );
}

// ── Individual cards ──────────────────────────────────────────────────────

/** 📍 위치 */
function LocationCard() {
  return (
    <BentoCard size="1x1">
      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Location</p>
      <div className="flex items-center gap-2">
        <span className="text-2xl">📍</span>
        <div>
          <p className="font-semibold text-foreground text-sm leading-tight">Seoul</p>
          <p className="text-xs text-muted-foreground">KST (UTC+9)</p>
        </div>
      </div>
      <KSTClock />
    </BentoCard>
  );
}

/** 💼 현재 역할 — 2×1 */
function RoleCard() {
  const roles = [
    { company: 'Alpaon', role: 'CTO · Co-founder', badge: 'IoT & Cloud', color: 'bg-accent/10 text-accent border-accent/20' },
    { company: 'Candid', role: 'Product Engineer', badge: 'sole engineer', color: 'bg-blue-500/10 text-blue-400 border-blue-400/20' },
  ];

  return (
    <BentoCard size="2x1" accent>
      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Current Roles</p>
      <div className="flex flex-col gap-3">
        {roles.map(({ company, role, badge, color }) => (
          <div key={company} className="flex items-center justify-between gap-2">
            <div>
              <span className="font-semibold text-foreground text-sm">{company}</span>
              <span className="text-muted-foreground text-xs ml-2">— {role}</span>
            </div>
            <span className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full border ${color}`}>
              {badge}
            </span>
          </div>
        ))}
      </div>
    </BentoCard>
  );
}

/** 🎯 관심사 — 1×1 */
function InterestCard() {
  return (
    <BentoCard size="1x1">
      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Interests</p>
      <div className="flex flex-wrap gap-1.5">
        {INTERESTS.map((tag) => (
          <span
            key={tag}
            className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border"
          >
            {tag}
          </span>
        ))}
      </div>
    </BentoCard>
  );
}

/* EducationCard removed */

/** 🔧 기술 스택 — 2×1 */
function TechStackCard() {
  return (
    <BentoCard size="2x1">
      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Tech Stack</p>
      <div className="flex flex-wrap gap-2">
        {TECH_STACK.map(({ name, color }) => (
          <motion.span
            key={name}
            title={name}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border border-border bg-secondary/50 text-foreground font-medium"
            whileHover={{ scale: 1.08 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: color }}
            />
            {name}
          </motion.span>
        ))}
      </div>
    </BentoCard>
  );
}

/* HobbyCard removed */

/** 🌱 UniPad 성과 — 1×1 */
function MilestoneCard() {
  return (
    <BentoCard size="1x1" accent>
      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Milestone</p>
      <AnimatedCounter
        value={500}
        suffix="만+"
        duration={2}
        className="text-3xl font-bold text-accent tabular-nums"
      />
      <p className="text-sm text-foreground font-medium mt-0.5">UniPad 다운로드</p>
      <p className="text-xs text-muted-foreground mt-1">중학교 때 만든 앱 · 2016</p>
    </BentoCard>
  );
}

// ── Main section ──────────────────────────────────────────────────────────

export function AboutBentoSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-24 border-t border-border" ref={ref}>
      <div className="max-w-5xl mx-auto px-6">
        <SectionTitle isInView={isInView} />

        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/*
            Desktop layout (lg: 4-col grid):
            Row 1: [Location 1x1] [Role 2x1         ] [Milestone 1x1]
            Row 2: [Interest 1x1] [Tech Stack 2x1   ]

            Tablet (sm: 2-col): cards reflow naturally.
            Mobile (1-col): stacked.
          */}
          <BentoGrid cols={4}>
            <motion.div variants={item} className="col-span-1 row-span-1">
              <LocationCard />
            </motion.div>
            <motion.div variants={item} className="col-span-2 row-span-1 sm:col-span-2">
              <RoleCard />
            </motion.div>
            <motion.div variants={item} className="col-span-1 row-span-1">
              <MilestoneCard />
            </motion.div>

            <motion.div variants={item} className="col-span-1 row-span-1">
              <InterestCard />
            </motion.div>
            <motion.div variants={item} className="col-span-2 row-span-1 sm:col-span-2">
              <TechStackCard />
            </motion.div>
          </BentoGrid>
        </motion.div>
      </div>
    </section>
  );
}
