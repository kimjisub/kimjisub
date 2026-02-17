'use client';

import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useInView, type Variants } from 'framer-motion';

import { type ProjectT } from '@/api/notion/projects';
import { ProjectCarousel } from '@/components/ProjectCarousel';
import { ProjectItem } from '@/components/ProjectItem';

interface ProjectsClientProps {
  projects: ProjectT[];
}

type FilterKey = string; // 'all' | '분류:xxx' | '태그:xxx'

// ── Mobile stagger variants ────────────────────────────────
const mobileListVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

const mobileItemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

/* ─────────────────────────────────────────────────────── */
/* FilterPill                                              */
/* ─────────────────────────────────────────────────────── */
interface FilterPillProps {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

const FilterPill = ({ label, count, isActive, onClick }: FilterPillProps) => (
  <motion.button
    layout
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    aria-pressed={isActive}
    className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors duration-200 select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-none ${
      isActive
        ? 'bg-foreground text-background border-foreground'
        : 'bg-transparent text-muted-foreground border-border hover:border-foreground/40 hover:text-foreground'
    }`}
  >
    {isActive && (
      <motion.span
        layoutId="filter-active-bg"
        className="absolute inset-0 rounded-full bg-foreground -z-10"
        transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
      />
    )}
    {label}
    <span
      className={`text-xs tabular-nums ${
        isActive ? 'text-background/70' : 'text-muted-foreground/60'
      }`}
    >
      {count}
    </span>
  </motion.button>
);

/* ─────────────────────────────────────────────────────── */
/* ProjectsClient                                          */
/* ─────────────────────────────────────────────────────── */
export const ProjectsClient = ({ projects }: ProjectsClientProps) => {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  // whileInView trigger for mobile stagger list
  const mobileListRef = useRef<HTMLDivElement>(null);
  const isMobileInView = useInView(mobileListRef, { once: true, margin: '-100px' });

  /* ── 필터 옵션 수집 ── */
  const categories = useMemo(() => {
    const map = new Map<string, { name: string }>();
    projects.forEach((p) => {
      p.분류?.forEach((c) => {
        if (!map.has(c.name)) map.set(c.name, { name: c.name });
      });
    });
    return Array.from(map.values());
  }, [projects]);

  const tags = useMemo(() => {
    const map = new Map<string, { name: string }>();
    projects.forEach((p) => {
      p.태그?.forEach((t) => {
        if (!map.has(t.name)) map.set(t.name, { name: t.name });
      });
    });
    return Array.from(map.values());
  }, [projects]);

  /* ── 필터링 ── */
  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return projects;
    if (activeFilter.startsWith('분류:')) {
      const name = activeFilter.slice(3);
      return projects.filter((p) => p.분류?.some((c) => c.name === name));
    }
    if (activeFilter.startsWith('태그:')) {
      const name = activeFilter.slice(3);
      return projects.filter((p) => p.태그?.some((t) => t.name === name));
    }
    return projects;
  }, [projects, activeFilter]);

  /* ── 각 필터별 카운트 ── */
  const countFor = (key: FilterKey) => {
    if (key === 'all') return projects.length;
    if (key.startsWith('분류:')) {
      const name = key.slice(3);
      return projects.filter((p) => p.분류?.some((c) => c.name === name)).length;
    }
    if (key.startsWith('태그:')) {
      const name = key.slice(3);
      return projects.filter((p) => p.태그?.some((t) => t.name === name)).length;
    }
    return 0;
  };

  return (
    <div>
      {/* ── 필터 바 ── */}
      <div className="mb-8 px-6">
        {/* 카테고리 + 태그 그룹 */}
        <div className="flex flex-wrap gap-2">
          <FilterPill
            label="All"
            count={countFor('all')}
            isActive={activeFilter === 'all'}
            onClick={() => setActiveFilter('all')}
          />

          {categories.length > 0 && (
            <>
              {/* 구분선 */}
              <span className="self-center w-px h-5 bg-border mx-0.5" aria-hidden />
              {categories.map((cat) => {
                const key = `분류:${cat.name}`;
                return (
                  <FilterPill
                    key={key}
                    label={cat.name}
                    count={countFor(key)}
                    isActive={activeFilter === key}
                    onClick={() => setActiveFilter(key)}
                  />
                );
              })}
            </>
          )}

          {tags.length > 0 && (
            <>
              <span className="self-center w-px h-5 bg-border mx-0.5" aria-hidden />
              {tags.map((tag) => {
                const key = `태그:${tag.name}`;
                return (
                  <FilterPill
                    key={key}
                    label={tag.name}
                    count={countFor(key)}
                    isActive={activeFilter === key}
                    onClick={() => setActiveFilter(key)}
                  />
                );
              })}
            </>
          )}
        </div>

        {/* 필터 결과 카운트 */}
        <motion.p
          key={filteredProjects.length}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-sm text-muted-foreground"
        >
          {activeFilter === 'all'
            ? `총 ${filteredProjects.length}개 프로젝트`
            : `${filteredProjects.length}개 프로젝트`}
        </motion.p>
      </div>

      {/* ── 데스크탑: 캐러셀 ── */}
      <div className="hidden md:block">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {filteredProjects.length > 0 ? (
              <ProjectCarousel projects={filteredProjects} />
            ) : (
              <EmptyState />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── 모바일: 세로 그리드 (staggerChildren + whileInView) ── */}
      <div ref={mobileListRef} className="md:hidden px-6">
        <AnimatePresence mode="wait">
          {filteredProjects.length > 0 ? (
            <motion.div
              key={activeFilter}
              variants={mobileListVariants}
              initial="hidden"
              animate={isMobileInView ? 'visible' : 'hidden'}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={mobileItemVariants}
                  className="mb-6"
                >
                  <ProjectItem project={project} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <EmptyState />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────── */
/* EmptyState                                             */
/* ─────────────────────────────────────────────────────── */
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
    <span className="text-4xl mb-4">🔍</span>
    <p className="text-sm">해당 필터에 맞는 프로젝트가 없어요.</p>
  </div>
);
