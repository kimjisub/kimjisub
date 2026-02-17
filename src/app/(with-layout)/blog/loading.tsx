import React from 'react';

import { AnimatedSection, AnimatedTitle } from '@/components/motion/AnimatedSection';
import { Skeleton, SkeletonBadge, SkeletonText } from '@/components/skeleton';

/**
 * Blog 목록 페이지 로딩 Skeleton
 */
export default function BlogLoading() {
  return (
    <section className="py-24 px-6 max-w-4xl mx-auto">
      <header className="mb-16">
        <AnimatedTitle className="font-serif text-3xl md:text-4xl text-foreground mb-4 italic">
          Blog
        </AnimatedTitle>
        <AnimatedSection delay={0.1}>
          <SkeletonText className="max-w-xl" />
        </AnimatedSection>
      </header>

      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <BlogItemSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

/**
 * 개별 블로그 아이템 Skeleton
 */
function BlogItemSkeleton() {
  return (
    <article className="p-6 rounded-xl bg-card border border-border">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* Title */}
          <Skeleton className="h-5 w-3/4 mb-3" />
          
          {/* Description */}
          <SkeletonText lines={2} className="mb-3" />
          
          {/* Tags */}
          <div className="flex gap-2">
            <SkeletonBadge />
            <SkeletonBadge />
          </div>
        </div>
        
        {/* Date */}
        <Skeleton className="h-4 w-20 shrink-0" />
      </div>
    </article>
  );
}
