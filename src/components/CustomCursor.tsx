'use client';

import { useCallback, useEffect, useRef,useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useTheme } from 'next-themes';

export default function CustomCursor() {
	const [isHovering, setIsHovering] = useState(false);
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
			const hasTouchPoints = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
			const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
			setIsTouchDevice(hasTouchPoints && isCoarsePointer);
		};
		
		checkTouchDevice();
		
		// 리사이즈 시 재확인
		window.addEventListener('resize', checkTouchDevice);
		return () => window.removeEventListener('resize', checkTouchDevice);
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
			
			if (!isVisible) setIsVisible(true);
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
	}, [isTouchDevice, isVisible, updateCursorPosition]);

	// 호버 가능한 요소 감지
	useEffect(() => {
		if (isTouchDevice) return;

		const interactiveSelectors = 'a, button, [role="button"], input, textarea, select, [data-cursor-hover]';
		
		const handleElementEnter = () => setIsHovering(true);
		const handleElementLeave = () => setIsHovering(false);

		const addListeners = () => {
			const elements = document.querySelectorAll(interactiveSelectors);
			elements.forEach((el) => {
				el.addEventListener('mouseenter', handleElementEnter);
				el.addEventListener('mouseleave', handleElementLeave);
			});
		};

		const removeListeners = () => {
			const elements = document.querySelectorAll(interactiveSelectors);
			elements.forEach((el) => {
				el.removeEventListener('mouseenter', handleElementEnter);
				el.removeEventListener('mouseleave', handleElementLeave);
			});
		};

		// 초기 설정
		addListeners();

		// MutationObserver로 동적 요소 감지
		const observer = new MutationObserver(() => {
			removeListeners();
			addListeners();
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});

		return () => {
			removeListeners();
			observer.disconnect();
		};
	}, [isTouchDevice]);

	// 터치 디바이스에서는 렌더링하지 않음
	if (isTouchDevice) return null;

	// resolvedTheme이 없으면 시스템 테마 감지, 기본 다크
	const isDark = resolvedTheme ? resolvedTheme === 'dark' : true;
	const cursorColor = isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
	const cursorBorderColor = isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)';

	return (
		<>
			{/* 메인 커서 (작은 점) */}
			<motion.div
				className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference"
				style={{
					x: smoothX,
					y: smoothY,
					willChange: 'transform',
				}}
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
					style={{
						width: 8,
						height: 8,
						backgroundColor: cursorColor,
					}}
				/>
			</motion.div>

			{/* 아웃라인 커서 (큰 원) */}
			<motion.div
				className="pointer-events-none fixed top-0 left-0 z-[9998]"
				style={{
					x: smoothX,
					y: smoothY,
					willChange: 'transform',
				}}
				animate={{
					scale: isHovering ? 1.5 : 1,
					opacity: isVisible ? 1 : 0,
				}}
				transition={{
					scale: { type: 'spring', damping: 20, stiffness: 300 },
					opacity: { duration: 0.15 },
				}}
			>
				<div
					className="rounded-full -translate-x-1/2 -translate-y-1/2"
					style={{
						width: 32,
						height: 32,
						border: `1.5px solid ${cursorBorderColor}`,
						backgroundColor: isHovering 
							? (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)') 
							: 'transparent',
					}}
				/>
			</motion.div>

			{/* 기본 커서 숨기기 */}
			<style jsx global>{`
				* {
					cursor: none !important;
				}
			`}</style>
		</>
	);
}
