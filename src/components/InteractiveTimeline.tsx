'use client';

import React, { useRef, useState } from 'react';
import { format } from 'date-fns';
import {
  AnimatePresence,
  cubicBezier,
  motion,
  useInView,
  useScroll,
  useTransform,
} from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { CareerT } from '@/api/notion/careers';
import { BlurImage } from '@/components/BlurImage';

// ────────────────────────────────────────────
// Variants
// ────────────────────────────────────────────

const EASE = cubicBezier(0.25, 0.46, 0.45, 0.94);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, when: 'beforeChildren' as const },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: EASE },
  },
};

const expandVariants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: {
    height: 'auto',
    opacity: 1,
    transition: { duration: 0.3, ease: EASE },
  },
};

// ────────────────────────────────────────────
// Pulse dot for ongoing items
// ────────────────────────────────────────────

const PulseDot = () => (
  <span className="relative flex h-4 w-4">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
    <span className="relative inline-flex h-4 w-4 rounded-full bg-accent" />
  </span>
);

// ────────────────────────────────────────────
// TimelineItem
// ────────────────────────────────────────────

interface TimelineItemProps {
  career: CareerT;
}

const TimelineItem = ({ career }: TimelineItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px 0px' });
  const [hovered, setHovered] = useState(false);

  const isOngoing = !career.date.end;
  const hasCoverImage = !!career.cover;

  const icon = career.icon ? (
    <Image
      className="w-5 h-5 rounded-sm shrink-0"
      width={20}
      height={20}
      src={career.icon}
      alt={`${career.title} 아이콘`}
    />
  ) : career.iconEmoji ? (
    <span className="text-base leading-none shrink-0">{career.iconEmoji}</span>
  ) : null;

  const formatDateRange = () => {
    const start = career.date.start ? format(career.date.start, 'yyyy.MM') : '';
    const end = career.date.end ? format(career.date.end, 'yyyy.MM') : '현재';
    return start ? `${start} — ${end}` : '';
  };

  // Extra detail tags
  const detailTags = [
    ...(career.institutions ?? []),
    ...(career.assignedTasks ?? []),
  ];

  return (
    <motion.div
      ref={ref}
      variants={itemVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className="relative flex gap-6 pb-10 last:pb-0"
    >
      {/* ── Node column ── */}
      <div className="flex flex-col items-center shrink-0" style={{ width: 20 }}>
        {/* Node */}
        <motion.button
          aria-label={`${career.title} 상세 보기`}
          onClick={() => setHovered((v) => !v)}
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          className="relative z-10 cursor-pointer focus:outline-none"
          whileHover={{ scale: 1.25 }}
          whileTap={{ scale: 0.9 }}
        >
          {isOngoing ? (
            <PulseDot />
          ) : (
            <motion.span
              className={`block h-4 w-4 rounded-full border-2 transition-colors duration-200 ${
                hovered
                  ? 'bg-accent border-accent shadow-lg shadow-accent/40'
                  : 'bg-background border-border dark:bg-card dark:border-border'
              }`}
            />
          )}
        </motion.button>
        {/* Connector line (skip for last item) */}
        <div className="flex-1 w-px bg-border mt-1" />
      </div>

      {/* ── Content column ── */}
      <motion.div
        className="flex-1 min-w-0 -mt-1"
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
      >
        <Link href={`/careers/${encodeURIComponent(career.id)}`} prefetch>
          <motion.article
            className={`relative rounded-xl border bg-card overflow-hidden transition-shadow duration-300 cursor-pointer ${
              hovered
                ? 'border-accent/40 shadow-lg shadow-accent/10 dark:shadow-accent/5'
                : 'border-border'
            }`}
            animate={hovered ? { y: -2 } : { y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* 이미지가 있으면 우측에 작게 배치 */}
            <div className={`${hasCoverImage ? 'flex' : ''}`}>
              {/* 텍스트 컨텐츠 */}
              <div className={`p-4 md:p-5 ${hasCoverImage ? 'flex-1' : ''}`}>
                {/* Date */}
                <p className="text-xs text-muted-foreground mb-2 font-mono tracking-wide">
                  {formatDateRange()}
                </p>

                {/* Title */}
                <h3
                  className={`font-medium flex items-center gap-2 mb-1 transition-colors duration-200 ${
                    hovered ? 'text-accent' : 'text-foreground'
                  }`}
                >
                  {icon}
                  <span className="line-clamp-1">{career.title}</span>
                  {isOngoing && (
                    <span className="ml-auto shrink-0 px-2 py-0.5 bg-accent text-accent-foreground text-xs font-medium rounded-full">
                      진행 중
                    </span>
                  )}
                </h3>

                {/* Description */}
                {career.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {career.description}
                  </p>
                )}

                {/* Categories */}
                {career.categories && career.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {career.categories.slice(0, 3).map((cat) => (
                      <span
                        key={cat.name}
                        className="px-2 py-0.5 text-xs rounded-full bg-secondary text-secondary-foreground"
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Expandable details on hover */}
                <AnimatePresence initial={false}>
                  {hovered && detailTags.length > 0 && (
                    <motion.div
                      key="details"
                      variants={expandVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      className="overflow-hidden"
                    >
                      <div className="pt-3 mt-3 border-t border-border/60">
                        <p className="text-xs text-muted-foreground mb-1.5 font-medium uppercase tracking-wider">
                          상세 정보
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {detailTags.map((tag) => (
                            <span
                              key={tag.name}
                              className="px-2 py-0.5 text-xs rounded-full border border-accent/30 text-accent bg-accent/10"
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cover image - 우측에 작게 배치, hover 시 확장 */}
              {hasCoverImage && (
                <motion.div 
                  className="relative overflow-hidden shrink-0"
                  animate={{
                    width: hovered ? 200 : 120,
                  }}
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <div className="h-full">
                    <BlurImage
                      className={`w-full h-full object-cover transition-transform duration-500 ${
                        hovered ? 'scale-105' : 'scale-100'
                      }`}
                      width={200}
                      height={150}
                      src={career.cover!}
                      alt={`${career.title} 커버 이미지`}
                      sizes="200px"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-card/20" />
                </motion.div>
              )}
            </div>
          </motion.article>
        </Link>
      </motion.div>
    </motion.div>
  );
};

// ────────────────────────────────────────────
// InteractiveTimeline
// ────────────────────────────────────────────

interface InteractiveTimelineProps {
  careers: CareerT[];
}

export const InteractiveTimeline = ({ careers }: InteractiveTimelineProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-60px' });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 80%', 'end 20%'],
  });

  // Scroll-driven line fill
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  // Sort newest first
  const sortedCareers = [...careers].sort((a, b) => {
    const dateA = a.date.start?.getTime() ?? 0;
    const dateB = b.date.start?.getTime() ?? 0;
    return dateB - dateA;
  });

  return (
    <div ref={containerRef} className="relative pl-5">
      {/* ── Vertical line (left) ── */}
      {/* Background track */}
      <div className="absolute left-[9px] top-0 bottom-0 w-px bg-border" />
      {/* Scroll-driven fill */}
      <motion.div
        className="absolute left-[9px] top-0 w-px origin-top bg-gradient-to-b from-accent via-accent to-accent/30"
        style={{ height: lineHeight }}
      />

      {/* ── Items ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="relative"
      >
        {sortedCareers.map((career) => (
          <TimelineItem key={career.id} career={career} />
        ))}
      </motion.div>
    </div>
  );
};

export default InteractiveTimeline;
