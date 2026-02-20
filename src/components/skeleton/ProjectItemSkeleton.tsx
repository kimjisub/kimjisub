'use client';

import React from 'react';

import { Skeleton, SkeletonBadge, SkeletonImage, SkeletonText } from './Skeleton';

export interface ProjectItemSkeletonProps {
  className?: string;
}

/**
 * ProjectItem의 Skeleton 버전
 */
export const ProjectItemSkeleton: React.FC<ProjectItemSkeletonProps> = ({ className }) => {
  return (
    <article
      className={`rounded-2xl border border-border bg-card overflow-hidden ${className}`}
    >
      {/* Cover Image Area */}
      <div className="relative overflow-hidden">
        <SkeletonImage aspectRatio="aspect-[1200/630]" />
        {/* Title Overlay */}
        <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-sm border border-border">
          <div className="flex items-center">
            <Skeleton className="w-6 h-6 rounded mr-2" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <SkeletonBadge />
          <SkeletonBadge />
          <SkeletonBadge />
        </div>

        {/* Description */}
        <SkeletonText lines={2} />

        {/* Date */}
        <Skeleton className="h-3 w-20 mt-3" />
      </div>
    </article>
  );
};
