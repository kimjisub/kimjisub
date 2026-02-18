'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

type AnnotationType = 'underline' | 'box' | 'circle' | 'highlight' | 'strike-through' | 'crossed-off' | 'bracket';

interface RoughHighlightProps {
  children: ReactNode;
  type?: AnnotationType;
  color?: string;
  animate?: boolean;
  animationDuration?: number;
  strokeWidth?: number;
  padding?: number | [number, number] | [number, number, number, number];
  multiline?: boolean;
  iterations?: number;
  brackets?: ('left' | 'right' | 'top' | 'bottom')[];
  show?: boolean;
  triggerOnView?: boolean;
  delay?: number;
  className?: string;
}

// CSS 기반 하이라이트 (rough-notation 대체)
// 장점: 항상 요소에 상대적 위치, 스크롤 문제 없음
export const RoughHighlight = ({
  children,
  type = 'highlight',
  color,
  animate = true,
  animationDuration = 800,
  strokeWidth = 2,
  padding = 2,
  show,
  triggerOnView = true,
  delay = 0,
  className = '',
}: RoughHighlightProps) => {
  const elementRef = useRef<HTMLSpanElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  // Intersection Observer for scroll trigger
  useEffect(() => {
    if (!triggerOnView || !elementRef.current) {
      setShouldShow(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3, rootMargin: '0px' }
    );

    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [triggerOnView]);

  // Delay 처리
  useEffect(() => {
    const visible = show !== undefined ? show : (triggerOnView ? isInView : true);
    if (visible) {
      const timer = setTimeout(() => setShouldShow(true), delay);
      return () => clearTimeout(timer);
    }
  }, [show, triggerOnView, isInView, delay]);

  // 타입별 스타일 생성
  const getStyles = () => {
    const finalColor = color || 'rgba(255, 215, 0, 0.35)';
    const duration = animationDuration / 1000;
    const padValue = typeof padding === 'number' ? padding : padding[0];

    switch (type) {
      case 'highlight':
        return {
          wrapper: 'relative inline',
          decoration: `absolute inset-0 -mx-1 -my-0.5 rounded-sm pointer-events-none`,
          initial: { scaleX: 0, originX: 0 },
          animate: shouldShow ? { scaleX: 1 } : { scaleX: 0 },
          style: { backgroundColor: finalColor },
          transition: { duration, ease: 'easeOut' as const },
        };
      
      case 'underline':
        return {
          wrapper: 'relative inline',
          decoration: `absolute bottom-0 left-0 right-0 pointer-events-none`,
          initial: { scaleX: 0, originX: 0 },
          animate: shouldShow ? { scaleX: 1 } : { scaleX: 0 },
          style: { 
            height: `${strokeWidth}px`, 
            backgroundColor: finalColor,
            bottom: '-2px',
          },
          transition: { duration, ease: 'easeOut' as const },
        };
      
      case 'box':
        return {
          wrapper: 'relative inline',
          decoration: `absolute inset-0 pointer-events-none rounded-sm`,
          initial: { opacity: 0, scale: 0.95 },
          animate: shouldShow ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 },
          style: { 
            border: `${strokeWidth}px solid ${finalColor}`,
            margin: `-${padValue}px`,
            padding: `${padValue}px`,
          },
          transition: { duration, ease: 'easeOut' as const },
        };
      
      case 'circle':
        return {
          wrapper: 'relative inline',
          decoration: `absolute inset-0 pointer-events-none`,
          initial: { opacity: 0, scale: 0.8 },
          animate: shouldShow ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 },
          style: { 
            border: `${strokeWidth}px solid ${finalColor}`,
            borderRadius: '50%',
            margin: `-${padValue + 4}px -${padValue + 8}px`,
            padding: `${padValue + 4}px ${padValue + 8}px`,
          },
          transition: { duration, ease: 'easeOut' as const },
        };
      
      case 'strike-through':
      case 'crossed-off':
        return {
          wrapper: 'relative inline',
          decoration: `absolute top-1/2 left-0 right-0 pointer-events-none`,
          initial: { scaleX: 0, originX: 0 },
          animate: shouldShow ? { scaleX: 1 } : { scaleX: 0 },
          style: { 
            height: `${strokeWidth}px`, 
            backgroundColor: finalColor,
            transform: 'translateY(-50%)',
          },
          transition: { duration, ease: 'easeOut' as const },
        };
      
      default:
        return {
          wrapper: 'relative inline',
          decoration: '',
          initial: {},
          animate: {},
          style: {},
          transition: { duration, ease: 'easeOut' as const },
        };
    }
  };

  const styles = getStyles();

  return (
    <span ref={elementRef} className={`${styles.wrapper} ${className}`}>
      <span className="relative z-10">{children}</span>
      {animate ? (
        <motion.span
          className={styles.decoration}
          style={styles.style}
          initial={styles.initial}
          animate={styles.animate}
          transition={styles.transition}
        />
      ) : (
        shouldShow && (
          <span 
            className={styles.decoration}
            style={styles.style}
          />
        )
      )}
    </span>
  );
};

export default RoughHighlight;
