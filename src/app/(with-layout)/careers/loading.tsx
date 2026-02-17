import React from 'react';

import { AnimatedSection, AnimatedTitle } from '@/components/motion/AnimatedSection';
import { CareerItemSkeleton, SkeletonText } from '@/components/skeleton';

/**
 * Careers 페이지 로딩 Skeleton
 */
export default function CareersLoading() {
  return (
    <section className="py-24 px-6 max-w-4xl mx-auto">
      <header className="mb-16">
        <AnimatedTitle className="font-serif text-3xl md:text-4xl text-foreground mb-4 italic">
          Career
        </AnimatedTitle>
        <AnimatedSection delay={0.1}>
          <SkeletonText className="max-w-xl" />
        </AnimatedSection>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <CareerItemSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
