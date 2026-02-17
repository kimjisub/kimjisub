'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';

interface Section {
  id: string;
  label: string;
}

const sections: Section[] = [
  { id: 'hero', label: 'Hero' },
  { id: 'about', label: 'About' },
  { id: 'terminal', label: 'Terminal' },
  { id: 'work', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'blog', label: 'Blog' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'contact', label: 'Contact' },
];

const ScrollProgressIndicator: React.FC = () => {
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isVisible, setIsVisible] = useState(false);

  // Show after scrolling 60px
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver to detect active section
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        {
          rootMargin: '-40% 0px -40% 0px',
          threshold: 0,
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const currentSection = sections.find((s) => s.id === activeSection);

  return (
    <>
      {/* Scroll progress bar — sits above TopBar (z-50) */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] z-[60] origin-left"
        style={{
          scaleX,
          background:
            'linear-gradient(90deg, var(--accent) 0%, color-mix(in srgb, var(--accent) 70%, white) 50%, var(--accent) 100%)',
        }}
      />

      {/* Glow layer */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] z-[60] origin-left blur-[4px] opacity-60"
        style={{
          scaleX,
          background: 'var(--accent)',
        }}
      />

      {/* Section label pill — top-right, fades in after scrolling */}
      <motion.div
        className="fixed top-2 right-3 z-[61] pointer-events-none"
        initial={false}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -6 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <AnimatePresence mode="wait">
          {currentSection && (
            <motion.span
              key={currentSection.id}
              className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full border"
              style={{
                background: 'hsl(var(--background) / 0.85)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                borderColor: 'var(--accent)',
                color: 'var(--accent)',
              }}
              initial={{ opacity: 0, scale: 0.85, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 4 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {/* Accent dot */}
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: 'var(--accent)' }}
              />
              {currentSection.label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default ScrollProgressIndicator;
