import React from 'react';

import { Skeleton } from '@/components/ui/Skeleton';

/**
 * GithubSection의 Suspense fallback skeleton.
 * GitHub 기여도 히트맵 + 통계 카드 레이아웃을 모사합니다.
 */
export function GithubSectionSkeleton() {
  const startYear = 2018;
  const endYear = new Date().getFullYear();
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

  return (
    <section className="py-12 md:py-24 border-t border-border bg-card/30">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Title */}
        <Skeleton className="h-8 w-28 mb-12" />

        {/* Stats grid — 2×4 cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center p-4 bg-card rounded-lg border border-border gap-2"
            >
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>

        {/* Contribution heatmap rows */}
        <div className="flex flex-col items-center gap-y-2">
          {years.map((year) => (
            <div key={year} className="flex flex-row items-center w-fit">
              <Skeleton className="h-3 w-10 mr-3" />
              {/* 52 weeks × ~13px wide each */}
              <Skeleton className="h-[96px] w-[728px] max-w-full rounded" />
            </div>
          ))}
        </div>

        {/* Language stats */}
        <div className="mt-12">
          <Skeleton className="h-3 w-36 mb-4" />
          <Skeleton className="h-4 w-full rounded-full" />
          <div className="flex gap-4 mt-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <Skeleton className="w-2.5 h-2.5 rounded-full" />
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
