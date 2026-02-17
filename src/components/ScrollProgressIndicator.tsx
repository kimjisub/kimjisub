'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

const ScrollProgressIndicator: React.FC = () => {
  const { scrollYProgress } = useScroll();
  
  // Smooth spring animation for the progress bar
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, var(--accent) 0%, var(--ring) 50%, var(--accent) 100%)',
      }}
    />
  );
};

export default ScrollProgressIndicator;
