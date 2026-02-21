'use client';

import { useCallback, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

import { useTerminal } from '@/context/TerminalContext';

type ScrollState = 'idle' | 'open' | 'dismissed';

export const TerminalSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);

  // placeholder 자체를 트리거로 사용 (560px 높이 → 뷰포트 중앙에 오래 머묾)
  const isActive = useInView(placeholderRef, { once: false, margin: '-30% 0px -30% 0px' });
  const isInViewOnce = useInView(sectionRef, { once: true, margin: '-100px' });

  const { isOpen, openTerminal, closeTerminal, setIsAnchored, setAnchorEl } = useTerminal();
  const stateRef = useRef<ScrollState>('idle');

  // placeholder ref를 context에 등록 + 로컬 ref 동기화
  const placeholderCallbackRef = useCallback((node: HTMLDivElement | null) => {
    placeholderRef.current = node;
    setAnchorEl(node);
  }, [setAnchorEl]);

  // 스크롤 진입/이탈
  useEffect(() => {
    if (isActive) {
      if (stateRef.current === 'idle') {
        setIsAnchored(true);
        openTerminal();
        stateRef.current = 'open';
      }
    } else {
      if (stateRef.current === 'open') {
        closeTerminal();
        setIsAnchored(false);
      }
      stateRef.current = 'idle';
    }
  }, [isActive, openTerminal, closeTerminal, setIsAnchored]);

  // 사용자가 직접 닫기 감지 (X 버튼)
  useEffect(() => {
    if (!isOpen && stateRef.current === 'open') {
      stateRef.current = 'dismissed';
      setIsAnchored(false);
    }
  }, [isOpen, setIsAnchored]);

  // 페이지 이동 시 정리
  useEffect(() => {
    return () => {
      if (stateRef.current === 'open') {
        closeTerminal();
      }
      setIsAnchored(false);
      setAnchorEl(null);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="py-12 md:py-24 border-t border-border" ref={sectionRef}>
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <motion.div
          className="mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInViewOnce ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4 italic">
            Terminal
          </h2>
          <p className="text-muted-foreground">
            Explore my portfolio the hacker way. Type{' '}
            <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">/help</code>{' '}
            to get started.
          </p>
        </motion.div>

        {/* placeholder = 트리거 겸 앵커 */}
        <div ref={placeholderCallbackRef} className="min-h-[560px] rounded-xl" />
      </div>
    </section>
  );
};

export default TerminalSection;
