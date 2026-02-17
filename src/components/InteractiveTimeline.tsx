'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { format } from 'date-fns';

import { CareerT } from '@/api/notion/careers';
import { BlurImage } from '@/components/BlurImage';

interface TimelineItemProps {
  career: CareerT;
  index: number;
  isActive: boolean;
}

const TimelineItem = ({ career, index, isActive }: TimelineItemProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px 0px -50px 0px' });
  const isLeft = index % 2 === 0;

  const icon = career.iconUrl ? (
    <Image
      className="w-5 h-5"
      width={20}
      height={20}
      src={career.iconUrl}
      alt={`${career.title} 아이콘`}
    />
  ) : career.iconEmoji ? (
    <span className="text-sm">{career.iconEmoji}</span>
  ) : null;

  const formatDateRange = () => {
    const start = career.date.start ? format(career.date.start, 'yyyy.MM') : '';
    const end = career.date.end ? format(career.date.end, 'yyyy.MM') : '현재';
    return start ? `${start} — ${end}` : '';
  };

  return (
    <motion.div
      ref={ref}
      className={`relative flex items-start mb-8 md:mb-12 ${
        isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
      }`}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* 타임라인 노드 (데스크톱 중앙) */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 flex-col items-center z-10">
        <motion.div
          className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
            isActive
              ? 'bg-accent border-accent scale-125 shadow-lg shadow-accent/30'
              : 'bg-background border-border hover:border-accent'
          }`}
          whileHover={{ scale: 1.3 }}
        />
      </div>

      {/* 타임라인 노드 (모바일 왼쪽) */}
      <div className="flex md:hidden absolute left-0 flex-col items-center z-10">
        <motion.div
          className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
            isActive
              ? 'bg-accent border-accent scale-125 shadow-lg shadow-accent/30'
              : 'bg-background border-border'
          }`}
        />
      </div>

      {/* 컨텐츠 카드 */}
      <div
        className={`w-full md:w-[calc(50%-2rem)] pl-8 md:pl-0 ${
          isLeft ? 'md:pr-12' : 'md:pl-12'
        }`}
      >
        <Link href={`/careers/${career.id}`} prefetch className="group block">
          <motion.article
            className={`relative rounded-xl border bg-card overflow-hidden transition-all duration-300 ${
              isActive
                ? 'border-accent/50 shadow-lg shadow-accent/10'
                : 'border-border hover:border-accent/30 hover:shadow-md'
            }`}
            whileHover={{ y: -2 }}
          >
            {/* 커버 이미지 */}
            {career.coverImageUrl && (
              <div className="relative overflow-hidden">
                <div className="aspect-[16/9]">
                  <BlurImage
                    className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                    width={400}
                    height={225}
                    src={career.coverImageUrl}
                    alt={`${career.title} 커버 이미지`}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            )}

            <div className="p-4 md:p-5">
              {/* 날짜 */}
              <p className="text-xs text-muted-foreground mb-2 font-mono">
                {formatDateRange()}
              </p>

              {/* 제목 */}
              <h3 className="font-medium text-foreground flex items-center gap-2 mb-2 group-hover:text-accent transition-colors">
                {icon}
                <span className="line-clamp-1">{career.title}</span>
              </h3>

              {/* 설명 */}
              {career.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {career.description}
                </p>
              )}

              {/* 카테고리 태그 */}
              {career.categories && career.categories.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {career.categories.slice(0, 3).map((cat) => (
                    <span
                      key={cat.name}
                      className="px-2 py-0.5 text-xs rounded-full bg-secondary text-secondary-foreground"
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.article>
        </Link>
      </div>

      {/* 데스크톱용 반대편 공간 */}
      <div className="hidden md:block w-[calc(50%-2rem)]" />
    </motion.div>
  );
};

interface InteractiveTimelineProps {
  careers: CareerT[];
}

export const InteractiveTimeline = ({ careers }: InteractiveTimelineProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  // 스크롤 진행도에 따른 라인 애니메이션
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  // 스크롤 위치에 따라 활성 아이템 결정
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const items = container.querySelectorAll('[data-timeline-item]');
      const viewportCenter = window.innerHeight / 2;

      let closestIndex = 0;
      let closestDistance = Infinity;

      items.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.top + rect.height / 2;
        const distance = Math.abs(itemCenter - viewportCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 날짜순 정렬 (최신순)
  const sortedCareers = [...careers].sort((a, b) => {
    const dateA = a.date.start?.getTime() || 0;
    const dateB = b.date.start?.getTime() || 0;
    return dateB - dateA;
  });

  // 연도별 그룹 추출
  const years = Array.from(new Set(
    sortedCareers
      .filter(c => c.date.start)
      .map(c => c.date.start!.getFullYear())
  ));

  return (
    <div ref={containerRef} className="relative">
      {/* 타임라인 세로선 (데스크톱 중앙) */}
      <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 w-px h-full">
        <div className="w-full h-full bg-border" />
        <motion.div
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-accent to-accent/50"
          style={{ height: lineHeight }}
        />
      </div>

      {/* 타임라인 세로선 (모바일 왼쪽) */}
      <div className="md:hidden absolute left-[5px] top-0 w-px h-full">
        <div className="w-full h-full bg-border" />
        <motion.div
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-accent to-accent/50"
          style={{ height: lineHeight }}
        />
      </div>

      {/* 연도 마커 */}
      <div className="hidden md:block">
        {years.map((year) => {
          const firstCareerOfYear = sortedCareers.find(
            c => c.date.start?.getFullYear() === year
          );
          const index = sortedCareers.indexOf(firstCareerOfYear!);
          
          return (
            <div
              key={year}
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
              style={{ top: `${(index / sortedCareers.length) * 100}%` }}
            >
              <motion.div
                className="px-3 py-1 bg-accent text-accent-foreground text-sm font-mono rounded-full shadow-md"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                {year}
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* 타임라인 아이템들 */}
      <div className="relative">
        {sortedCareers.map((career, index) => (
          <div key={career.id} data-timeline-item>
            <TimelineItem
              career={career}
              index={index}
              isActive={index === activeIndex}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteractiveTimeline;
