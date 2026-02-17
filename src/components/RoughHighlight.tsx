'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import { annotate } from 'rough-notation';
import { useTheme } from 'next-themes';

// rough-notation 타입 정의
interface RoughAnnotation {
  isShowing(): boolean;
  show(): void;
  hide(): void;
  remove(): void;
}

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

export const RoughHighlight = ({
  children,
  type = 'highlight',
  color,
  animate = true,
  animationDuration = 800,
  strokeWidth = 2,
  padding = 2,
  multiline = true,
  iterations = 2,
  brackets = ['left', 'right'],
  show,
  triggerOnView = true,
  delay = 0,
  className = '',
}: RoughHighlightProps) => {
  const elementRef = useRef<HTMLSpanElement>(null);
  const annotationRef = useRef<RoughAnnotation | null>(null);
  const [isInView, setIsInView] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 테마별 기본 색상
  const getDefaultColor = () => {
    if (type === 'highlight') {
      return resolvedTheme === 'dark' 
        ? 'rgba(255, 215, 0, 0.3)' // 골드 (다크모드)
        : 'rgba(255, 215, 0, 0.4)'; // 골드 (라이트모드)
    }
    return resolvedTheme === 'dark' 
      ? 'rgba(147, 197, 253, 0.8)' // 밝은 파랑 (다크모드)
      : 'rgba(59, 130, 246, 0.8)'; // 파랑 (라이트모드)
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Intersection Observer for scroll trigger
  useEffect(() => {
    if (!triggerOnView || !elementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5, rootMargin: '-50px' }
    );

    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [triggerOnView]);

  // Annotation 생성 및 관리
  useEffect(() => {
    if (!elementRef.current || !mounted) return;

    const shouldShow = show !== undefined ? show : (triggerOnView ? isInView : true);
    const finalColor = color || getDefaultColor();

    // 기존 annotation 정리
    if (annotationRef.current) {
      annotationRef.current.remove();
      annotationRef.current = null;
    }

    // 새 annotation 생성
    annotationRef.current = annotate(elementRef.current, {
      type,
      color: finalColor,
      animate,
      animationDuration,
      strokeWidth,
      padding,
      multiline,
      iterations,
      brackets,
    });

    if (shouldShow) {
      const timeoutId = setTimeout(() => {
        annotationRef.current?.show();
      }, delay);
      return () => clearTimeout(timeoutId);
    }

    return () => {
      annotationRef.current?.remove();
    };
  }, [
    mounted,
    isInView,
    show,
    triggerOnView,
    type,
    color,
    resolvedTheme,
    animate,
    animationDuration,
    strokeWidth,
    padding,
    multiline,
    iterations,
    delay,
  ]);

  return (
    <span ref={elementRef} className={`inline ${className}`}>
      {children}
    </span>
  );
};
