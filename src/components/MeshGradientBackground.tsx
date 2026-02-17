'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';

/**
 * Animated Mesh Gradient Background
 *
 * 여러 개의 radial-gradient "노드"를 framer-motion으로 천천히 움직여
 * 부드러운 mesh gradient 효과를 만듭니다.
 *
 * - GPU 가속: will-change: transform + translate(x, y) 애니메이션
 * - 다크/라이트 모드: CSS 변수 --mesh-color-1~4 로 테마 대응
 * - blur + low opacity로 가독성 유지
 */

interface NodeConfig {
  id: number;
  /** CSS variable or hex color */
  color: string;
  /** Diameter in px */
  size: number;
  /** Gaussian blur in px */
  blur: number;
  /** Base opacity (0–1) */
  opacity: number;
  /** Initial position as % from left */
  initialLeft: string;
  /** Initial position as % from top */
  initialTop: string;
  /** x-axis keyframes (px offsets) */
  animX: number[];
  /** y-axis keyframes (px offsets) */
  animY: number[];
  /** Animation duration in seconds */
  duration: number;
  /** Animation delay in seconds */
  delay: number;
}

const NODES: NodeConfig[] = [
  {
    id: 1,
    color: 'var(--mesh-color-1)',
    size: 700,
    blur: 130,
    opacity: 0.45,
    initialLeft: '15%',
    initialTop: '15%',
    animX: [0, 70, -40, 50, -20, 0],
    animY: [0, -60, 80, -30, 50, 0],
    duration: 22,
    delay: 0,
  },
  {
    id: 2,
    color: 'var(--mesh-color-2)',
    size: 580,
    blur: 110,
    opacity: 0.4,
    initialLeft: '75%',
    initialTop: '25%',
    animX: [0, -60, 50, -70, 30, 0],
    animY: [0, 80, -50, 60, -40, 0],
    duration: 26,
    delay: 4,
  },
  {
    id: 3,
    color: 'var(--mesh-color-3)',
    size: 520,
    blur: 100,
    opacity: 0.38,
    initialLeft: '45%',
    initialTop: '65%',
    animX: [0, 50, -70, 40, -30, 0],
    animY: [0, -70, -20, 60, -50, 0],
    duration: 30,
    delay: 8,
  },
  {
    id: 4,
    color: 'var(--mesh-color-4)',
    size: 480,
    blur: 90,
    opacity: 0.35,
    initialLeft: '85%',
    initialTop: '75%',
    animX: [0, -40, 60, -50, 20, 0],
    animY: [0, -60, -30, 70, -40, 0],
    duration: 28,
    delay: 12,
  },
];

const TIMES = [0, 0.2, 0.4, 0.6, 0.8, 1];

const GradientNode = memo(function GradientNode({ node }: { node: NodeConfig }) {
  return (
    <motion.div
      aria-hidden="true"
      className="absolute rounded-full pointer-events-none"
      style={{
        width: node.size,
        height: node.size,
        left: node.initialLeft,
        top: node.initialTop,
        // Center the blob on its anchor point using negative margin
        marginLeft: -node.size / 2,
        marginTop: -node.size / 2,
        background: `radial-gradient(circle at center, ${node.color} 0%, transparent 70%)`,
        filter: `blur(${node.blur}px)`,
        willChange: 'transform',
        opacity: node.opacity,
      }}
      animate={{
        x: node.animX,
        y: node.animY,
      }}
      transition={{
        duration: node.duration,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut',
        delay: node.delay,
        times: TIMES,
      }}
    />
  );
});

export const MeshGradientBackground = memo(function MeshGradientBackground() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {NODES.map((node) => (
        <GradientNode key={node.id} node={node} />
      ))}
    </div>
  );
});
