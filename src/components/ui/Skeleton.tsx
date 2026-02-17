'use client';

import { motion } from 'framer-motion';
import React from 'react';

// ─── Shimmer animation variants ───────────────────────────────────────────────
const shimmerTransition = {
  duration: 1.5,
  repeat: Infinity,
  ease: 'linear' as const,
};

// ─── Base Skeleton ─────────────────────────────────────────────────────────────

export interface SkeletonProps {
  /** Additional Tailwind classes */
  className?: string;
  style?: React.CSSProperties;
  /** 'rectangle' (default) | 'circle' */
  shape?: 'rectangle' | 'circle';
  /** Disable the shimmer and just show static pulse */
  animated?: boolean;
}

/**
 * 범용 Skeleton 컴포넌트
 * framer-motion 기반 shimmer 애니메이션을 적용합니다.
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  style,
  shape = 'rectangle',
  animated = true,
}) => {
  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded';

  return (
    <div
      className={`relative overflow-hidden bg-muted ${shapeClass} ${className}`}
      style={style}
      aria-hidden="true"
    >
      {animated && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={shimmerTransition}
        />
      )}
    </div>
  );
};

// ─── Composition helpers ───────────────────────────────────────────────────────

export interface SkeletonTextProps {
  className?: string;
  /** Number of text lines to render (default: 1) */
  lines?: number;
}

/**
 * 텍스트 블록 Skeleton – 여러 줄 지원
 * 마지막 줄은 75% 너비로 렌더링됩니다.
 */
export const SkeletonText: React.FC<SkeletonTextProps> = ({
  className = '',
  lines = 1,
}) => (
  <div className={`space-y-2 ${className}`} aria-hidden="true">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={`h-4 ${i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'}`}
      />
    ))}
  </div>
);

export interface SkeletonCircleProps {
  className?: string;
  size?: number;
}

/**
 * 원형 Skeleton (아바타, 아이콘 등)
 */
export const SkeletonCircle: React.FC<SkeletonCircleProps> = ({
  className = '',
  size = 40,
}) => (
  <Skeleton
    shape="circle"
    className={className}
    style={{ width: size, height: size }}
  />
);

export interface SkeletonImageProps {
  className?: string;
  /** Tailwind aspect-ratio class (default: 'aspect-video') */
  aspectRatio?: string;
}

/**
 * 이미지/커버 영역 Skeleton
 */
export const SkeletonImage: React.FC<SkeletonImageProps> = ({
  className = '',
  aspectRatio = 'aspect-video',
}) => <Skeleton className={`w-full ${aspectRatio} ${className}`} />;

export interface SkeletonBadgeProps {
  className?: string;
}

/**
 * 태그/뱃지 Skeleton
 */
export const SkeletonBadge: React.FC<SkeletonBadgeProps> = ({ className = '' }) => (
  <Skeleton className={`h-5 w-16 rounded-full ${className}`} />
);
