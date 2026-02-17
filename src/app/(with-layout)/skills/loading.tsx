import React from 'react';

import { AnimatedSection, AnimatedTitle } from '@/components/motion/AnimatedSection';
import { Skeleton, SkeletonText } from '@/components/skeleton';

/**
 * Skills 페이지 로딩 Skeleton
 */
export default function SkillsLoading() {
  const categories = Array.from({ length: 6 });

  return (
    <section className="py-24 px-6 max-w-4xl mx-auto">
      <header className="mb-16">
        <AnimatedTitle className="font-serif text-3xl md:text-4xl text-foreground mb-4 italic">
          Skills
        </AnimatedTitle>
        <AnimatedSection delay={0.1}>
          <SkeletonText className="max-w-xl" />
        </AnimatedSection>
      </header>

      <div className="space-y-12">
        {categories.map((_, catIndex) => (
          <div key={catIndex}>
            {/* Category title */}
            <Skeleton className="h-6 w-32 mb-4" />
            
            {/* Skill icons grid */}
            <div 
              className="grid gap-4"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(48px, 1fr))' }}
            >
              {Array.from({ length: 8 + (catIndex % 4) }).map((_, i) => (
                <Skeleton key={i} className="w-12 h-12 rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
