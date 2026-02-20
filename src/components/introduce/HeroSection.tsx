'use client';

import { useCallback,useState } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import Link from 'next/link';

import EasterEggs from '@/components/EasterEggs';
import { GradientText } from '@/components/GradientText';
import { MagneticLink } from '@/components/MagneticButton';
import { MeshGradientBackground } from '@/components/MeshGradientBackground';
import { ParallaxBackground } from '@/components/ParallaxBackground';
import { ParticleBackground } from '@/components/ParticleBackground';
import { RoughHighlight } from '@/components/RoughHighlight';
import { TiltImage } from '@/components/TiltImage';
import { TypewriterEffect } from '@/components/TypewriterEffect';

// ── Stagger Variants ──────────────────────────────────────
const heroContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const heroItemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// ── Component ─────────────────────────────────────────────
export const HeroSection = () => {
  const [clickCount, setClickCount] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const handleImageClick = useCallback(() => {
    const next = clickCount + 1;
    setClickCount(next);

    if (next === 3) {
      setShowHint(true);
      setTimeout(() => setShowHint(false), 2000);
    }
    if (next >= 10) {
      setTimeout(() => setClickCount(0), 5000);
    }
  }, [clickCount]);

  return (
    <section className="min-h-[85vh] flex items-center relative overflow-hidden">
      <EasterEggs clickCount={clickCount} />
      <MeshGradientBackground />
      <ParallaxBackground />
      <ParticleBackground />
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 py-24">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-[auto_1fr] items-start gap-6 md:gap-x-12 md:gap-y-0"
          variants={heroContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* ── Profile image (spans all text rows on desktop) ── */}
          <motion.div
            variants={heroItemVariants}
            className="relative w-32 h-32 md:w-40 md:h-40 shrink-0 md:row-span-4"
          >
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

            <div
              onClick={handleImageClick}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleImageClick(); } }}
              role="button"
              tabIndex={0}
              aria-label="김지섭 프로필 사진"
              className="cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 rounded-full"
            >
              <TiltImage
                src="/logo192.png"
                alt=""
                width={160}
                height={160}
                priority
              />
            </div>
          </motion.div>

          {/* ── Name ── */}
          <motion.div variants={heroItemVariants}>
            <h1 className="text-4xl md:text-5xl font-medium mb-4 tracking-tight">
              <GradientText duration={5}>
                김지섭
              </GradientText>
            </h1>
          </motion.div>

          {/* ── Role (typewriter) ── */}
          <motion.div variants={heroItemVariants}>
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
          </motion.div>

          {/* ── Description ── */}
          <motion.div variants={heroItemVariants}>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed max-w-xl">
              <Link href="https://alpaon.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                <RoughHighlight type="box" delay={600} animationDuration={600} strokeWidth={1.5} padding={3}>
                  Alpaon
                </RoughHighlight>
              </Link>{' '}
              CTO.{' '}
              <Link href="https://teamcandid.kr" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                <RoughHighlight type="underline" delay={800} animationDuration={600}>
                  Candid
                </RoughHighlight>
              </Link>{' '}
              <RoughHighlight type="highlight" delay={1000} animationDuration={800}>
                Product Engineer
              </RoughHighlight>.<br />
              소프트웨어부터 펌웨어, 인프라까지 직접 만들고 운영합니다.
            </p>
          </motion.div>

          {/* ── Links ── */}
          <motion.div variants={heroItemVariants}>
            <div className="flex flex-wrap gap-3 text-sm">
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
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
