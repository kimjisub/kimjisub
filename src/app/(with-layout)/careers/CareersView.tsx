'use client';

import React, { useState } from 'react';
import { faClock,faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence,motion } from 'framer-motion';

import { CareerT } from '@/api/notion/careers';
import { CareerItem } from '@/components/CareerItem';
import { InteractiveTimeline } from '@/components/InteractiveTimeline';
import { AnimatedGridItem, AnimatedSection, AnimatedTitle } from '@/components/motion/AnimatedSection';

type ViewMode = 'grid' | 'timeline';

interface CareersViewProps {
  careers: CareerT[];
}

export const CareersView = ({ careers }: CareersViewProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');

  return (
    <>
      <header className="mb-12">
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

      <AnimatePresence mode="wait">
        {viewMode === 'timeline' ? (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <InteractiveTimeline careers={careers} />
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          >
            {careers.map((career, index) => (
              <AnimatedGridItem key={career.id} index={index}>
                <CareerItem career={career} />
              </AnimatedGridItem>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
