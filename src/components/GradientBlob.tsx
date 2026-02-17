'use client';

import { memo } from 'react';

/**
 * Animated gradient blob background effect
 * Inspired by Vercel/Linear-style floating gradient backgrounds
 * Uses CSS transforms for GPU acceleration
 */
export const GradientBlob = memo(function GradientBlob() {
  return (
    <div 
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Blob 1 - Primary accent color */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-30 dark:opacity-20 blur-[100px] will-change-transform animate-blob-1"
        style={{
          background: 'var(--blob-color-1)',
          top: '-10%',
          left: '10%',
        }}
      />
      
      {/* Blob 2 - Secondary color */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-25 dark:opacity-15 blur-[80px] will-change-transform animate-blob-2"
        style={{
          background: 'var(--blob-color-2)',
          top: '20%',
          right: '5%',
        }}
      />
      
      {/* Blob 3 - Tertiary color */}
      <div
        className="absolute w-[350px] h-[350px] rounded-full opacity-20 dark:opacity-15 blur-[90px] will-change-transform animate-blob-3"
        style={{
          background: 'var(--blob-color-3)',
          bottom: '10%',
          left: '30%',
        }}
      />
    </div>
  );
});
