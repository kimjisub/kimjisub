'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import dynamic from 'next/dynamic';

const InteractiveTerminal = dynamic(
  () => import('@/components/InteractiveTerminal'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full max-w-3xl mx-auto rounded-lg overflow-hidden shadow-2xl border border-border">
        <div className="flex items-center gap-2 px-4 py-3 bg-secondary border-b border-border">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-sm text-muted-foreground ml-2 font-mono">
            jisub@portfolio ~ 
          </span>
        </div>
        <div className="bg-zinc-900 dark:bg-zinc-950 p-4 h-[400px] flex items-center justify-center">
          <span className="text-zinc-500 font-mono animate-pulse">Initializing terminal...</span>
        </div>
        <div className="bg-secondary px-4 py-2 border-t border-border">
          <span className="text-xs text-muted-foreground">Loading...</span>
        </div>
      </div>
    )
  }
);

export const TerminalSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 border-t border-border" ref={ref}>
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4 italic">
            Terminal
          </h2>
          <p className="text-muted-foreground">
            Explore my portfolio the hacker way. Type <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">help</code> to get started.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.98 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <InteractiveTerminal />
        </motion.div>
      </div>
    </section>
  );
};

export default TerminalSection;
