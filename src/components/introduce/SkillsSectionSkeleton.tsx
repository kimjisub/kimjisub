import React from 'react';

import { Skeleton } from '@/components/ui/Skeleton';

/**
 * SkillsSection의 Suspense fallback skeleton.
 * Radar chart + progress bars + icon grid 레이아웃을 모사합니다.
 */
export function SkillsSectionSkeleton() {
  return (
    <section className="py-12 md:py-24 border-t border-border">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Title "Stack" */}
        <Skeleton className="h-8 w-20 mb-12" />

        {/* Radar chart placeholder */}
        <div className="mb-12 flex justify-center">
          <Skeleton shape="circle" style={{ width: 300, height: 300 }} />
        </div>

        {/* Progress bars section */}
        <div className="mb-12 space-y-6">
          {Array.from({ length: 5 }).map((_, catIdx) => (
            <div key={catIdx}>
              {/* Category label */}
              <Skeleton className="h-3 w-24 mb-3" />
              {/* 3–5 skill bars */}
              <div className="space-y-2">
                {Array.from({ length: 3 + (catIdx % 3) }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-5 h-5 rounded" />
                    <Skeleton className="h-2 flex-1 rounded-full" />
                    <Skeleton className="h-3 w-6" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* "All Technologies" label */}
        <Skeleton className="h-3 w-32 mb-4" />

        {/* Icon grid (40 icons) */}
        <div
          className="grid gap-3 mb-8"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(48px, 1fr))' }}
        >
          {Array.from({ length: 40 }).map((_, i) => (
            <Skeleton key={i} className="w-12 h-12 rounded-xl" />
          ))}
        </div>

        {/* "View all →" link */}
        <Skeleton className="h-4 w-16" />
      </div>
    </section>
  );
}
