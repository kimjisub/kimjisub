'use client';

import React from 'react';

export interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 기본 Skeleton 컴포넌트
 * Tailwind animate-pulse를 사용한 미니멀한 로딩 인디케이터
 */
export const Skeleton: React.FC<SkeletonProps> = ({ className = '', style }) => {
  return (
    <div
      className={`animate-pulse bg-muted rounded ${className}`}
      style={style}
    />
  );
};

/**
 * 텍스트 라인 Skeleton
 */
export const SkeletonText: React.FC<SkeletonProps & { lines?: number }> = ({
  className = '',
  lines = 1,
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  );
};

/**
 * 원형 Skeleton (아바타 등)
 */
export const SkeletonCircle: React.FC<SkeletonProps & { size?: number }> = ({
  className = '',
  size = 40,
}) => {
  return (
    <Skeleton
      className={`rounded-full ${className}`}
      style={{ width: size, height: size }}
    />
  );
};

/**
 * 이미지/카드 영역 Skeleton
 */
export const SkeletonImage: React.FC<SkeletonProps & { aspectRatio?: string }> = ({
  className = '',
  aspectRatio = 'aspect-video',
}) => {
  return <Skeleton className={`w-full ${aspectRatio} ${className}`} />;
};

/**
 * 뱃지 Skeleton
 */
export const SkeletonBadge: React.FC<SkeletonProps> = ({ className = '' }) => {
  return <Skeleton className={`h-5 w-16 rounded-full ${className}`} />;
};
