'use client';

import React from 'react';

import { Skeleton, SkeletonImage, SkeletonText } from './Skeleton';

export interface CareerItemSkeletonProps {
  className?: string;
}

/**
 * CareerItem의 Skeleton 버전
 */
export const CareerItemSkeleton: React.FC<CareerItemSkeletonProps> = ({ className }) => {
  return (
    <article
      className={`rounded-xl border border-border bg-card overflow-hidden ${className}`}
    >
      {/* Cover Image Area */}
      <div className="relative overflow-hidden">
        <SkeletonImage aspectRatio="aspect-[1200/630]" />
      </div>

      {/* Content Area */}
      <div className="p-4">
        {/* Title with Icon */}
        <div className="flex items-center mb-1">
          <Skeleton className="w-6 h-6 rounded mr-2" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Description */}
        <SkeletonText lines={2} className="mt-2" />
      </div>
    </article>
  );
};
