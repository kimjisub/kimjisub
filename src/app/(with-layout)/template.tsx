'use client';

import { motion, Variants } from 'framer-motion';

const pageVariants: Variants = {
	initial: {
		opacity: 0,
		y: 10,
	},
	animate: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.3,
			ease: [0.25, 0.46, 0.45, 0.94],
		},
	},
	exit: {
		opacity: 0,
		transition: {
			duration: 0.2,
			ease: [0.25, 0.46, 0.45, 0.94],
		},
	},
};

/**
 * 페이지 트랜지션 템플릿
 * Next.js의 template.tsx는 페이지 이동 시마다 re-mount됨.
 * - 진입: fade in + 위로 슬라이드 (0.3s)
 * - 퇴장: fade out (0.2s)
 */
export default function Template({ children }: { children: React.ReactNode }) {
	return (
		<motion.div
			variants={pageVariants}
			initial="initial"
			animate="animate"
			exit="exit"
		>
			{children}
		</motion.div>
	);
}
