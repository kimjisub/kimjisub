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
  _svg?: SVGSVGElement;
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
  const containerRef = useRef<HTMLSpanElement>(null);
  const elementRef = useRef<HTMLSpanElement>(null);
  const annotationRef = useRef<RoughAnnotation | null>(null);
  const [isInView, setIsInView] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 테마별 기본 색상
  const getDefaultColor = useCallback(() => {
    if (type === 'highlight') {
      return resolvedTheme === 'dark' 
        ? 'rgba(255, 215, 0, 0.3)'
        : 'rgba(255, 215, 0, 0.4)';
    }
    return resolvedTheme === 'dark' 
      ? 'rgba(147, 197, 253, 0.8)'
      : 'rgba(59, 130, 246, 0.8)';
  }, [type, resolvedTheme]);

  useEffect(() => {
    const init = async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
      await new Promise(resolve => setTimeout(resolve, 150));
      setMounted(true);
    };
    init();
  }, []);

  // Intersection Observer
  useEffect(() => {
    if (!triggerOnView || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3, rootMargin: '0px' }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [triggerOnView, mounted]);

  // Annotation 생성 및 SVG 이동
  useEffect(() => {
    if (!elementRef.current || !containerRef.current || !mounted) return;

    const element = elementRef.current;
    const container = containerRef.current;
    const shouldShow = show !== undefined ? show : (triggerOnView ? isInView : true);
    const finalColor = color || getDefaultColor();

    // 기존 annotation 정리
    if (annotationRef.current) {
      annotationRef.current.remove();
      annotationRef.current = null;
    }

    // 이전 SVG 정리
    const oldSvg = container.querySelector('svg.rough-annotation');
    if (oldSvg) oldSvg.remove();

    if (!shouldShow) return;

    // 요소 위치 확인
    const rect = element.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      const retryTimer = setTimeout(() => {
        setMounted(m => !m); // 강제 리렌더
      }, 100);
      return () => clearTimeout(retryTimer);
    }

    const showTimer = setTimeout(() => {
      // Annotation 생성
      const annotation = annotate(element, {
        type,
        color: finalColor,
        animate,
        animationDuration,
        strokeWidth,
        padding,
        multiline,
        iterations,
        brackets,
      }) as RoughAnnotation;

      annotationRef.current = annotation;
      annotation.show();

      // SVG를 body에서 container 내부로 이동
      requestAnimationFrame(() => {
        const svg = annotation._svg;
        if (svg && svg.parentElement === document.body) {
          // SVG 스타일을 상대 위치로 변경
          svg.style.position = 'absolute';
          svg.style.top = '0';
          svg.style.left = '0';
          svg.style.pointerEvents = 'none';
          svg.classList.add('rough-annotation');
          
          // container 내부로 이동
          container.appendChild(svg);
        }
      });
    }, delay);

    return () => {
      clearTimeout(showTimer);
      if (annotationRef.current) {
        annotationRef.current.remove();
        annotationRef.current = null;
      }
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
    <span 
      ref={containerRef} 
      className={`relative inline-block ${className}`}
      style={{ position: 'relative' }}
    >
      <span ref={elementRef} className="relative z-10">
        {children}
      </span>
    </span>
  );
};

export default RoughHighlight;
