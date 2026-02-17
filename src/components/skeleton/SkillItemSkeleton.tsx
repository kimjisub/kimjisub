'use client';

import React from 'react';

import { Skeleton } from './Skeleton';

export interface SkillItemSkeletonProps {
  variant?: 'default' | 'inline';
  className?: string;
}

/**
 * SkillItem의 Skeleton 버전
 */
export const SkillItemSkeleton: React.FC<SkillItemSkeletonProps> = ({
  variant = 'default',
  className = '',
}) => {
  if (variant === 'default') {
    return (
      <div className={`text-center ${className}`}>
        <Skeleton className="w-12 h-12 rounded-xl" />
      </div>
    );
  }

  // inline variant
  return (
    <span className={`inline-flex items-center rounded-xl p-2 space-x-2 ${className}`}>
      <Skeleton className="w-8 h-8 rounded" />
      <Skeleton className="h-4 w-16" />
    </span>
  );
};

/**
 * 스킬 아이콘 그리드용 Skeleton
 */
export const SkillIconSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return <Skeleton className={`w-12 h-12 rounded-xl ${className}`} />;
};
