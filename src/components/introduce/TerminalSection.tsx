'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

import { InteractiveTerminal } from '@/components/InteractiveTerminal';
import { useTerminal } from '@/context/TerminalContext';

export const TerminalSection = () => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: false, margin: '-100px' });
  const isInViewOnce = useInView(ref, { once: true, margin: '-100px' });
  
  const { setInlineMode } = useTerminal();
  
  // viewport에 들어오면 inline mode, 벗어나면 해제
  // 컴포넌트 언마운트 시에도 해제 (다른 페이지로 이동 시)
  useEffect(() => {
    setInlineMode(isInView);
    return () => setInlineMode(false);
  }, [isInView, setInlineMode]);

  return (
    <section className="py-12 md:py-24 border-t border-border" ref={ref}>
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <motion.div
          className="mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInViewOnce ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4 italic">
            Terminal
          </h2>
          <p className="text-muted-foreground">
            Explore my portfolio the hacker way. Type <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">/help</code> to get started.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={isInViewOnce ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.98 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <InteractiveTerminal mode="inline" />
        </motion.div>
      </div>
    </section>
  );
};

export default TerminalSection;
