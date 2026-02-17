'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef, useEffect } from 'react';

interface TiltImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export const TiltImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
}: TiltImageProps) => {
  const ref = useRef<HTMLDivElement>(null);

  // Raw position: -0.5 to 0.5 (mouse viewport-relative or gyroscope)
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Spring config — natural, slightly weighted feel
  const springConfig = { damping: 28, stiffness: 180, mass: 0.6 };

  // Apply spring smoothing to raw input
  const springX = useSpring(rawX, springConfig);
  const springY = useSpring(rawY, springConfig);

  // Map spring values → rotation angles (±12°)
  const rotateX = useTransform(springY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-12, 12]);

  // Hover scale
  const scaleValue = useSpring(1, { damping: 20, stiffness: 300 });

  // Dynamic shadow — deepens on hover
  const boxShadow = useTransform(
    scaleValue,
    [1, 1.05],
    [
      '0 4px 6px -1px rgba(0,0,0,0.12), 0 2px 4px -2px rgba(0,0,0,0.08)',
      '0 24px 32px -8px rgba(0,0,0,0.22), 0 10px 12px -6px rgba(0,0,0,0.12)',
    ]
  );

  useEffect(() => {
    const isMobile =
      typeof window !== 'undefined' &&
      window.matchMedia('(pointer: coarse)').matches;

    if (isMobile) {
      // ── Gyroscope (Android / iOS non-permission) ──────────────────
      const handleOrientation = (e: DeviceOrientationEvent) => {
        // gamma: left-right tilt (-90 ~ 90)
        // beta:  front-back tilt (-180 ~ 180); ~45° when held naturally
        const gamma = e.gamma ?? 0;
        const beta = e.beta ?? 0;

        rawX.set(Math.max(-0.5, Math.min(0.5, gamma / 60)));
        rawY.set(Math.max(-0.5, Math.min(0.5, (beta - 45) / 60)));
      };

      // iOS 13+ requires explicit permission; skip auto-request here.
      // Non-iOS devices fire the event without permission.
      const DevOrient = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<string>;
      };

      if (typeof DevOrient.requestPermission === 'function') {
        // Permission-gated (iOS 13+): silently skip; tilt is disabled.
        return;
      }

      window.addEventListener('deviceorientation', handleOrientation);
      return () => window.removeEventListener('deviceorientation', handleOrientation);
    } else {
      // ── Global mouse tracking ─────────────────────────────────────
      const handleMouseMove = (e: MouseEvent) => {
        rawX.set(e.clientX / window.innerWidth - 0.5);
        rawY.set(e.clientY / window.innerHeight - 0.5);
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [rawX, rawY]);

  return (
    <motion.div
      ref={ref}
      onMouseEnter={() => scaleValue.set(1.05)}
      onMouseLeave={() => scaleValue.set(1)}
      style={{
        rotateX,
        rotateY,
        scale: scaleValue,
        transformStyle: 'preserve-3d',
        perspective: 800,
      }}
      className="cursor-pointer"
    >
      <motion.div
        style={{ boxShadow }}
        className={`rounded-2xl overflow-hidden ring-1 ring-border ${className}`}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-full object-cover"
          priority={priority}
        />
      </motion.div>
    </motion.div>
  );
};
