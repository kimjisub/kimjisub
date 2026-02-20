'use client';

import React, { useMemo, useState } from 'react';
import { faClock, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence, motion } from 'framer-motion';

import { CareerT } from '@/api/notion/careers';
import { CareerItem } from '@/components/CareerItem';
import { InteractiveTimeline } from '@/components/InteractiveTimeline';
import { AnimatedGridItem, AnimatedSection, AnimatedTitle } from '@/components/motion/AnimatedSection';

type ViewMode = 'grid' | 'timeline';
type FilterKey = string; // 'all' | '분류:xxx'

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
        layoutId="career-filter-active-bg"
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

interface CareersViewProps {
  careers: CareerT[];
}

export const CareersView = ({ careers }: CareersViewProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  /* ── 필터 옵션 수집 ── */
  const categories = useMemo(() => {
    const map = new Map<string, number>();
    careers.forEach((c) => {
      c.categories?.forEach((cat) => {
        map.set(cat.name, (map.get(cat.name) || 0) + 1);
      });
    });
    // 개수 내림차순 정렬
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => ({ name }));
  }, [careers]);

  /* ── 필터링 ── */
  const filteredCareers = useMemo(() => {
    if (activeFilter === 'all') return careers;
    if (activeFilter.startsWith('분류:')) {
      const name = activeFilter.slice(3);
      return careers.filter((c) => c.categories?.some((cat) => cat.name === name));
    }
    return careers;
  }, [careers, activeFilter]);

  /* ── 각 필터별 카운트 ── */
  const countFor = (key: FilterKey) => {
    if (key === 'all') return careers.length;
    if (key.startsWith('분류:')) {
      const name = key.slice(3);
      return careers.filter((c) => c.categories?.some((cat) => cat.name === name)).length;
    }
    return 0;
  };

  return (
    <>
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <AnimatedTitle className="font-serif text-3xl md:text-4xl text-foreground italic">
            Career
          </AnimatedTitle>
          
          {/* View Toggle */}
          <AnimatedSection delay={0.15}>
            <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-lg border border-border">
              <button
                onClick={() => setViewMode('timeline')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === 'timeline'
                    ? 'bg-accent text-accent-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
                aria-label="타임라인 뷰"
              >
                <FontAwesomeIcon icon={faClock} className="w-4 h-4" />
                <span className="hidden sm:inline">Timeline</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-accent text-accent-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
                aria-label="그리드 뷰"
              >
                <FontAwesomeIcon icon={faGripVertical} className="w-4 h-4" />
                <span className="hidden sm:inline">Grid</span>
              </button>
            </div>
          </AnimatedSection>
        </div>
        
        <AnimatedSection delay={0.1}>
          <p className="text-muted-foreground leading-relaxed max-w-xl">
            회사, 대회, 프로젝트 등 경험했던 것들.
          </p>
        </AnimatedSection>
      </header>

      {/* ── 필터 바 ── */}
      <AnimatedSection delay={0.2}>
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <FilterPill
              label="All"
              count={countFor('all')}
              isActive={activeFilter === 'all'}
              onClick={() => setActiveFilter('all')}
            />

            {categories.length > 0 && (
              <>
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
          </div>

          <motion.p
            key={filteredCareers.length}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-sm text-muted-foreground"
          >
            {activeFilter === 'all'
              ? `총 ${filteredCareers.length}개 경력`
              : `${filteredCareers.length}개 경력`}
          </motion.p>
        </div>
      </AnimatedSection>

      <AnimatePresence mode="wait">
        {filteredCareers.length > 0 ? (
          viewMode === 'timeline' ? (
            <motion.div
              key={`timeline-${activeFilter}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <InteractiveTimeline careers={filteredCareers} />
            </motion.div>
          ) : (
            <motion.div
              key={`grid-${activeFilter}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            >
              {filteredCareers.map((career, index) => (
                <AnimatedGridItem key={career.id} index={index}>
                  <CareerItem career={career} />
                </AnimatedGridItem>
              ))}
            </motion.div>
          )
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center justify-center py-24 text-muted-foreground"
          >
            <span className="text-4xl mb-4">🔍</span>
            <p className="text-sm">해당 필터에 맞는 경력이 없어요.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
