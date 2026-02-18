'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

import { MagneticLink } from '@/components/MagneticWrapper';

export const ContactSectionAnimated = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 border-t border-border" ref={ref}>
      <div className="max-w-4xl mx-auto px-6">
        <motion.h2 
          className="font-serif text-2xl md:text-3xl text-foreground mb-8 italic"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Contact
        </motion.h2>
        
        <motion.div 
          className="flex flex-wrap gap-4 items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <MagneticLink
            href="mailto:0226daniel@gmail.com"
            className="text-muted-foreground hover:text-foreground transition-colors"
            strength={0.35}
            radius={80}
          >
            0226daniel@gmail.com
          </MagneticLink>
          <span className="text-border">·</span>
          <MagneticLink
            href="https://www.linkedin.com/in/kimjisub"
            className="text-muted-foreground hover:text-foreground transition-colors"
            strength={0.35}
            radius={80}
          >
            LinkedIn
          </MagneticLink>
          <span className="text-border">·</span>
          <MagneticLink
            href="https://github.com/kimjisub"
            className="text-muted-foreground hover:text-foreground transition-colors"
            strength={0.35}
            radius={80}
          >
            GitHub
          </MagneticLink>
        </motion.div>
      </div>
    </section>
  );
};
