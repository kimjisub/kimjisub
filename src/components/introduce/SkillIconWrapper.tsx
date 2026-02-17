'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SkillIconWrapperProps {
  children: ReactNode;
}

export const SkillIconWrapper = ({ children }: SkillIconWrapperProps) => {
  return (
    <motion.div
      className="p-2.5 rounded-lg bg-card border border-border hover:border-foreground/30 transition-colors"
      whileHover={{ 
        scale: 1.1,
        transition: { duration: 0.2, ease: 'easeOut' }
      }}
      whileTap={{ scale: 0.95 }}
      style={{ willChange: 'transform' }}
    >
      {children}
    </motion.div>
  );
};
