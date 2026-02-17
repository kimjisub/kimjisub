import React from 'react';

import { Skeleton, SkeletonBadge } from '@/components/skeleton';
import { NotionPageSkeleton } from '@/components/skeleton';
import { ProjectItemSkeleton } from '@/components/skeleton';

/**
 * Career 상세 페이지 로딩 Skeleton
 */
export default function CareerDetailLoading() {
  return (
    <div className="py-24 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Main content */}
        <section className="col-span-3">
          {/* Title with icon */}
          <div className="flex items-center space-x-3 mb-8">
            <Skeleton className="w-8 h-8 rounded" />
            <Skeleton className="h-10 w-56" />
          </div>

          {/* Notion content skeleton */}
          <NotionPageSkeleton />
        </section>

        {/* Sidebar */}
        <section className="col-span-2">
          <div className="space-y-6">
            {/* DataList items */}
            {['날짜', '수상 및 수료', '기관', 'importance', '분류'].map((label) => (
              <div key={label} className="flex items-start gap-4">
                <Skeleton className="h-4 w-20 flex-shrink-0" />
                <div className="flex flex-wrap gap-2">
                  <SkeletonBadge />
                  {label === '분류' && <SkeletonBadge />}
                </div>
              </div>
            ))}

            {/* Related Projects */}
            <div className="space-y-4 mt-8">
              <Skeleton className="h-6 w-40" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 2 }).map((_, i) => (
                  <ProjectItemSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
