'use client';

import { useEffect,useState } from 'react';
import { motion } from 'framer-motion';

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

export default function ScrollSpyNav() {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isHoveringNav, setIsHoveringNav] = useState(false);

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
      className="fixed right-5 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-end gap-3 z-50 lg:right-8"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.2, duration: 0.5 }}
      aria-label="Section navigation"
      onMouseEnter={() => setIsHoveringNav(true)}
      onMouseLeave={() => setIsHoveringNav(false)}
    >
      {sections.map(({ id, label }) => {
        const isActive = activeSection === id;

        return (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            aria-label={`${label} 섹션으로 이동`}
            className="relative flex items-center gap-2 group cursor-pointer"
          >
            {/* Label - 항상 보이지만 hover 시 더 진해짐 */}
            <motion.span
              className="text-xs whitespace-nowrap select-none transition-colors duration-200"
              animate={{
                opacity: isHoveringNav ? 1 : (isActive ? 0.7 : 0),
                x: isHoveringNav ? 0 : 8,
              }}
              style={{
                color: isActive ? 'var(--foreground)' : 'var(--muted-foreground)',
              }}
              transition={{ duration: 0.2 }}
            >
              {label}
            </motion.span>

            {/* Dot */}
            <div className="relative flex items-center justify-center w-5 h-5">
              {/* Active ring indicator */}
              {isActive && (
                <motion.div
                  layoutId="scroll-spy-ring"
                  className="absolute rounded-full border border-foreground/50"
                  style={{ width: 16, height: 16 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}

              {/* Dot - 비활성화도 보이도록 opacity 높임 */}
              <motion.div
                className={`rounded-full transition-colors duration-300 ${
                  isActive
                    ? 'bg-foreground'
                    : 'bg-muted-foreground/60 group-hover:bg-muted-foreground'
                }`}
                animate={{
                  width: isActive ? 8 : 6,
                  height: isActive ? 8 : 6,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            </div>
          </button>
        );
      })}
    </motion.nav>
  );
}
