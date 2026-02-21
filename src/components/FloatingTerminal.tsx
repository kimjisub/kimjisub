'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, AnimatePresence, motion, type MotionValue, useMotionValue } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

import { InteractiveTerminal } from '@/components/InteractiveTerminal';
import { useTerminal } from '@/context/TerminalContext';

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];
const DURATION = 0.5;
const FAB_SIZE = 56;
const FAB_OFFSET = 24;
const FAB_RADIUS = FAB_SIZE / 2;
const PANEL_RADIUS = 12;
const FLOAT_W = 600;
const FLOAT_H = 560;
const FLOAT_GAP = 16;
const CHASE_FACTOR = 0.15;

function fabPos() {
  return {
    x: window.innerWidth - FAB_OFFSET - FAB_SIZE,
    y: window.innerHeight - FAB_OFFSET - FAB_SIZE,
    w: FAB_SIZE,
    h: FAB_SIZE,
    r: FAB_RADIUS,
  };
}

function floatPos() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (vw < 768) {
    return { x: FLOAT_GAP, y: FLOAT_GAP, w: vw - FLOAT_GAP * 2, h: vh - FLOAT_GAP * 2, r: PANEL_RADIUS };
  }
  return {
    x: vw - FLOAT_GAP - FLOAT_W,
    y: Math.max(FLOAT_GAP, vh - FLOAT_GAP - FLOAT_H),
    w: FLOAT_W,
    h: Math.min(FLOAT_H, vh - FLOAT_GAP * 2),
    r: PANEL_RADIUS,
  };
}

/**
 * 앵커 위치를 향해 매 프레임 추적하는 rAF 루프.
 * 스크롤 중에도 anchorEl.getBoundingClientRect()를 실시간으로 읽어
 * 뷰포트 좌표 변화에 자동 보정됨.
 */
function startPositionChase(
  mvX: MotionValue<number>,
  mvY: MotionValue<number>,
  anchorEl: HTMLDivElement,
  onDone: () => void,
) {
  let rafId: number;
  let settled = false;

  function tick() {
    const rect = anchorEl.getBoundingClientRect();
    const cx = mvX.get();
    const cy = mvY.get();
    const dx = rect.left - cx;
    const dy = rect.top - cy;

    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
      mvX.set(rect.left);
      mvY.set(rect.top);
      settled = true;
      onDone();
      return;
    }

    mvX.set(cx + dx * CHASE_FACTOR);
    mvY.set(cy + dy * CHASE_FACTOR);
    rafId = requestAnimationFrame(tick);
  }

  rafId = requestAnimationFrame(tick);
  return () => {
    if (!settled) cancelAnimationFrame(rafId);
  };
}

export const FloatingTerminal = () => {
  const { isOpen, isAnchored, openTerminal, closeTerminal, anchorEl } = useTerminal();
  const [mounted, setMounted] = useState(false);

  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const mvW = useMotionValue(FAB_SIZE);
  const mvH = useMotionValue(FAB_SIZE);
  const mvR = useMotionValue(FAB_RADIUS);

  const isOpenRef = useRef(isOpen);
  const isAnchoredRef = useRef(isAnchored);
  const anchorElRef = useRef(anchorEl);
  isOpenRef.current = isOpen;
  isAnchoredRef.current = isAnchored;
  anchorElRef.current = anchorEl;

  const isChasingRef = useRef(false);
  const cancelChaseRef = useRef<(() => void) | null>(null);

  // 마운트 시 FAB 위치 초기화
  useEffect(() => {
    const p = fabPos();
    mvX.set(p.x);
    mvY.set(p.y);
    mvW.set(p.w);
    mvH.set(p.h);
    mvR.set(p.r);
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 상태 변경 → 타겟 위치로 애니메이션
  useEffect(() => {
    if (!mounted) return;

    // 진행 중인 chase 취소
    cancelChaseRef.current?.();
    cancelChaseRef.current = null;
    isChasingRef.current = false;

    const t = { duration: DURATION, ease: EASE };

    if (!isOpen) {
      const p = fabPos();
      animate(mvX, p.x, t);
      animate(mvY, p.y, t);
      animate(mvW, p.w, t);
      animate(mvH, p.h, t);
      animate(mvR, p.r, t);
    } else if (isAnchored && anchorEl) {
      const rect = anchorEl.getBoundingClientRect();
      // 크기·모서리: 고정 타겟 애니메이션
      animate(mvW, rect.width, t);
      animate(mvH, rect.height, t);
      animate(mvR, PANEL_RADIUS, t);
      // 위치: rAF chase (스크롤해도 실시간 보정)
      isChasingRef.current = true;
      cancelChaseRef.current = startPositionChase(mvX, mvY, anchorEl, () => {
        isChasingRef.current = false;
      });
    } else {
      const p = floatPos();
      animate(mvX, p.x, t);
      animate(mvY, p.y, t);
      animate(mvW, p.w, t);
      animate(mvH, p.h, t);
      animate(mvR, p.r, t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isAnchored, anchorEl, mounted]);

  // 앵커 모드: 스크롤 시 위치 즉시 추적 (chase 완료 후)
  useEffect(() => {
    if (!isOpen || !isAnchored || !anchorEl) return;
    const track = () => {
      if (isChasingRef.current) return;
      if (!anchorElRef.current) return;
      const rect = anchorElRef.current.getBoundingClientRect();
      mvX.set(rect.left);
      mvY.set(rect.top);
    };
    window.addEventListener('scroll', track, { passive: true });
    window.addEventListener('resize', track, { passive: true });
    return () => {
      window.removeEventListener('scroll', track);
      window.removeEventListener('resize', track);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isAnchored, anchorEl]);

  // 리사이즈 시 FAB/floating 위치 갱신
  useEffect(() => {
    const onResize = () => {
      if (!isOpenRef.current) {
        const p = fabPos();
        mvX.set(p.x);
        mvY.set(p.y);
      } else if (!isAnchoredRef.current) {
        const p = floatPos();
        mvX.set(p.x);
        mvY.set(p.y);
        mvW.set(p.w);
        mvH.set(p.h);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop — floating 모드에서만 */}
      <AnimatePresence>
        {isOpen && !isAnchored && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={closeTerminal}
          />
        )}
      </AnimatePresence>

      {/* 메인 컨테이너 — FAB ↔ 터미널 */}
      <motion.div
        className={`fixed z-50 overflow-hidden ${isOpen ? 'bg-card shadow-2xl border border-border' : 'bg-accent shadow-lg'}`}
        style={{
          left: mvX,
          top: mvY,
          width: mvW,
          height: mvH,
          borderRadius: mvR,
        }}
      >
        {/* FAB 아이콘 */}
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              key="fab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={openTerminal}
              className="absolute inset-0 flex items-center justify-center text-accent-foreground cursor-pointer"
              aria-label="터미널 열기"
            >
              <MessageSquare className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* 터미널 */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="terminal"
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, delay: 0.15 }}
            >
              <InteractiveTerminal mode="floating" onClose={closeTerminal} className="h-full !max-w-none !rounded-none !border-0 !shadow-none" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default FloatingTerminal;
