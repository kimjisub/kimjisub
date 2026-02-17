'use client';

import React from 'react';

import { Skeleton, SkeletonText } from './Skeleton';

export interface NotionPageSkeletonProps {
  className?: string;
}

/**
 * Notion 페이지 콘텐츠의 Skeleton 버전
 * 일반적인 Notion 문서 구조를 모방
 */
export const NotionPageSkeleton: React.FC<NotionPageSkeletonProps> = ({ className }) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Heading */}
      <Skeleton className="h-8 w-3/4" />

      {/* Paragraph 1 */}
      <SkeletonText lines={3} />

      {/* Sub-heading */}
      <Skeleton className="h-6 w-1/2 mt-4" />

      {/* Paragraph 2 */}
      <SkeletonText lines={4} />

      {/* Image placeholder */}
      <Skeleton className="w-full h-48 rounded-lg" />

      {/* Another paragraph */}
      <SkeletonText lines={2} />

      {/* List items */}
      <div className="space-y-2 pl-4">
        <div className="flex items-center gap-2">
          <Skeleton className="w-2 h-2 rounded-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-2 h-2 rounded-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-2 h-2 rounded-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>

      {/* Code block */}
      <Skeleton className="w-full h-32 rounded-lg" />

      {/* Final paragraph */}
      <SkeletonText lines={2} />
    </div>
  );
};
