'use client';

import { ReactNode, useRef } from 'react';
import { motion, useInView, useReducedMotion, Variants } from 'framer-motion';

export interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  once?: boolean;
}

/**
 * 범용 FadeIn 애니메이션 컴포넌트
 * 요소가 뷰포트에 들어올 때 부드럽게 나타남
 */
export const FadeIn: React.FC<FadeInProps> = ({
  children,
  className,
  delay = 0,
  duration = 0.5,
  direction = 'up',
  distance = 20,
  once = true,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: '-50px' });
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div ref={ref} className={className}>{children}</div>;
  }

  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: distance };
      case 'down':
        return { y: -distance };
      case 'left':
        return { x: distance };
      case 'right':
        return { x: -distance };
      default:
        return {};
    }
  };

  const variants: Variants = {
    hidden: {
      opacity: 0,
      ...getInitialPosition(),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * 이미지 로딩 완료 후 fade-in 효과를 위한 래퍼
 */
export interface FadeInImageWrapperProps {
  children: ReactNode;
  className?: string;
  isLoaded?: boolean;
}

export const FadeInImageWrapper: React.FC<FadeInImageWrapperProps> = ({
  children,
  className,
  isLoaded = false,
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};
