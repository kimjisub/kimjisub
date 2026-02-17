'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useTheme } from 'next-themes';

type CursorState = 'default' | 'hover' | 'text';

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
	const ringBorderDefault = isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)';
	const ringBorderHover = isDark ? 'rgba(34,197,94,0.85)' : 'rgba(22,163,74,0.85)';
	const ringBgHover = isDark ? 'rgba(34,197,94,0.15)' : 'rgba(22,163,74,0.1)';

	return (
		<>
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
