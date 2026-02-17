'use client';

import { GradientBlob } from '@/components/GradientBlob';
import { MagneticLink } from '@/components/MagneticButton';
import { NeonText } from '@/components/NeonText';
import { RoughHighlight } from '@/components/RoughHighlight';
import { SectionReveal, SectionRevealItem } from '@/components/SectionReveal';
import { TextScramble } from '@/components/TextScramble';
import { TiltImage } from '@/components/TiltImage';
import { TypewriterEffect } from '@/components/TypewriterEffect';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';
import EasterEggs from '@/components/EasterEggs';

export const HeroSection = () => {
  const [clickCount, setClickCount] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const handleImageClick = useCallback(() => {
    const next = clickCount + 1;
    setClickCount(next);

    // Show a subtle hint after 3 clicks
    if (next === 3) {
      setShowHint(true);
      setTimeout(() => setShowHint(false), 2000);
    }
    // Reset after 10 clicks so it can trigger again
    if (next >= 10) {
      setTimeout(() => setClickCount(0), 5000);
    }
  }, [clickCount]);

  return (
    <section className="min-h-[85vh] flex items-center relative overflow-hidden">
      <EasterEggs clickCount={clickCount} />
      <GradientBlob />
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-24">
        <SectionReveal stagger staggerDelay={0.15} className="flex flex-col md:flex-row items-start gap-12">
          <SectionRevealItem className="relative w-32 h-32 md:w-40 md:h-40">
            {/* Click counter badge */}
            <AnimatePresence>
              {clickCount > 0 && clickCount < 10 && (
                <motion.div
                  key={clickCount}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute -top-2 -right-2 z-10 w-6 h-6 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center select-none pointer-events-none"
                >
                  {clickCount}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hint text */}
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-muted-foreground select-none pointer-events-none"
                >
                  계속 눌러보세요... 👀
                </motion.div>
              )}
            </AnimatePresence>

            <div onClick={handleImageClick} className="cursor-pointer select-none">
              <TiltImage
                src="/logo192.png"
                alt="김지섭"
                width={160}
                height={160}
                priority
              />
            </div>
          </SectionRevealItem>

          <SectionRevealItem className="flex-1">
            <h1 
              className="text-4xl md:text-5xl font-medium mb-4 tracking-tight"
            >
              <NeonText>
                <TextScramble text="김지섭" />
              </NeonText>
            </h1>
            
            <div className="mb-3 text-xl md:text-2xl font-medium text-foreground/80">
              <TypewriterEffect
                texts={[
                  'Full-stack Developer',
                  'Product Engineer',
                  'System Architect',
                  'Firmware Hacker',
                  'Infrastructure Builder',
                ]}
                typingSpeed={75}
                deletingSpeed={40}
                pauseTime={2000}
              />
            </div>

            <p 
              className="text-lg text-muted-foreground mb-6 leading-relaxed max-w-xl"
            >
              <RoughHighlight type="underline" delay={600} animationDuration={600}>
                Alpaon
              </RoughHighlight>{' '}
              CTO.{' '}
              <RoughHighlight type="underline" delay={800} animationDuration={600}>
                Candid
              </RoughHighlight>{' '}
              <RoughHighlight type="highlight" delay={1000} animationDuration={800}>
                <TextScramble text="Product Engineer" frameDelay={2} />
              </RoughHighlight>.<br />
              소프트웨어부터 펌웨어, 인프라까지 직접 만들고 운영합니다.
            </p>

            <div 
              className="flex flex-wrap gap-3 text-sm"
            >
              <MagneticLink
                href="https://alpaon.com"
                className="px-4 py-2 rounded-lg bg-card border border-border hover:border-foreground/30 transition-colors"
                strength={0.4}
                radius={120}
              >
                Alpaon
              </MagneticLink>
              <MagneticLink
                href="https://teamcandid.kr"
                className="px-4 py-2 rounded-lg bg-card border border-border hover:border-foreground/30 transition-colors"
                strength={0.4}
                radius={120}
              >
                Candid
              </MagneticLink>
              <MagneticLink
                href="https://github.com/kimjisub"
                className="px-4 py-2 rounded-lg bg-card border border-border hover:border-foreground/30 transition-colors"
                strength={0.4}
                radius={120}
              >
                GitHub
              </MagneticLink>
            </div>
          </SectionRevealItem>
        </SectionReveal>
      </div>
    </section>
  );
};
