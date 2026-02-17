'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useTheme } from 'next-themes';

type CursorState = 'default' | 'hover' | 'text';

/** Trail 설정 */
const TRAIL_LENGTH = 20;
const LERP_FACTOR = 0.42; // spring-like 추적 계수 (낮을수록 느리게 따라옴)
const TRAIL_MAX_SIZE = 5; // 커서에 가장 가까운 점의 지름 (px)
const TRAIL_MIN_SIZE = 1; // 꼬리 끝 점의 지름 (px)
const TRAIL_MAX_ALPHA = 0.5; // 커서에 가장 가까운 점의 최대 불투명도
const TRAIL_FADE_IN_SPEED = 0.08; // 등장 속도
const TRAIL_FADE_OUT_SPEED = 0.04; // 사라지는 속도

interface TrailDot {
	x: number;
	y: number;
}

export default function CustomCursor() {
	const [cursorState, setCursorState] = useState<CursorState>('default');
	const [isVisible, setIsVisible] = useState(false);
	const [isTouchDevice, setIsTouchDevice] = useState(true);
	const { resolvedTheme } = useTheme();

	const cursorX = useMotionValue(0);
	const cursorY = useMotionValue(0);

	// 스프링 설정으로 부드러운 따라다니기 효과
	const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
	const smoothX = useSpring(cursorX, springConfig);
	const smoothY = useSpring(cursorY, springConfig);

	const rafRef = useRef<number | null>(null);
	const lastMousePos = useRef({ x: 0, y: 0 });

	// Trail 관련 refs
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const trailDotsRef = useRef<TrailDot[]>(
		Array.from({ length: TRAIL_LENGTH }, () => ({ x: 0, y: 0 })),
	);
	const trailRafRef = useRef<number | null>(null);
	const trailOpacityRef = useRef(0); // 부드러운 fade in/out
	const resolvedThemeRef = useRef(resolvedTheme);
	const isVisibleRef = useRef(false);

	// ref 동기화
	useEffect(() => {
		resolvedThemeRef.current = resolvedTheme;
	}, [resolvedTheme]);

	useEffect(() => {
		isVisibleRef.current = isVisible;
	}, [isVisible]);

	// 터치 디바이스 감지
	useEffect(() => {
		const checkTouchDevice = () => {
			const hasTouchPoints =
				'ontouchstart' in window || navigator.maxTouchPoints > 0;
			const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
			setIsTouchDevice(hasTouchPoints && isCoarsePointer);
		};

		checkTouchDevice();

		const mq = window.matchMedia('(pointer: coarse)');
		mq.addEventListener('change', checkTouchDevice);
		return () => mq.removeEventListener('change', checkTouchDevice);
	}, []);

	// Canvas 리사이즈 핸들러
	useEffect(() => {
		if (isTouchDevice) return;

		const canvas = canvasRef.current;
		if (!canvas) return;

		const resize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		resize();
		window.addEventListener('resize', resize);
		return () => window.removeEventListener('resize', resize);
	}, [isTouchDevice]);

	// Trail 애니메이션 루프 (Canvas + requestAnimationFrame)
	useEffect(() => {
		if (isTouchDevice) return;

		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const animate = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			const cursor = lastMousePos.current;
			const dots = trailDotsRef.current;
			const isDark = resolvedThemeRef.current !== 'light';
			const visible = isVisibleRef.current;

			// Global trail opacity: 부드럽게 등장/소멸
			if (visible) {
				trailOpacityRef.current = Math.min(
					1,
					trailOpacityRef.current + TRAIL_FADE_IN_SPEED,
				);
			} else {
				trailOpacityRef.current = Math.max(
					0,
					trailOpacityRef.current - TRAIL_FADE_OUT_SPEED,
				);
			}

			const globalOpacity = trailOpacityRef.current;

			if (globalOpacity > 0) {
				// 각 점 위치 업데이트 (lerp-based spring)
				// dots[0] → 커서를 직접 추적
				// dots[i] → dots[i-1]을 추적 (점점 지연)
				for (let i = 0; i < TRAIL_LENGTH; i++) {
					const target = i === 0 ? cursor : dots[i - 1];
					dots[i].x += (target.x - dots[i].x) * LERP_FACTOR;
					dots[i].y += (target.y - dots[i].y) * LERP_FACTOR;
				}

				// 뒤에서 앞으로 그리기 (앞쪽 점이 위에 렌더링)
				for (let i = TRAIL_LENGTH - 1; i >= 0; i--) {
					// i=0 → progress=1 (커서에 가장 가깝고 크고 불투명)
					// i=TRAIL_LENGTH-1 → progress=1/TRAIL_LENGTH (작고 투명)
					const progress = 1 - i / TRAIL_LENGTH;

					const radius =
						(TRAIL_MIN_SIZE + (TRAIL_MAX_SIZE - TRAIL_MIN_SIZE) * progress) / 2;
					const alpha = TRAIL_MAX_ALPHA * progress * globalOpacity;

					if (alpha < 0.005) continue;

					ctx.beginPath();
					ctx.arc(dots[i].x, dots[i].y, radius, 0, Math.PI * 2);
					ctx.fillStyle = isDark
						? `rgba(255,255,255,${alpha.toFixed(3)})`
						: `rgba(0,0,0,${alpha.toFixed(3)})`;
					ctx.fill();
				}
			}

			trailRafRef.current = requestAnimationFrame(animate);
		};

		trailRafRef.current = requestAnimationFrame(animate);

		return () => {
			if (trailRafRef.current) cancelAnimationFrame(trailRafRef.current);
		};
	}, [isTouchDevice]);

	// 마우스 움직임 추적 (requestAnimationFrame으로 최적화)
	const updateCursorPosition = useCallback(() => {
		cursorX.set(lastMousePos.current.x);
		cursorY.set(lastMousePos.current.y);
		rafRef.current = null;
	}, [cursorX, cursorY]);

	useEffect(() => {
		if (isTouchDevice) return;

		const handleMouseMove = (e: MouseEvent) => {
			lastMousePos.current = { x: e.clientX, y: e.clientY };

			if (!rafRef.current) {
				rafRef.current = requestAnimationFrame(updateCursorPosition);
			}

			setIsVisible(true);
		};

		const handleMouseLeave = () => setIsVisible(false);
		const handleMouseEnter = () => setIsVisible(true);

		document.addEventListener('mousemove', handleMouseMove, { passive: true });
		document.addEventListener('mouseleave', handleMouseLeave);
		document.addEventListener('mouseenter', handleMouseEnter);

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseleave', handleMouseLeave);
			document.removeEventListener('mouseenter', handleMouseEnter);
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
		};
	}, [isTouchDevice, updateCursorPosition]);

	// 호버 가능한 요소 & 텍스트 요소 감지
	useEffect(() => {
		if (isTouchDevice) return;

		const interactiveSelectors =
			'a, button, [role="button"], input, textarea, select, label, [data-cursor-hover]';
		const textSelectors =
			'p, h1, h2, h3, h4, h5, h6, span, li, blockquote, [data-cursor-text]';

		const handleInteractiveEnter = () => setCursorState('hover');
		const handleTextEnter = () =>
			setCursorState((prev) => (prev === 'hover' ? 'hover' : 'text'));
		const handleLeave = () => setCursorState('default');

		const addListeners = () => {
			document.querySelectorAll<Element>(interactiveSelectors).forEach((el) => {
				el.addEventListener('mouseenter', handleInteractiveEnter);
				el.addEventListener('mouseleave', handleLeave);
			});
			document.querySelectorAll<Element>(textSelectors).forEach((el) => {
				el.addEventListener('mouseenter', handleTextEnter);
				el.addEventListener('mouseleave', handleLeave);
			});
		};

		const removeListeners = () => {
			document.querySelectorAll<Element>(interactiveSelectors).forEach((el) => {
				el.removeEventListener('mouseenter', handleInteractiveEnter);
				el.removeEventListener('mouseleave', handleLeave);
			});
			document.querySelectorAll<Element>(textSelectors).forEach((el) => {
				el.removeEventListener('mouseenter', handleTextEnter);
				el.removeEventListener('mouseleave', handleLeave);
			});
		};

		// 초기 설정
		addListeners();

		// MutationObserver로 동적 요소 감지
		const observer = new MutationObserver(() => {
			removeListeners();
			addListeners();
		});

		observer.observe(document.body, { childList: true, subtree: true });

		return () => {
			removeListeners();
			observer.disconnect();
		};
	}, [isTouchDevice]);

	// 터치 디바이스에서는 렌더링하지 않음
	if (isTouchDevice) return null;

	const isDark = resolvedTheme ? resolvedTheme === 'dark' : true;
	const isHovering = cursorState === 'hover';
	const isText = cursorState === 'text';

	// 상태별 색상
	const dotColor = isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)';
	const ringBorderDefault = isDark
		? 'rgba(255,255,255,0.35)'
		: 'rgba(0,0,0,0.35)';
	const ringBorderHover = isDark
		? 'rgba(34,197,94,0.85)'
		: 'rgba(22,163,74,0.85)';
	const ringBgHover = isDark ? 'rgba(34,197,94,0.15)' : 'rgba(22,163,74,0.1)';

	return (
		<>
			{/* ── Trail Canvas (z-[9997], 커서 아래에 렌더링) ── */}
			<canvas
				ref={canvasRef}
				className="pointer-events-none fixed top-0 left-0 z-[9997]"
				style={{ willChange: 'transform' }}
			/>

			{/* ── 작은 점 커서 ── */}
			<motion.div
				className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference"
				style={{ x: smoothX, y: smoothY, willChange: 'transform' }}
				animate={{
					scale: isHovering ? 0 : 1,
					opacity: isVisible ? 1 : 0,
				}}
				transition={{
					scale: { duration: 0.15 },
					opacity: { duration: 0.15 },
				}}
			>
				<div
					className="rounded-full -translate-x-1/2 -translate-y-1/2"
					style={{ width: 8, height: 8, backgroundColor: dotColor }}
				/>
			</motion.div>

			{/* ── 큰 원 커서 ── */}
			<motion.div
				className="pointer-events-none fixed top-0 left-0 z-[9998]"
				style={{
					x: smoothX,
					y: smoothY,
					willChange: 'transform',
					// 텍스트 hover 시 mix-blend-difference 적용
					mixBlendMode: isText ? 'difference' : 'normal',
				}}
				animate={{
					scale: isHovering ? 1.6 : isText ? 1.2 : 1,
					opacity: isVisible ? 1 : 0,
				}}
				transition={{
					scale: { type: 'spring', damping: 20, stiffness: 300 },
					opacity: { duration: 0.15 },
				}}
			>
				<div
					className="rounded-full -translate-x-1/2 -translate-y-1/2 transition-colors duration-200"
					style={{
						width: 32,
						height: 32,
						border: `1.5px solid ${isHovering ? ringBorderHover : ringBorderDefault}`,
						backgroundColor: isHovering ? ringBgHover : 'transparent',
					}}
				/>
			</motion.div>

			{/* ── 기본 커서 숨기기 ── */}
			<style jsx global>{`
				* {
					cursor: none !important;
				}
			`}</style>
		</>
	);
}
