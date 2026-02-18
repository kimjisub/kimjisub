'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { X, Send, CheckCircle } from 'lucide-react';

interface Testimonial {
  id: string;
  authorName: string;
  authorTitle?: string;
  authorCompany?: string;
  authorUrl?: string;
  content: string;
  relationship?: string;
}

/* ─────────────────────────────────────────────
   Avatar — 이니셜 폴백
───────────────────────────────────────────── */
function Avatar({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

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
          &ldquo;{testimonial.content}&rdquo;
        </p>

        {/* Author */}
        <div className="flex items-center gap-4">
          <Avatar name={testimonial.authorName} />
          <div>
            <p className="font-semibold text-foreground text-sm leading-tight">
              {testimonial.authorName}
            </p>
            <p className="text-muted-foreground text-xs mt-0.5">
              {testimonial.authorTitle}
              {testimonial.authorCompany && (
                <>
                  {' '}
                  &middot;{' '}
                  {testimonial.authorUrl ? (
                    <a
                      href={testimonial.authorUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground transition-colors underline underline-offset-2"
                    >
                      {testimonial.authorCompany}
                    </a>
                  ) : (
                    testimonial.authorCompany
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
   TestimonialForm Modal
───────────────────────────────────────────── */
function TestimonialFormModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    authorName: '',
    authorTitle: '',
    authorCompany: '',
    authorEmail: '',
    authorUrl: '',
    content: '',
    relationship: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          onClose();
          setSubmitted(false);
          setFormData({
            authorName: '',
            authorTitle: '',
            authorCompany: '',
            authorEmail: '',
            authorUrl: '',
            content: '',
            relationship: '',
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to submit testimonial:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-card border border-border rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-12 text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              감사합니다!
            </h3>
            <p className="text-muted-foreground">
              추천사가 제출되었습니다. 검토 후 게시됩니다.
            </p>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-semibold text-foreground mb-1">
              추천사 작성하기
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              김지섭과 함께 일한 경험을 공유해주세요.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    이름 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.authorName}
                    onChange={(e) =>
                      setFormData({ ...formData, authorName: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg 
                               text-foreground placeholder-muted-foreground
                               focus:outline-none focus:ring-2 focus:ring-accent/50"
                    placeholder="홍길동"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    이메일 (비공개)
                  </label>
                  <input
                    type="email"
                    value={formData.authorEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, authorEmail: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg 
                               text-foreground placeholder-muted-foreground
                               focus:outline-none focus:ring-2 focus:ring-accent/50"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    직함
                  </label>
                  <input
                    type="text"
                    value={formData.authorTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, authorTitle: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg 
                               text-foreground placeholder-muted-foreground
                               focus:outline-none focus:ring-2 focus:ring-accent/50"
                    placeholder="CTO"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    회사
                  </label>
                  <input
                    type="text"
                    value={formData.authorCompany}
                    onChange={(e) =>
                      setFormData({ ...formData, authorCompany: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg 
                               text-foreground placeholder-muted-foreground
                               focus:outline-none focus:ring-2 focus:ring-accent/50"
                    placeholder="Company Inc."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  링크 (LinkedIn 등)
                </label>
                <input
                  type="url"
                  value={formData.authorUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, authorUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg 
                             text-foreground placeholder-muted-foreground
                             focus:outline-none focus:ring-2 focus:ring-accent/50"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  어떤 관계로 알게 되셨나요?
                </label>
                <input
                  type="text"
                  value={formData.relationship}
                  onChange={(e) =>
                    setFormData({ ...formData, relationship: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg 
                             text-foreground placeholder-muted-foreground
                             focus:outline-none focus:ring-2 focus:ring-accent/50"
                  placeholder="전 직장 동료, 프로젝트 협업 등"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  추천사 *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg 
                             text-foreground placeholder-muted-foreground resize-none
                             focus:outline-none focus:ring-2 focus:ring-accent/50"
                  placeholder="김지섭과 함께 일한 경험, 인상 깊었던 점 등을 자유롭게 작성해주세요."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3 bg-accent text-accent-foreground 
                           rounded-lg font-medium hover:bg-accent/90 transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  '제출 중...'
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    제출하기
                  </>
                )}
              </button>

              <p className="text-xs text-muted-foreground text-center">
                작성해주신 추천사는 검토 후 포트폴리오에 게시됩니다.
              </p>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   TestimonialsSection (main export)
───────────────────────────────────────────── */
const AUTO_SLIDE_INTERVAL = 5000;

// Fallback testimonials (shown when DB is empty)
const fallbackTestimonials: Testimonial[] = [
  {
    id: 'fallback-1',
    authorName: '첫 번째 추천사를 기다리고 있어요',
    authorTitle: '',
    content: '김지섭과 함께 일한 경험이 있으시다면, 추천사를 작성해주세요!',
  },
];

export function TestimonialsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-120px' });

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch testimonials from DB
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('/api/testimonials');
        if (res.ok) {
          const data = await res.json();
          setTestimonials(data.length > 0 ? data : fallbackTestimonials);
        }
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);
        setTestimonials(fallbackTestimonials);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const total = testimonials.length;

  const go = useCallback(
    (next: number, dir: number) => {
      if (total === 0) return;
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
    if (paused || total <= 1) return;
    timerRef.current = setInterval(() => {
      goNext();
    }, AUTO_SLIDE_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, goNext, total]);

  if (loading) {
    return (
      <section className="py-12 md:py-24 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="animate-pulse">
            <div className="h-8 bg-foreground/10 rounded w-48 mb-10" />
            <div className="h-48 bg-foreground/5 rounded-2xl" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        ref={ref}
        className="py-12 md:py-24 border-t border-border"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        <div className="max-w-4xl mx-auto px-4 md:px-6">
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
            <button
              onClick={() => setShowForm(true)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
            >
              추천사 작성하기 →
            </button>
          </motion.div>

          {/* Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Card area */}
            <div className="relative overflow-hidden min-h-[240px] md:min-h-[220px]">
              <AnimatePresence mode="wait" custom={direction}>
                {testimonials[index] && (
                  <TestimonialCard
                    key={testimonials[index].id}
                    testimonial={testimonials[index]}
                    direction={direction}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Controls */}
            {total > 1 && (
              <div className="mt-6 flex items-center justify-between">
                {/* Dot indicators */}
                <div className="flex items-center gap-2" role="tablist" aria-label="추천글 목록">
                  {testimonials.map((t, i) => (
                    <button
                      key={t.id}
                      role="tab"
                      aria-selected={i === index}
                      aria-label={`${t.authorName} 추천글`}
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
            )}

            {/* Progress bar */}
            {!paused && total > 1 && (
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

      {/* Testimonial Form Modal */}
      <AnimatePresence>
        {showForm && (
          <TestimonialFormModal isOpen={showForm} onClose={() => setShowForm(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
