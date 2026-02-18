'use client';

import React, { useCallback, useEffect,useRef, useState } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;       // 최대 기울기 각도 (deg), 기본 12
  perspective?: number;   // perspective (px), 기본 1000
  glareOpacity?: number;  // glare 최대 불투명도 (0~1), 기본 0.25
  scale?: number;         // hover 시 scale, 기본 1.03
}

export const TiltCard = ({
  children,
  className,
  maxTilt = 12,
  perspective = 1000,
  glareOpacity = 0.25,
  scale = 1.03,
}: TiltCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const rafRef = useRef<number | null>(null);

  // 터치 디바이스 감지
  useEffect(() => {
    setIsTouchDevice(
      typeof window !== 'undefined' &&
        ('ontouchstart' in window || navigator.maxTouchPoints > 0),
    );
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isTouchDevice || !cardRef.current) return;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();

        // 0~1 범위의 상대 위치
        const relX = (e.clientX - rect.left) / rect.width;
        const relY = (e.clientY - rect.top) / rect.height;

        // -maxTilt ~ +maxTilt 범위로 변환
        // rotateY: 오른쪽 → 양수, rotateX: 위쪽 → 양수 (반전)
        const rotateY = (relX - 0.5) * 2 * maxTilt;
        const rotateX = -(relY - 0.5) * 2 * maxTilt;

        setTilt({ x: rotateX, y: rotateY });

        // glare: 빛이 오는 방향 (마우스 기준 반대 방향 발광)
        setGlare({
          x: relX * 100,
          y: relY * 100,
          opacity: glareOpacity,
        });
      });
    },
    [isTouchDevice, maxTilt, glareOpacity],
  );

  const handleMouseEnter = useCallback(() => {
    if (isTouchDevice) return;
    setIsHovered(true);
  }, [isTouchDevice]);

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setGlare(prev => ({ ...prev, opacity: 0 }));
  }, []);

  if (isTouchDevice) {
    // 터치 디바이스에서는 wrapper 없이 그냥 렌더링
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      style={{ perspective: `${perspective}px` }}
      className={className}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isHovered
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${scale})`
            : 'rotateX(0deg) rotateY(0deg) scale(1)',
          transition: 'transform 0.1s ease-out',
          transformStyle: 'preserve-3d',
          position: 'relative',
          willChange: 'transform',
        }}
      >
        {children}

        {/* Glare 오버레이 */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            zIndex: 10,
            background: `radial-gradient(
              circle at ${glare.x}% ${glare.y}%,
              rgba(255,255,255,${glare.opacity}) 0%,
              rgba(255,255,255,0) 60%
            )`,
            transition: 'opacity 0.1s ease-out',
            mixBlendMode: 'overlay',
          }}
        />
      </div>
    </div>
  );
};
