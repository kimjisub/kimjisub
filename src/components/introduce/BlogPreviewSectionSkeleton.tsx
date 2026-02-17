import React from 'react';

import { Skeleton, SkeletonBadge, SkeletonImage, SkeletonText } from '@/components/ui/Skeleton';

/**
 * BlogPreviewSection의 Suspense fallback skeleton.
 * 3개의 블로그 카드 그리드 레이아웃을 모사합니다.
 */
export function BlogPreviewSectionSkeleton() {
  return (
    <section className="py-24 border-t border-border">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header row: Title + "더 보기" */}
        <div className="flex items-end justify-between mb-12">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-4 w-14" />
        </div>

        {/* 3-column card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <BlogPreviewCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogPreviewCardSkeleton() {
  return (
    <article className="flex flex-col rounded-xl border border-border bg-card overflow-hidden">
      {/* Thumbnail */}
      <SkeletonImage aspectRatio="aspect-video" />

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          <SkeletonBadge />
          <SkeletonBadge />
        </div>

        {/* Title */}
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-4/5" />

        {/* Description */}
        <SkeletonText lines={2} />

        {/* Date + reading time */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </article>
  );
}
