'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image, { ImageProps } from 'next/image';

export interface BlurImageProps extends Omit<ImageProps, 'onLoad' | 'placeholder'> {
  /** Blur placeholder를 사용할지 여부 (base64 데이터가 없을 때 gradient 사용) */
  fallbackGradient?: boolean;
}

/**
 * Next/Image에 부드러운 로딩 전환을 추가한 컴포넌트
 * - 로딩 중: blur 또는 gradient placeholder
 * - 로딩 완료: fade-in 전환
 */
export const BlurImage: React.FC<BlurImageProps> = ({
  className = '',
  fallbackGradient = true,
  alt,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`bg-gradient-to-br from-muted to-muted/50 ${className}`}
        aria-label={alt}
      />
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading placeholder */}
      {!isLoaded && fallbackGradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 animate-pulse" />
      )}
      
      {/* Actual image with fade-in */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full h-full"
      >
        <Image
          {...props}
          alt={alt}
          className="w-full h-full object-cover"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
      </motion.div>
    </div>
  );
};
