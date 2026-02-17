import React from 'react';

import { Skeleton } from '@/components/skeleton';
import { NotionPageSkeleton } from '@/components/skeleton';
import { ProjectItemSkeleton } from '@/components/skeleton';

/**
 * Skill 상세 페이지 로딩 Skeleton
 */
export default function SkillDetailLoading() {
  return (
    <div className="py-24 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Main content */}
        <section className="col-span-3">
          {/* Title with icon */}
          <div className="flex items-center space-x-3 mb-8">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <Skeleton className="h-10 w-48" />
          </div>

          {/* Notion content skeleton */}
          <NotionPageSkeleton />
        </section>

        {/* Sidebar */}
        <section className="col-span-2">
          <div className="space-y-8">
            {/* Related Skills */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <div 
                className="grid gap-4"
                style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(48px, 1fr))' }}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="w-12 h-12 rounded-xl" />
                ))}
              </div>
            </div>

            {/* Related Projects */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-40" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
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
