'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useAnimation, type PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { type ProjectT } from '@/api/notion/projects';
import { ProjectItem } from '@/components/ProjectItem';

interface ProjectCarouselProps {
  projects: ProjectT[];
}

const CARD_WIDTH = 360;
const CARD_GAP = 24;
const CARD_STEP = CARD_WIDTH + CARD_GAP;
const MAX_DOTS = 15;

export const ProjectCarousel = ({ projects }: ProjectCarouselProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [maxDrag, setMaxDrag] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);
  const isDraggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const x = useMotionValue(0);
  const controls = useAnimation();

  // 컨테이너 크기에 따라 maxDrag 계산
  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return;
      const containerW = containerRef.current.offsetWidth;
      const totalTrackWidth = projects.length * CARD_STEP - CARD_GAP;
      const padding = 48; // px-6 * 2
      const max = Math.max(0, totalTrackWidth - containerW + padding);
      setMaxDrag(max);
    };

    updateDimensions();
    const observer = new ResizeObserver(updateDimensions);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [projects.length]);

  const snapToIndex = useCallback(
    (index: number) => {
      const clampedIndex = Math.max(0, Math.min(index, projects.length - 1));
      const targetX = -clampedIndex * CARD_STEP;
      const clampedX = Math.max(-maxDrag, Math.min(0, targetX));

      void controls.start({
        x: clampedX,
        transition: { type: 'spring', damping: 28, stiffness: 220 },
      });

      setCurrentIndex(clampedIndex);
      currentIndexRef.current = clampedIndex;
    },
    [projects.length, maxDrag, controls],
  );

  const handleDragStart = useCallback(() => {
    isDraggingRef.current = true;
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(
    (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const currentX = x.get();
      const { velocity, offset } = info;

      let newIndex = currentIndexRef.current;

      if (Math.abs(velocity.x) > 300) {
        newIndex =
          velocity.x < 0
            ? currentIndexRef.current + 1
            : currentIndexRef.current - 1;
      } else if (Math.abs(offset.x) > CARD_STEP / 3) {
        newIndex =
          offset.x < 0
            ? currentIndexRef.current + 1
            : currentIndexRef.current - 1;
      } else {
        newIndex = Math.round(-currentX / CARD_STEP);
      }

      snapToIndex(newIndex);

      // 드래그 끝난 후 잠깐 딜레이 주어 클릭 방지
      setTimeout(() => {
        isDraggingRef.current = false;
        setIsDragging(false);
      }, 100);
    },
    [x, snapToIndex],
  );

  // 휠 이벤트 → 수평 스크롤 변환
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let wheelTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleWheel = (e: WheelEvent) => {
      // 이미 수평 스크롤이면 무시
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      e.preventDefault();
      e.stopPropagation();

      if (wheelTimeout) return; // 디바운스 – 연속 스크롤 방지

      if (e.deltaY > 0) {
        snapToIndex(currentIndexRef.current + 1);
      } else {
        snapToIndex(currentIndexRef.current - 1);
      }

      wheelTimeout = setTimeout(() => {
        wheelTimeout = null;
      }, 400);
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
      if (wheelTimeout) clearTimeout(wheelTimeout);
    };
  }, [snapToIndex]);

  // 키보드 접근성
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') snapToIndex(currentIndexRef.current + 1);
      if (e.key === 'ArrowLeft') snapToIndex(currentIndexRef.current - 1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [snapToIndex]);

  const showDots = projects.length <= MAX_DOTS;
  const progressPercent =
    projects.length > 1 ? (currentIndex / (projects.length - 1)) * 100 : 0;
  const thumbWidth = (1 / projects.length) * 100;

  return (
    <div className="relative" role="region" aria-label="프로젝트 캐러셀">
      {/* 좌우 페이드 마스크 */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-background to-transparent" />

      {/* 캐러셀 트랙 */}
      <div
        ref={containerRef}
        className={`overflow-hidden px-6 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        <motion.div
          className="flex py-4"
          style={{ x, gap: CARD_GAP }}
          drag="x"
          dragConstraints={{ left: -maxDrag, right: 0 }}
          dragElastic={0.05}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {projects.map((project) => (
            <div
              key={project.id}
              style={{ width: CARD_WIDTH, flexShrink: 0 }}
              onClickCapture={(e) => {
                if (isDraggingRef.current) e.preventDefault();
              }}
            >
              <ProjectItem project={project} />
            </div>
          ))}
        </motion.div>
      </div>

      {/* 인디케이터 영역 */}
      <div className="mt-4 px-6 flex flex-col gap-3">
        {/* 이전 / 다음 버튼 + 닷 인디케이터 */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => snapToIndex(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="p-1.5 rounded-full border border-border text-foreground disabled:opacity-30 hover:bg-accent transition-colors"
            aria-label="이전 프로젝트"
          >
            <ChevronLeft size={16} />
          </button>

          {showDots ? (
            <div className="flex gap-2 items-center">
              {projects.map((_, i) => (
                <button
                  key={i}
                  onClick={() => snapToIndex(i)}
                  aria-label={`프로젝트 ${i + 1}로 이동`}
                  className={`rounded-full transition-all duration-300 ${
                    i === currentIndex
                      ? 'w-6 h-2 bg-foreground'
                      : 'w-2 h-2 bg-border hover:bg-muted-foreground'
                  }`}
                />
              ))}
            </div>
          ) : (
            <span className="text-sm text-muted-foreground tabular-nums">
              {currentIndex + 1} / {projects.length}
            </span>
          )}

          <button
            onClick={() => snapToIndex(currentIndex + 1)}
            disabled={currentIndex === projects.length - 1}
            className="p-1.5 rounded-full border border-border text-foreground disabled:opacity-30 hover:bg-accent transition-colors"
            aria-label="다음 프로젝트"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* 프로그레스 바 */}
        <div className="h-0.5 bg-border rounded-full overflow-hidden relative">
          <motion.div
            className="absolute top-0 h-full bg-foreground/70 rounded-full"
            animate={{
              left: `${(progressPercent / 100) * (100 - thumbWidth)}%`,
              width: `${thumbWidth}%`,
            }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          />
        </div>
      </div>
    </div>
  );
};
