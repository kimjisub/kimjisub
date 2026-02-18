'use client';

import { memo,useCallback, useEffect, useRef } from 'react';

/**
 * Mouse-reactive Particle Background
 *
 * - 순수 Canvas 기반 파티클 효과 (외부 라이브러리 없음)
 * - 마우스 이동 시 파티클 밀려남 효과 (repulsion)
 * - 라이트/다크 모드: CSS 변수 --mesh-color-1~4 읽어서 색상 동기화
 * - 모바일: 터치 + DeviceOrientation(가속도계) 반응 / 폴백으로 자동 부유
 * - 성능: requestAnimationFrame, 오프스크린 계산 최소화, ResizeObserver
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ox: number; // origin x
  oy: number; // origin y
  radius: number;
  color: string;
  alpha: number;
  baseAlpha: number;
  // 자동 드리프트용 (모바일 폴백)
  driftAngle: number;
  driftSpeed: number;
}

// ── Constants ──────────────────────────────────────────────
const PARTICLE_COUNT = 80;
const MOUSE_RADIUS = 120;       // 마우스 영향 반경 (px)
const REPULSION_STRENGTH = 6;   // 밀려나는 힘
const RETURN_STRENGTH = 0.04;   // 원래 위치로 복귀 탄성
const DAMPING = 0.88;           // 속도 감쇠
const MOBILE_BREAKPOINT = 768;  // px

// CSS 변수로부터 색상 읽기
function readMeshColors(el: Element): string[] {
  const style = getComputedStyle(el);
  return [
    style.getPropertyValue('--mesh-color-1').trim() || '#22c55e',
    style.getPropertyValue('--mesh-color-2').trim() || '#3b82f6',
    style.getPropertyValue('--mesh-color-3').trim() || '#8b5cf6',
    style.getPropertyValue('--mesh-color-4').trim() || '#06b6d4',
  ];
}

function createParticles(
  width: number,
  height: number,
  colors: string[],
): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, () => {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const baseAlpha = 0.25 + Math.random() * 0.45;
    return {
      x,
      y,
      vx: 0,
      vy: 0,
      ox: x,
      oy: y,
      radius: 1.5 + Math.random() * 2.5,
      color,
      alpha: baseAlpha,
      baseAlpha,
      driftAngle: Math.random() * Math.PI * 2,
      driftSpeed: 0.1 + Math.random() * 0.15,
    };
  });
}

// ── Component ──────────────────────────────────────────────
export const ParticleBackground = memo(function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // refs for mutable state shared across RAF closure
  const stateRef = useRef<{
    particles: Particle[];
    mouseX: number;
    mouseY: number;
    mouseActive: boolean;
    tiltX: number; // -1~1 (DeviceOrientation)
    tiltY: number;
    isMobile: boolean;
    colors: string[];
    animId: number;
  }>({
    particles: [],
    mouseX: -9999,
    mouseY: -9999,
    mouseActive: false,
    tiltX: 0,
    tiltY: 0,
    isMobile: false,
    colors: ['#22c55e', '#3b82f6', '#8b5cf6', '#06b6d4'],
    animId: 0,
  });

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = parent.offsetWidth;
    const h = parent.offsetHeight;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);

    // CSS 변수 읽기
    const colors = readMeshColors(canvas);
    const state = stateRef.current;
    state.colors = colors;
    state.isMobile = w < MOBILE_BREAKPOINT;

    // 파티클 재생성
    state.particles = createParticles(w, h, colors);
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = canvas.width / dpr;
    const H = canvas.height / dpr;

    const state = stateRef.current;
    const { particles, mouseX, mouseY, mouseActive, tiltX, tiltY, isMobile } = state;

    ctx.clearRect(0, 0, W, H);

    for (const p of particles) {
      let fx = 0;
      let fy = 0;

      if (isMobile) {
        // 모바일: DeviceOrientation 또는 자동 드리프트
        if (tiltX !== 0 || tiltY !== 0) {
          fx = tiltX * 1.5;
          fy = tiltY * 1.5;
        } else {
          // 자동 부유 (폴백)
          p.driftAngle += 0.008;
          fx = Math.cos(p.driftAngle) * p.driftSpeed;
          fy = Math.sin(p.driftAngle) * p.driftSpeed;
        }
      } else if (mouseActive) {
        // 데스크탑: 마우스 반발력
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (1 - dist / MOUSE_RADIUS) * REPULSION_STRENGTH;
          fx = (dx / dist) * force;
          fy = (dy / dist) * force;
        }
      }

      // 원래 위치 복귀 스프링
      const rx = (p.ox - p.x) * RETURN_STRENGTH;
      const ry = (p.oy - p.y) * RETURN_STRENGTH;

      p.vx = (p.vx + fx + rx) * DAMPING;
      p.vy = (p.vy + fy + ry) * DAMPING;
      p.x += p.vx;
      p.y += p.vy;

      // 벽 바운스 (부드럽게)
      if (p.x < 0) { p.x = 0; p.vx *= -0.5; }
      if (p.x > W) { p.x = W; p.vx *= -0.5; }
      if (p.y < 0) { p.y = 0; p.vy *= -0.5; }
      if (p.y > H) { p.y = H; p.vy *= -0.5; }

      // 마우스 근접 시 알파 증가
      const dxM = p.x - mouseX;
      const dyM = p.y - mouseY;
      const distM = Math.sqrt(dxM * dxM + dyM * dyM);
      const glowFactor = mouseActive && distM < MOUSE_RADIUS * 1.5
        ? 1 + (1 - distM / (MOUSE_RADIUS * 1.5)) * 0.6
        : 1;
      p.alpha = Math.min(1, p.baseAlpha * glowFactor);

      // 파티클 그리기
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
    }

    ctx.globalAlpha = 1;

    // 파티클 연결선 (가까운 것끼리)
    const maxDist = 90;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          const lineAlpha = (1 - dist / maxDist) * 0.15;
          ctx.strokeStyle = a.color;
          ctx.globalAlpha = lineAlpha;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;

    state.animId = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    initCanvas();

    const state = stateRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── 마우스 이벤트 (window 레벨 - canvas가 pointer-events-none이므로) ──
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      // canvas 영역 내에서만 활성화
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        state.mouseX = x;
        state.mouseY = y;
        state.mouseActive = true;
      } else {
        state.mouseActive = false;
        state.mouseX = -9999;
        state.mouseY = -9999;
      }
    };
    const onMouseLeave = () => {
      state.mouseActive = false;
      state.mouseX = -9999;
      state.mouseY = -9999;
    };

    // ── 터치 이벤트 ──────────────────────
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const rect = canvas.getBoundingClientRect();
      state.mouseX = e.touches[0].clientX - rect.left;
      state.mouseY = e.touches[0].clientY - rect.top;
      state.mouseActive = true;
    };
    const onTouchEnd = () => {
      state.mouseActive = false;
      state.mouseX = -9999;
      state.mouseY = -9999;
    };

    // ── DeviceOrientation ────────────────
    let orientationGranted = false;
    const onOrientation = (e: DeviceOrientationEvent) => {
      if (!orientationGranted) orientationGranted = true;
      // gamma: left/right -90~90, beta: front/back -180~180
      state.tiltX = (e.gamma ?? 0) / 45; // normalize to -1~1
      state.tiltY = ((e.beta ?? 0) - 10) / 45;
    };

    // iOS 13+ requires permission
    const requestOrientationPermission = async () => {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const DeviceOrientationEventAny = DeviceOrientationEvent as any;
      if (typeof DeviceOrientationEventAny.requestPermission === 'function') {
        try {
          const perm = await DeviceOrientationEventAny.requestPermission();
          if (perm === 'granted') {
            window.addEventListener('deviceorientation', onOrientation);
          }
        } catch {
          // Permission denied or not available
        }
      } else {
        window.addEventListener('deviceorientation', onOrientation);
      }
      /* eslint-enable @typescript-eslint/no-explicit-any */
    };

    // ── ResizeObserver ───────────────────
    const resizeObserver = new ResizeObserver(() => {
      initCanvas();
    });
    const parent = canvas.parentElement;
    if (parent) resizeObserver.observe(parent);

    // ── 이벤트 등록 (window 레벨) ────────
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    if (state.isMobile) {
      void requestOrientationPermission();
    }

    // ── 색상 변화 감지 (다크모드 토글 대응) ──
    const observer = new MutationObserver(() => {
      const colors = readMeshColors(canvas);
      state.colors = colors;
      // 파티클 색상 업데이트
      for (const p of state.particles) {
        p.color = colors[Math.floor(Math.random() * colors.length)];
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-accent'],
    });

    // ── 애니메이션 시작 ──────────────────
    state.animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(state.animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('deviceorientation', onOrientation);
      resizeObserver.disconnect();
      observer.disconnect();
    };
  }, [initCanvas, draw]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  );
});
