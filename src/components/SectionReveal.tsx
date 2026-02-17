'use client';

import { ReactNode, useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';

// --- Variants ---

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// --- Types ---

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  /** Additional delay before the animation starts (seconds) */
  delay?: number;
  /** Vertical distance to slide up from (px) */
  distance?: number;
  /** Animation duration (seconds) */
  duration?: number;
  /** Enable stagger mode — children slide up sequentially */
  stagger?: boolean;
  /** Delay between staggered children (seconds) */
  staggerDelay?: number;
}

/**
 * SectionReveal — scroll-triggered fade-in + slide-up wrapper.
 *
 * Basic usage:
 *   <SectionReveal><YourSection /></SectionReveal>
 *
 * Stagger mode (children animate sequentially):
 *   <SectionReveal stagger>
 *     <SectionRevealItem>...</SectionRevealItem>
 *     <SectionRevealItem>...</SectionRevealItem>
 *   </SectionReveal>
 */
export const SectionReveal = ({
  children,
  className,
  delay = 0,
  distance = 30,
  duration = 0.6,
  stagger = false,
  staggerDelay = 0.1,
}: SectionRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  if (stagger) {
    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: staggerDelay,
              delayChildren: delay,
            },
          },
        }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: distance }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: distance }}
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
 * SectionRevealItem — use inside <SectionReveal stagger>.
 * Each item fades in and slides up with an offset delay from siblings.
 */
export const SectionRevealItem = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
};

// Re-export container/item variants for advanced usage
export { containerVariants, itemVariants };
