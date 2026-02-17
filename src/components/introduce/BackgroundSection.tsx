'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export const BackgroundSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 border-t border-border" ref={ref}>
      <div className="max-w-4xl mx-auto px-6">
        <motion.h2 
          className="font-serif text-2xl md:text-3xl text-foreground mb-12 italic"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Background
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-6">Education</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <p className="text-foreground">한국외국어대학교 컴퓨터공학과</p>
                <p className="text-muted-foreground">2020 — 2026 (졸업 예정)</p>
              </li>
              <li>
                <p className="text-foreground">한국디지털미디어고등학교 해킹방어과</p>
                <p className="text-muted-foreground">2017 — 2019</p>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-6">Recognition</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <p className="text-foreground">정보올림피아드 금상</p>
                <p className="text-muted-foreground">2017</p>
              </li>
              <li>
                <p className="text-foreground">해커톤 및 창업 대회 18회+ 수상</p>
                <p className="text-muted-foreground">2017 — 2023</p>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
