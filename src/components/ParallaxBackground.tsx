'use client';

import { memo } from 'react';
import { motion, type MotionValue,useScroll, useTransform } from 'framer-motion';

/**
 * Scroll-Linked Parallax Background
 *
 * 3개 레이어가 스크롤에 따라 다른 속도로 움직이며 시각적 깊이감을 만듭니다.
 *
 * 레이어 속도 (apparent scroll speed):
 *   - Layer 1 (0.2x) : 느린 배경 → translateY = scrollY * 0.8 (거의 고정)
 *   - Layer 2 (0.5x) : 중간       → translateY = scrollY * 0.5
 *   - Layer 3 (0.8x) : 빠른 전경  → translateY = scrollY * 0.2
 *
 * 수식: translateY = scrollY * (1 - speed)
 *   → 섹션이 1x 속도로 위로 스크롤될 때, 레이어는 (speed)x 속도로만 올라가도록 보정
 *
 * 성능 최적화:
 *   - will-change: transform (GPU 레이어 승격)
 *   - framer-motion MotionValue (React 리렌더 없이 CSS 직접 업데이트)
 *   - memo() 로 불필요한 재렌더 차단
 */

// ── Parallax Layer ────────────────────────────────────────

interface ParallaxLayerProps {
  y: MotionValue<number>;
  children: React.ReactNode;
  className?: string;
}

const ParallaxLayer = memo(function ParallaxLayer({
  y,
  children,
  className = '',
}: ParallaxLayerProps) {
  return (
    <motion.div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        y,
        willChange: 'transform',
        translateZ: 0, // GPU 가속 트리거
      }}
    >
      {children}
    </motion.div>
  );
});

// ── Dot Grid Helper ───────────────────────────────────────

const DotGrid = memo(function DotGrid({
  cols,
  rows,
  gap,
  r,
  className,
}: {
  cols: number;
  rows: number;
  gap: number;
  r: number;
  className?: string;
}) {
  const w = cols * gap;
  const h = rows * gap;
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      {Array.from({ length: cols * rows }).map((_, i) => (
        <circle
          key={i}
          cx={(i % cols) * gap + gap / 2}
          cy={Math.floor(i / cols) * gap + gap / 2}
          r={r}
        />
      ))}
    </svg>
  );
});

// ── Cross / Plus sign ─────────────────────────────────────

interface CrossProps {
  style?: React.CSSProperties;
  size?: number;
  className?: string;
}

const Cross = memo(function Cross({ style, size = 12, className = '' }: CrossProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className={`absolute ${className}`}
      style={style}
      aria-hidden="true"
    >
      <line x1="6" y1="0" x2="6" y2="12" />
      <line x1="0" y1="6" x2="12" y2="6" />
    </svg>
  );
});

// ── Main Component ────────────────────────────────────────

export const ParallaxBackground = memo(function ParallaxBackground() {
  const { scrollY } = useScroll();

  // translare Y = scrollY * (1 - apparentSpeed)
  // 섹션이 1x 속도로 사라질 때 레이어가 apparentSpeed 만큼만 올라감
  const yLayer1 = useTransform(scrollY, (v) => v * (1 - 0.2)); // 느린 배경
  const yLayer2 = useTransform(scrollY, (v) => v * (1 - 0.5)); // 중간
  const yLayer3 = useTransform(scrollY, (v) => v * (1 - 0.8)); // 빠른 전경

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* ── Layer 1: 느린 배경 (0.2x) — 대형 동심원 링 ── */}
      <ParallaxLayer y={yLayer1}>
        {/* 좌상단 대형 링 */}
        <svg
          className="absolute -top-[15%] -left-[8%] w-[65%] h-[65%] text-foreground opacity-[0.045] dark:opacity-[0.06]"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="200" cy="200" r="190" stroke="currentColor" strokeWidth="0.8" />
          <circle cx="200" cy="200" r="148" stroke="currentColor" strokeWidth="0.6" />
          <circle cx="200" cy="200" r="106" stroke="currentColor" strokeWidth="0.4" />
          <circle cx="200" cy="200" r="64" stroke="currentColor" strokeWidth="0.4" />
        </svg>

        {/* 우하단 대형 링 */}
        <svg
          className="absolute -bottom-[25%] -right-[12%] w-[58%] h-[58%] text-foreground opacity-[0.04] dark:opacity-[0.05]"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="200" cy="200" r="190" stroke="currentColor" strokeWidth="0.8" />
          <circle cx="200" cy="200" r="130" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="200" cy="200" r="70" stroke="currentColor" strokeWidth="0.4" />
        </svg>

        {/* 중앙 대형 헥사곤 */}
        <svg
          className="absolute top-[30%] left-[40%] w-[30%] h-[30%] text-foreground opacity-[0.03] dark:opacity-[0.04]"
          viewBox="0 0 200 200"
          fill="none"
        >
          <polygon
            points="100,10 185,55 185,145 100,190 15,145 15,55"
            stroke="currentColor"
            strokeWidth="0.8"
          />
          <polygon
            points="100,35 165,68 165,132 100,165 35,132 35,68"
            stroke="currentColor"
            strokeWidth="0.5"
          />
        </svg>
      </ParallaxLayer>

      {/* ── Layer 2: 중간 (0.5x) — 기하학적 도형 + 점 격자 ── */}
      <ParallaxLayer y={yLayer2}>
        {/* 우상단 점 격자 */}
        <DotGrid
          cols={8}
          rows={6}
          gap={22}
          r={1.2}
          className="absolute top-[8%] right-[6%] text-foreground opacity-[0.09] dark:opacity-[0.12]"
        />

        {/* 좌하단 점 격자 */}
        <DotGrid
          cols={6}
          rows={8}
          gap={20}
          r={1.0}
          className="absolute bottom-[12%] left-[5%] text-foreground opacity-[0.07] dark:opacity-[0.10]"
        />

        {/* 삼각형 */}
        <svg
          className="absolute top-[55%] left-[12%] w-16 h-16 text-foreground opacity-[0.07] dark:opacity-[0.09]"
          viewBox="0 0 100 100"
          fill="none"
        >
          <polygon
            points="50,5 95,90 5,90"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <polygon
            points="50,28 78,80 22,80"
            stroke="currentColor"
            strokeWidth="0.75"
            strokeLinejoin="round"
          />
        </svg>

        {/* 점선 원 */}
        <svg
          className="absolute top-[18%] left-[38%] w-12 h-12 text-foreground opacity-[0.08] dark:opacity-[0.11]"
          viewBox="0 0 60 60"
          fill="none"
        >
          <circle
            cx="30"
            cy="30"
            r="26"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="4 5"
          />
        </svg>

        {/* 작은 사각형 회전 */}
        <svg
          className="absolute top-[72%] right-[18%] w-10 h-10 text-foreground opacity-[0.07] dark:opacity-[0.09]"
          viewBox="0 0 50 50"
          fill="none"
        >
          <rect
            x="8"
            y="8"
            width="34"
            height="34"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.2"
            transform="rotate(22 25 25)"
          />
          <rect
            x="14"
            y="14"
            width="22"
            height="22"
            rx="1"
            stroke="currentColor"
            strokeWidth="0.7"
            transform="rotate(22 25 25)"
          />
        </svg>
      </ParallaxLayer>

      {/* ── Layer 3: 빠른 전경 (0.8x) — 산재된 작은 요소들 ── */}
      <ParallaxLayer y={yLayer3}>
        {/* 크로스 마크들 */}
        <Cross style={{ top: '12%', left: '9%' }} size={11} className="text-foreground opacity-[0.13] dark:opacity-[0.18]" />
        <Cross style={{ top: '38%', right: '9%' }} size={9} className="text-foreground opacity-[0.11] dark:opacity-[0.15]" />
        <Cross style={{ top: '62%', left: '22%' }} size={13} className="text-foreground opacity-[0.10] dark:opacity-[0.14]" />
        <Cross style={{ top: '82%', right: '22%' }} size={10} className="text-foreground opacity-[0.12] dark:opacity-[0.16]" />
        <Cross style={{ top: '28%', left: '52%' }} size={8} className="text-foreground opacity-[0.09] dark:opacity-[0.12]" />
        <Cross style={{ top: '50%', right: '35%' }} size={12} className="text-foreground opacity-[0.08] dark:opacity-[0.11]" />

        {/* 작은 원형 점들 */}
        {[
          { top: '22%', left: '44%' },
          { top: '68%', left: '62%' },
          { top: '42%', left: '78%' },
          { top: '8%', left: '72%' },
          { top: '88%', left: '38%' },
          { top: '55%', left: '88%' },
          { top: '75%', left: '10%' },
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-foreground opacity-[0.10] dark:opacity-[0.14]"
            style={{ top: pos.top, left: pos.left }}
          />
        ))}

        {/* 소형 다이아몬드 */}
        <svg
          className="absolute top-[48%] left-[6%] w-5 h-5 text-foreground opacity-[0.10] dark:opacity-[0.14]"
          viewBox="0 0 20 20"
          fill="none"
        >
          <rect
            x="3"
            y="3"
            width="14"
            height="14"
            stroke="currentColor"
            strokeWidth="1.2"
            transform="rotate(45 10 10)"
          />
        </svg>

        <svg
          className="absolute top-[18%] right-[28%] w-4 h-4 text-foreground opacity-[0.09] dark:opacity-[0.13]"
          viewBox="0 0 20 20"
          fill="none"
        >
          <rect
            x="3"
            y="3"
            width="14"
            height="14"
            stroke="currentColor"
            strokeWidth="1.2"
            transform="rotate(45 10 10)"
          />
        </svg>
      </ParallaxLayer>
    </div>
  );
});
