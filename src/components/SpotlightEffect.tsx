'use client';

import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function SpotlightEffect() {
	const { resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const [isVisible, setIsVisible] = useState(false);

	// Mouse position
	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);

	// Smooth spring animation
	const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
	const smoothX = useSpring(mouseX, springConfig);
	const smoothY = useSpring(mouseY, springConfig);

	// Create dynamic background using motion template (must be called unconditionally)
	const background = useMotionTemplate`radial-gradient(600px circle at ${smoothX}px ${smoothY}px, var(--spotlight-color), transparent 40%)`;

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			mouseX.set(e.clientX);
			mouseY.set(e.clientY);
			if (!isVisible) setIsVisible(true);
		};

		const handleMouseLeave = () => {
			setIsVisible(false);
		};

		window.addEventListener('mousemove', handleMouseMove);
		document.documentElement.addEventListener('mouseleave', handleMouseLeave);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
		};
	}, [mouseX, mouseY, isVisible]);

	// Don't render on server
	if (!mounted) return null;
	
	const isDark = resolvedTheme === 'dark';
	
	// Light mode: very subtle effect, Dark mode: accent-colored spotlight
	const spotlightColor = isDark 
		? 'rgba(34, 197, 94, 0.07)' // accent green with low opacity
		: 'rgba(22, 163, 74, 0.025)'; // even more subtle for light mode

	return (
		<motion.div
			className="fixed inset-0 pointer-events-none z-0"
			style={{
				// @ts-expect-error CSS custom property
				'--spotlight-color': spotlightColor,
				background,
				willChange: 'background',
			}}
			animate={{ opacity: isVisible ? 1 : 0 }}
			transition={{ duration: 0.3 }}
		/>
	);
}
