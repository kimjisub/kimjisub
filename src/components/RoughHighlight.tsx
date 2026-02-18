'use client';

import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { annotate } from 'rough-notation';

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
  const getDefaultColor = useCallback(() => {
    if (type === 'highlight') {
      return resolvedTheme === 'dark' 
        ? 'rgba(255, 215, 0, 0.3)' // 골드 (다크모드)
        : 'rgba(255, 215, 0, 0.4)'; // 골드 (라이트모드)
    }
    return resolvedTheme === 'dark' 
      ? 'rgba(147, 197, 253, 0.8)' // 밝은 파랑 (다크모드)
      : 'rgba(59, 130, 246, 0.8)'; // 파랑 (라이트모드)
  }, [type, resolvedTheme]);

  useEffect(() => {
    // Wait for fonts to load and layout to stabilize
    const init = async () => {
      // Wait for fonts
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
      // Additional delay for layout stability
      await new Promise(resolve => setTimeout(resolve, 100));
      setMounted(true);
    };
    init();
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

    const element = elementRef.current;
    const shouldShow = show !== undefined ? show : (triggerOnView ? isInView : true);
    const finalColor = color || getDefaultColor();

    const createAnnotation = () => {
      // 기존 annotation 정리
      if (annotationRef.current) {
        annotationRef.current.remove();
        annotationRef.current = null;
      }

      if (!element) return;

      // 새 annotation 생성
      annotationRef.current = annotate(element, {
        type,
        color: finalColor,
        animate: false, // 재생성 시 애니메이션 끄기
        animationDuration,
        strokeWidth,
        padding,
        multiline,
        iterations,
        brackets,
      });

      if (shouldShow) {
        annotationRef.current?.show();
      }
    };

    // 초기 생성 (애니메이션 포함)
    const initAnnotation = () => {
      // 요소가 제대로 배치되었는지 확인 (0,0 방지)
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        // 레이아웃이 아직 완료되지 않음, 재시도
        setTimeout(initAnnotation, 100);
        return;
      }

      annotationRef.current = annotate(element, {
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
        setTimeout(() => {
          annotationRef.current?.show();
        }, delay);
      }
    };

    // ResizeObserver로 레이아웃 변경 감지
    let resizeTimeout: NodeJS.Timeout;
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(createAnnotation, 50);
    });

    // Wait for layout then create
    const rafId = requestAnimationFrame(() => {
      initAnnotation();
      resizeObserver.observe(element);
    });

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimeout);
      resizeObserver.disconnect();
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
    brackets,
    getDefaultColor,
  ]);

  return (
    <span ref={elementRef} className={`inline ${className}`}>
      {children}
    </span>
  );
};
