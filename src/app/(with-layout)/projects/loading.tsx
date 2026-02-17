import React from 'react';

import { AnimatedSection, AnimatedTitle } from '@/components/motion/AnimatedSection';
import { ProjectItemSkeleton } from '@/components/skeleton';

export default function ProjectsLoading() {
  return (
    <section className="py-24 px-6 max-w-4xl mx-auto">
      <header className="mb-16">
        <AnimatedTitle className="font-serif text-3xl md:text-4xl text-foreground mb-4 italic">
          Projects
        </AnimatedTitle>
        <AnimatedSection delay={0.1}>
          <div className="h-5 w-64 bg-muted animate-pulse rounded" />
        </AnimatedSection>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProjectItemSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
