'use client';

import { useEffect, useRef, useState } from 'react';
import { animate,useInView, useMotionValue } from 'framer-motion';

interface AnimatedCounterProps {
  /** 목표 숫자 (예: 5000000) */
  value: number;
  /** 숫자 뒤에 붙을 접미사 (예: "만+", "%", "개") */
  suffix?: string;
  /** 애니메이션 지속 시간 (초, 기본값 2) */
  duration?: number;
  /** 추가 className */
  className?: string;
}

/**
 * 뷰포트 진입 시 0부터 목표값까지 카운트업하는 컴포넌트.
 * framer-motion useMotionValue + animate(easeOut) 사용.
 * 숫자는 천단위 콤마 포맷팅 적용.
 */
export function AnimatedCounter({
  value,
  suffix = '',
  duration = 2,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState('0');

  // 모션 값 변화 구독 → 표시 문자열 업데이트
  useEffect(() => {
    const unsubscribe = motionValue.on('change', (latest) => {
      setDisplay(Math.round(latest).toLocaleString());
    });
    return unsubscribe;
  }, [motionValue]);

  // 뷰포트 진입 시 애니메이션 시작
  useEffect(() => {
    if (isInView) {
      const controls = animate(motionValue, value, {
        duration,
        ease: 'easeOut',
      });
      return controls.stop;
    }
  }, [isInView, value, duration, motionValue]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}
