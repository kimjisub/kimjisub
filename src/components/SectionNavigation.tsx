'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// 메인 페이지 섹션 IDs (순서 중요)
const SECTION_IDS = ['hero', 'about', 'terminal', 'work', 'skills', 'blog', 'testimonials', 'contact'];

// 섹션 이름 매핑
const SECTION_NAMES: Record<string, string> = {
  hero: 'Hero',
  about: 'About',
  terminal: 'Terminal',
  work: 'Work',
  skills: 'Skills',
  blog: 'Blog',
  testimonials: 'Testimonials',
  contact: 'Contact',
};

export function SectionNavigation() {
  const [showHint, setShowHint] = useState(false);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [direction, setDirection] = useState<'up' | 'down'>('down');

  // 현재 화면에 보이는 섹션 찾기
  const findCurrentSection = useCallback(() => {
    const viewportMiddle = window.innerHeight / 2;
    
    for (const id of SECTION_IDS) {
      const element = document.getElementById(id);
      if (!element) continue;
      
      const rect = element.getBoundingClientRect();
      // 섹션의 상단이 뷰포트 중간 위에 있고, 하단이 뷰포트 중간 아래에 있으면 현재 섹션
      if (rect.top <= viewportMiddle && rect.bottom >= viewportMiddle) {
        return id;
      }
    }
    
    // 페이지 상단이면 첫 섹션
    if (window.scrollY < 100) return SECTION_IDS[0];
    
    // 페이지 하단이면 마지막 섹션
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 100) {
      return SECTION_IDS[SECTION_IDS.length - 1];
    }
    
    return null;
  }, []);

  // 섹션으로 스크롤
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setCurrentSection(sectionId);
      setShowHint(true);
      
      // 2초 후 힌트 숨기기
      setTimeout(() => setShowHint(false), 2000);
    }
  }, []);

  // 다음/이전 섹션으로 이동
  const navigateSection = useCallback((dir: 'next' | 'prev') => {
    const current = findCurrentSection();
    const currentIndex = current ? SECTION_IDS.indexOf(current) : 0;
    
    let nextIndex: number;
    if (dir === 'next') {
      nextIndex = Math.min(currentIndex + 1, SECTION_IDS.length - 1);
      setDirection('down');
    } else {
      nextIndex = Math.max(currentIndex - 1, 0);
      setDirection('up');
    }
    
    const nextSection = SECTION_IDS[nextIndex];
    if (nextSection) {
      scrollToSection(nextSection);
    }
  }, [findCurrentSection, scrollToSection]);

  // 키보드 이벤트 핸들러
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 입력 필드에서는 무시
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        e.metaKey ||
        e.ctrlKey ||
        e.altKey
      ) {
        return;
      }

      switch (e.key) {
        case 'j':
          e.preventDefault();
          navigateSection('next');
          break;
        case 'k':
          e.preventDefault();
          navigateSection('prev');
          break;
        case 'g':
          // gg = 맨 위로 (빠른 더블 키 체크는 복잡하므로 g 한번만으로 처리)
          e.preventDefault();
          scrollToSection(SECTION_IDS[0]);
          setDirection('up');
          break;
        case 'G':
          // Shift+G = 맨 아래로
          e.preventDefault();
          scrollToSection(SECTION_IDS[SECTION_IDS.length - 1]);
          setDirection('down');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateSection, scrollToSection]);

  return (
    <AnimatePresence>
      {showHint && currentSection && (
        <motion.div
          key="section-hint"
          initial={{ opacity: 0, y: direction === 'down' ? -20 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/90 border border-border shadow-lg backdrop-blur-sm">
            <span className="text-sm font-medium text-foreground">
              {SECTION_NAMES[currentSection] || currentSection}
            </span>
            <span className="text-xs text-muted-foreground">
              ({SECTION_IDS.indexOf(currentSection) + 1}/{SECTION_IDS.length})
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
