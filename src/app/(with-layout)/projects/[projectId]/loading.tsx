import React from 'react';

import { Skeleton, SkeletonBadge, SkeletonText } from '@/components/skeleton';
import { NotionPageSkeleton } from '@/components/skeleton';

/**
 * Project 상세 페이지 로딩 Skeleton
 */
export default function ProjectDetailLoading() {
  return (
    <div className="py-24 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Main content */}
        <section className="col-span-3">
          {/* Title */}
          <div className="flex items-center space-x-3 mb-8">
            <Skeleton className="w-8 h-8 rounded" />
            <Skeleton className="h-10 w-64" />
          </div>

          {/* Notion content skeleton */}
          <NotionPageSkeleton />
        </section>

        {/* Sidebar */}
        <section className="col-span-2">
          <div className="space-y-6">
            {/* DataList items */}
            {['날짜', '태그', '분류', '맡은 업무', '주요 기술', '프로그래밍 언어'].map((label) => (
              <div key={label} className="flex items-start gap-4">
                <Skeleton className="h-4 w-20 flex-shrink-0" />
                <div className="flex flex-wrap gap-2">
                  <SkeletonBadge />
                  <SkeletonBadge />
                  {label.includes('기술') && <SkeletonBadge />}
                </div>
              </div>
            ))}

            {/* Related section */}
            <div className="space-y-4 mt-8">
              <Skeleton className="h-6 w-24" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-32 rounded-xl" />
                <Skeleton className="h-32 rounded-xl" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
