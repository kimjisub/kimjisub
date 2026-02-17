'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Section {
  id: string;
  label: string;
}

const sections: Section[] = [
  { id: 'hero', label: 'Hero' },
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'blog', label: 'Blog' },
  { id: 'contact', label: 'Contact' },
];

export default function ScrollSpyNav() {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

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
          // Trigger when section crosses the vertical center of viewport
          rootMargin: '-50% 0px -50% 0px',
          threshold: 0,
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav
      className="fixed right-5 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-4 z-50 lg:right-8"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.2, duration: 0.5 }}
      aria-label="Section navigation"
    >
      {sections.map(({ id, label }) => {
        const isActive = activeSection === id;
        const isHovered = hoveredSection === id;

        return (
          <div
            key={id}
            className="relative flex items-center justify-end"
            onMouseEnter={() => setHoveredSection(id)}
            onMouseLeave={() => setHoveredSection(null)}
          >
            {/* Tooltip label */}
            <motion.span
              className="absolute right-7 text-xs text-muted-foreground whitespace-nowrap bg-background/90 border border-border px-2 py-1 rounded-md pointer-events-none select-none"
              initial={{ opacity: 0, x: 4 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                x: isHovered ? 0 : 4,
              }}
              transition={{ duration: 0.15 }}
              aria-hidden
            >
              {label}
            </motion.span>

            {/* Dot button */}
            <button
              onClick={() => scrollTo(id)}
              aria-label={`${label} 섹션으로 이동`}
              className="relative flex items-center justify-center w-5 h-5 cursor-pointer"
            >
              {/* Active ring indicator */}
              {isActive && (
                <motion.div
                  layoutId="scroll-spy-ring"
                  className="absolute rounded-full border border-foreground/50"
                  style={{ width: 16, height: 16 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}

              {/* Dot */}
              <motion.div
                className={`rounded-full transition-colors duration-300 ${
                  isActive
                    ? 'bg-foreground'
                    : 'bg-muted-foreground/40 hover:bg-muted-foreground/70'
                }`}
                animate={{
                  width: isActive ? 8 : 6,
                  height: isActive ? 8 : 6,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            </button>
          </div>
        );
      })}
    </motion.nav>
  );
}
