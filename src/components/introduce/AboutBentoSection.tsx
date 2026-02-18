'use client';

import { useEffect, useRef, useState } from 'react';
import { Award, Briefcase, Code, Download, GraduationCap, Lightbulb, MapPin, Rocket, Sparkles, Trophy } from 'lucide-react';
import { AnimatePresence, motion, useInView, type Variants } from 'framer-motion';

import { AnimatedCounter } from '@/components/AnimatedCounter';
import { BentoCard, BentoGrid } from '@/components/BentoGrid';

// ── Tech stack ────────────────────────────────────────────────────────────
const TECH_STACK = [
  { name: 'TypeScript', color: '#3178c6' },
  { name: 'React', color: '#61dafb' },
  { name: 'Next.js', color: '#ffffff' },
  { name: 'Python', color: '#3776ab' },
  { name: 'Docker', color: '#2496ed' },
  { name: 'Kubernetes', color: '#326ce5' },
  { name: 'LLM / AI', color: '#22c55e' },
  { name: 'Firmware', color: '#f97316' },
] as const;

// ── Interest tags ─────────────────────────────────────────────────────────
const INTERESTS = ['AI/LLM', 'DevTools', 'Startup', 'IoT', 'Infra', '투자'] as const;

// ── Values ────────────────────────────────────────────────────────────────
const VALUES = [
  { icon: '🎯', text: '문제의 본질을 파고드는 것' },
  { icon: '🔧', text: '코드보다 돌아가는 시스템' },
  { icon: '📐', text: '자동화와 시스템화' },
] as const;

// ── Milestones ────────────────────────────────────────────────────────────
const MILESTONES = [
  {
    icon: Download,
    value: 500,
    suffix: '만+',
    label: 'UniPad 다운로드',
    sublabel: '중학교 때 만든 앱',
    year: '2016',
    color: 'text-accent',
  },
  {
    icon: Code,
    value: 12,
    suffix: '+',
    label: '년 코딩 경력',
    sublabel: '2013년 시작',
    year: '2013~',
    color: 'text-blue-400',
  },
  {
    icon: Trophy,
    value: 15,
    suffix: '+',
    label: '해커톤/경진대회',
    sublabel: '수상 경력',
    year: '2015~',
    color: 'text-yellow-400',
  },
  {
    icon: Rocket,
    value: 2,
    suffix: '',
    label: '스타트업 창업',
    sublabel: 'Alpaon, Synap.us',
    year: '2020~',
    color: 'text-purple-400',
  },
] as const;

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

// ── Section header with intro ─────────────────────────────────────────────
function SectionHeader({ isInView }: { isInView: boolean }) {
  return (
    <div className="mb-10">
      <motion.h2
        className="font-serif text-2xl md:text-3xl text-foreground mb-4 italic"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        About
      </motion.h2>
      <motion.p
        className="text-muted-foreground text-base md:text-lg max-w-2xl leading-relaxed"
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        기술로 문제를 해결하고, 시스템으로 가치를 만드는 <span className="text-foreground font-medium">Builder</span>입니다.
        <br className="hidden sm:block" />
        {' '}단순히 코드를 작성하는 것이 아니라, <span className="text-accent">돌아가는 시스템</span>을 만드는 것에 집중합니다.
      </motion.p>
    </div>
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
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-4 h-4 text-accent" />
        <p className="text-xs text-muted-foreground uppercase tracking-widest">Location</p>
      </div>
      <p className="font-semibold text-foreground text-lg">Seoul, Korea</p>
      <p className="text-xs text-muted-foreground mb-2">KST (UTC+9)</p>
      <KSTClock />
    </BentoCard>
  );
}

/** 💼 현재 역할 — 2×1 */
function RoleCard() {
  const roles = [
    { 
      company: 'Alpaon', 
      role: 'CTO · Co-founder', 
      desc: '산업용 IoT 클라우드',
      color: 'bg-accent/10 text-accent border-accent/20',
      highlight: true,
    },
    { 
      company: 'Candid', 
      role: 'Product Engineer', 
      desc: '스타트업 채용 컨설팅',
      color: 'bg-blue-500/10 text-blue-400 border-blue-400/20',
      highlight: false,
    },
  ];

  return (
    <BentoCard size="2x1" accent>
      <div className="flex items-center gap-2 mb-4">
        <Briefcase className="w-4 h-4 text-accent" />
        <p className="text-xs text-muted-foreground uppercase tracking-widest">Current Roles</p>
      </div>
      <div className="space-y-3">
        {roles.map(({ company, role, desc, color, highlight }) => (
          <div 
            key={company} 
            className={`p-3 rounded-lg border transition-colors ${
              highlight ? 'bg-accent/5 border-accent/20' : 'bg-secondary/30 border-border/50'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-semibold text-foreground text-sm">{company}</span>
              <span className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full border ${color}`}>
                {role}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
    </BentoCard>
  );
}

/** 🎓 학력 — 1×1 */
function EducationCard() {
  return (
    <BentoCard size="1x1">
      <div className="flex items-center gap-2 mb-3">
        <GraduationCap className="w-4 h-4 text-blue-400" />
        <p className="text-xs text-muted-foreground uppercase tracking-widest">Education</p>
      </div>
      <p className="font-semibold text-foreground text-sm">한국외국어대학교</p>
      <p className="text-xs text-muted-foreground mb-2">컴퓨터공학부</p>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-400/20">
          2026.02 졸업예정
        </span>
      </div>
    </BentoCard>
  );
}

/** 💡 가치관 — 1×1 */
function ValuesCard() {
  return (
    <BentoCard size="1x1">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-4 h-4 text-yellow-400" />
        <p className="text-xs text-muted-foreground uppercase tracking-widest">Values</p>
      </div>
      <div className="space-y-2">
        {VALUES.map(({ icon, text }) => (
          <div key={text} className="flex items-start gap-2">
            <span className="text-sm shrink-0">{icon}</span>
            <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
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
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-purple-400" />
        <p className="text-xs text-muted-foreground uppercase tracking-widest">Interests</p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {INTERESTS.map((tag) => (
          <span
            key={tag}
            className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border hover:border-accent/50 transition-colors cursor-default"
          >
            {tag}
          </span>
        ))}
      </div>
    </BentoCard>
  );
}

/** 🔧 기술 스택 — 2×1 */
function TechStackCard() {
  return (
    <BentoCard size="2x1">
      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Core Tech Stack</p>
      <div className="flex flex-wrap gap-2">
        {TECH_STACK.map(({ name, color }) => (
          <motion.span
            key={name}
            title={name}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-border bg-secondary/50 text-foreground font-medium hover:border-accent/50 transition-colors"
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: color }}
            />
            {name}
          </motion.span>
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground/60 mt-3">+ React Native, Flutter, C/C++ (Firmware), Linux, …</p>
    </BentoCard>
  );
}

/** 🚀 성과 캐러셀 — 1×1 */
function MilestoneCard() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-rotate every 4 seconds (pause on hover)
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % MILESTONES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered]);

  const milestone = MILESTONES[current];
  const Icon = milestone.icon;

  return (
    <BentoCard size="1x1" accent>
      <div 
        className="flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-accent" />
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Milestones</p>
          </div>
          <span className="text-[10px] text-muted-foreground/60 tabular-nums">
            {current + 1}/{MILESTONES.length}
          </span>
        </div>

        {/* Content with slide animation */}
        <div className="h-[100px] relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute inset-0"
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-5 h-5 ${milestone.color}`} />
                <span className="text-[10px] text-muted-foreground/60">{milestone.year}</span>
              </div>
              <p className={`text-3xl font-bold tabular-nums ${milestone.color}`}>
                {milestone.value.toLocaleString()}{milestone.suffix}
              </p>
              <p className="text-sm text-foreground font-medium mt-1">{milestone.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{milestone.sublabel}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots indicator */}
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {MILESTONES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                idx === current 
                  ? 'bg-accent w-3' 
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              aria-label={`Milestone ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </BentoCard>
  );
}

// ── Main section ──────────────────────────────────────────────────────────

export function AboutBentoSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-12 md:py-24 border-t border-border" ref={ref}>
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <SectionHeader isInView={isInView} />

        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/*
            Desktop layout (lg: 4-col grid):
            Row 1: [Location 1x1] [Role 2x1         ] [Milestone 1x1]
            Row 2: [Education 1x1] [Tech Stack 2x1  ] [Values 1x1]
            Row 3: [Interest 1x1] [empty 2x1       ]

            Tablet (sm: 2-col): cards reflow naturally.
            Mobile (1-col): stacked.
          */}
          <BentoGrid cols={4}>
            {/* Row 1 */}
            <motion.div variants={item} className="col-span-1">
              <LocationCard />
            </motion.div>
            <motion.div variants={item} className="col-span-1 sm:col-span-2">
              <RoleCard />
            </motion.div>
            <motion.div variants={item} className="col-span-1">
              <MilestoneCard />
            </motion.div>

            {/* Row 2 */}
            <motion.div variants={item} className="col-span-1">
              <EducationCard />
            </motion.div>
            <motion.div variants={item} className="col-span-1 sm:col-span-2">
              <TechStackCard />
            </motion.div>
            <motion.div variants={item} className="col-span-1">
              <ValuesCard />
            </motion.div>

            {/* Row 3 */}
            <motion.div variants={item} className="col-span-1">
              <InterestCard />
            </motion.div>
          </BentoGrid>
        </motion.div>
      </div>
    </section>
  );
}
