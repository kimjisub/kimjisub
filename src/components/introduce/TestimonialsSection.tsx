'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';

import { type Testimonial,testimonials } from '@/data/testimonials';

/* ─────────────────────────────────────────────
   Avatar — 이미지 없으면 이니셜 폴백
───────────────────────────────────────────── */
function Avatar({ testimonial }: { testimonial: Testimonial }) {
  const initials = testimonial.name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (testimonial.avatar) {
    return (
      
      <img
        src={testimonial.avatar}
        alt={testimonial.name}
        className="w-12 h-12 rounded-full object-cover ring-2 ring-border"
      />
    );
  }

  return (
    <div className="w-12 h-12 rounded-full bg-foreground/10 ring-2 ring-border flex items-center justify-center select-none">
      <span className="text-sm font-semibold text-foreground/70">{initials}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   QuoteIcon
───────────────────────────────────────────── */
function QuoteIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 34c-3.31 0-6-2.69-6-6V14h12v14h-6zm24 0c-3.31 0-6-2.69-6-6V14h12v14h-6z" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   TestimonialCard
───────────────────────────────────────────── */
const cardVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 80 : -80,
    opacity: 0,
    scale: 0.96,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -80 : 80,
    opacity: 0,
    scale: 0.96,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
};

function TestimonialCard({
  testimonial,
  direction,
}: {
  testimonial: Testimonial;
  direction: number;
}) {
  return (
    <motion.div
      key={testimonial.id}
      custom={direction}
      variants={cardVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="w-full"
    >
      <div className="relative rounded-2xl border border-border bg-card p-8 md:p-10 shadow-sm">
        {/* Decorative quote mark */}
        <QuoteIcon className="absolute top-6 right-8 w-10 h-10 text-foreground/5 pointer-events-none" />

        {/* Quote */}
        <p className="text-base md:text-lg leading-relaxed text-foreground/80 mb-8 relative z-10">
          &ldquo;{testimonial.quote}&rdquo;
        </p>

        {/* Author */}
        <div className="flex items-center gap-4">
          <Avatar testimonial={testimonial} />
          <div>
            <p className="font-semibold text-foreground text-sm leading-tight">
              {testimonial.name}
            </p>
            <p className="text-muted-foreground text-xs mt-0.5">
              {testimonial.role}
              {testimonial.company && (
                <>
                  {' '}
                  &middot;{' '}
                  {testimonial.url ? (
                    <a
                      href={testimonial.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground transition-colors underline underline-offset-2"
                    >
                      {testimonial.company}
                    </a>
                  ) : (
                    testimonial.company
                  )}
                </>
              )}
            </p>
            {testimonial.relationship && (
              <p className="text-muted-foreground/60 text-[11px] mt-0.5 italic">
                {testimonial.relationship}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   NavigationButton
───────────────────────────────────────────── */
function NavButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      onClick={onClick}
      aria-label={label}
      className="w-10 h-10 rounded-full border border-border bg-card hover:bg-foreground/5 flex items-center justify-center text-foreground/60 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
    >
      {children}
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   TestimonialsSection (main export)
───────────────────────────────────────────── */
const AUTO_SLIDE_INTERVAL = 5000;

export function TestimonialsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-120px' });

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = testimonials.length;

  const go = useCallback(
    (next: number, dir: number) => {
      setDirection(dir);
      setIndex(((next % total) + total) % total);
    },
    [total],
  );

  const goNext = useCallback(() => go(index + 1, 1), [go, index]);
  const goPrev = useCallback(() => go(index - 1, -1), [go, index]);
  const goTo = useCallback(
    (i: number) => {
      if (i === index) return;
      go(i, i > index ? 1 : -1);
    },
    [go, index],
  );

  /* Auto-slide */
  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      goNext();
    }, AUTO_SLIDE_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, goNext]);

  return (
    <section
      ref={ref}
      className="py-24 border-t border-border"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div className="max-w-4xl mx-auto px-6">
        {/* Heading */}
        <motion.h2
          className="font-serif text-2xl md:text-3xl text-foreground mb-2 italic"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Testimonials
        </motion.h2>
        <motion.div
          className="flex items-center justify-between mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p className="text-muted-foreground text-sm">
            함께 일한 분들의 이야기
          </p>
          <a
            href="mailto:0226daniel@gmail.com?subject=[추천사] 김지섭과 함께 일한 경험&body=안녕하세요!%0A%0A김지섭과 함께 일한 경험을 공유해주세요.%0A%0A---%0A이름:%0A직함/회사:%0A추천사 내용:%0A%0A(작성해주신 추천사는 포트폴리오에 게시될 수 있습니다)"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
          >
            추천사 작성하기 →
          </a>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Card area — fixed min-height prevents layout shift */}
          <div className="relative overflow-hidden min-h-[240px] md:min-h-[220px]">
            <AnimatePresence mode="wait" custom={direction}>
              <TestimonialCard
                key={testimonials[index].id}
                testimonial={testimonials[index]}
                direction={direction}
              />
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center justify-between">
            {/* Dot indicators */}
            <div className="flex items-center gap-2" role="tablist" aria-label="추천글 목록">
              {testimonials.map((t, i) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`${t.name} 추천글`}
                  onClick={() => goTo(i)}
                  className={`rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 ${
                    i === index
                      ? 'w-5 h-2 bg-foreground'
                      : 'w-2 h-2 bg-foreground/25 hover:bg-foreground/50'
                  }`}
                />
              ))}
            </div>

            {/* Prev / Next */}
            <div className="flex items-center gap-2">
              <NavButton onClick={goPrev} label="이전 추천글">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </NavButton>
              <NavButton onClick={goNext} label="다음 추천글">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </NavButton>
            </div>
          </div>

          {/* Progress bar */}
          {!paused && (
            <div className="mt-4 h-px bg-border overflow-hidden rounded-full">
              <motion.div
                key={`progress-${index}`}
                className="h-full bg-foreground/30 origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: AUTO_SLIDE_INTERVAL / 1000,
                  ease: 'linear',
                }}
              />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
