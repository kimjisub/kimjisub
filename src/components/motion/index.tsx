'use client';

import { ReactNode, useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';

// 기본 애니메이션 변형들
export const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuad
    }
  }
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
};

export const scaleOnHover: Variants = {
  rest: { 
    scale: 1,
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  },
  hover: { 
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  }
};

// 스크롤 기반 애니메이션 래퍼
interface MotionSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const MotionSection = ({ children, className, delay = 0 }: MotionSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    margin: '-80px 0px -80px 0px' 
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: { 
          opacity: 0, 
          y: 30,
        },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.6,
            delay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// 페이지 진입 애니메이션 래퍼
interface MotionPageProps {
  children: ReactNode;
  className?: string;
}

export const MotionPage = ({ children, className }: MotionPageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Stagger 컨테이너
interface MotionStaggerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export const MotionStagger = ({ children, className, staggerDelay = 0.05 }: MotionStaggerProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    margin: '-50px 0px -50px 0px' 
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1,
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Stagger 아이템
interface MotionItemProps {
  children: ReactNode;
  className?: string;
}

export const MotionItem = ({ children, className }: MotionItemProps) => {
  return (
    <motion.div
      variants={fadeInUp}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// 호버 카드 래퍼
interface MotionCardProps {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'article';
}

export const MotionCard = ({ children, className, as = 'div' }: MotionCardProps) => {
  const Component = as === 'article' ? motion.article : motion.div;
  
  return (
    <Component
      initial="rest"
      whileHover="hover"
      variants={{
        rest: {
          scale: 1,
          boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
        },
        hover: {
          scale: 1.02,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12)',
          transition: {
            duration: 0.25,
            ease: 'easeOut'
          }
        }
      }}
      className={className}
      style={{ willChange: 'transform' }}
    >
      {children}
    </Component>
  );
};

// 스킬 아이콘 호버 래퍼
interface MotionSkillIconProps {
  children: ReactNode;
  className?: string;
}

export const MotionSkillIcon = ({ children, className }: MotionSkillIconProps) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.1,
        transition: { duration: 0.2, ease: 'easeOut' }
      }}
      whileTap={{ scale: 0.95 }}
      className={className}
      style={{ willChange: 'transform' }}
    >
      {children}
    </motion.div>
  );
};

// Re-export motion for direct use
export { motion };

// Page transition components
export { PageTransition, PageEnter } from './PageTransition';

// Animated number component
export { AnimatedNumber } from './AnimatedNumber';
