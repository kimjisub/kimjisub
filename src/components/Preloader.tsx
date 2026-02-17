'use client';

import { AnimatePresence, motion, Variants } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

// sessionStorage: 탭/브라우저를 닫으면 초기화 → "세션당 1회" 표시에 적합
// (localStorage를 쓰면 브라우저를 다시 열어도 표시되지 않음)
const PRELOADER_KEY = 'preloader-shown';

/** 프리로더가 보여지는 총 시간 (ms) — 이후 exit 애니메이션 시작 */
const DISPLAY_DURATION = 2600;

// ─── Variants ────────────────────────────────────────────────────────────────

const overlayVariants: Variants = {
	initial: {
		opacity: 1,
		y: 0,
	},
	exit: {
		opacity: 0,
		y: '-100%',
		transition: {
			duration: 0.85,
			ease: [0.76, 0, 0.24, 1],
		},
	},
};

const logoVariants: Variants = {
	initial: { scale: 0.5, opacity: 0, rotate: -20 },
	animate: {
		scale: 1,
		opacity: 1,
		rotate: 0,
		transition: { duration: 0.75, ease: [0.34, 1.56, 0.64, 1] },
	},
};

const nameContainerVariants: Variants = {
	initial: {},
	animate: {
		transition: { staggerChildren: 0.07, delayChildren: 0.65 },
	},
};

const charVariants: Variants = {
	initial: { opacity: 0, y: 24 },
	animate: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
	},
};

const subtitleVariants: Variants = {
	initial: { opacity: 0, y: 10 },
	animate: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5, delay: 1.35, ease: 'easeOut' },
	},
};

const progressBarVariants: Variants = {
	initial: { scaleX: 0 },
	animate: {
		scaleX: 1,
		transition: {
			duration: DISPLAY_DURATION / 1000 - 0.8,
			delay: 0.85,
			ease: 'easeInOut',
		},
	},
};

// ─── Component ────────────────────────────────────────────────────────────────

const NAME = 'Jisub Kim';

export default function Preloader() {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		// 이미 이번 세션에 표시한 적 있으면 스킵
		if (sessionStorage.getItem(PRELOADER_KEY)) return;

		sessionStorage.setItem(PRELOADER_KEY, '1');
		setIsVisible(true);

		const timer = setTimeout(() => setIsVisible(false), DISPLAY_DURATION);
		return () => clearTimeout(timer);
	}, []);

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					key="preloader"
					className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
					variants={overlayVariants}
					initial="initial"
					animate="initial" // 진입 애니메이션 없음 — 즉시 표시
					exit="exit"
				>
					{/* ── 중앙 콘텐츠 ── */}
					<div className="flex flex-col items-center gap-5 select-none">
						{/* 로고 */}
						<motion.div
							variants={logoVariants}
							initial="initial"
							animate="animate"
						>
							<Image
								src="/logo.svg"
								alt="Jisub Kim"
								width={84}
								height={84}
								priority
								className="drop-shadow-lg"
							/>
						</motion.div>

						{/* 이름 — 글자별 순차 등장 */}
						<motion.h1
							className="text-4xl font-bold tracking-tight text-foreground"
							variants={nameContainerVariants}
							initial="initial"
							animate="animate"
						>
							{NAME.split('').map((char, i) => (
								<motion.span
									key={i}
									variants={charVariants}
									style={{ display: 'inline-block' }}
									className={char === ' ' ? 'mr-2' : ''}
								>
									{char === ' ' ? '\u00A0' : char}
								</motion.span>
							))}
						</motion.h1>

						{/* 직함 */}
						<motion.p
							className="text-xs tracking-[0.3em] uppercase text-muted-foreground"
							variants={subtitleVariants}
							initial="initial"
							animate="animate"
						>
							CTO &amp; Product Engineer
						</motion.p>

						{/* 프로그레스 바 */}
						<motion.div
							className="mt-4 w-32 h-px bg-border rounded-full overflow-hidden"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1, transition: { delay: 0.8 } }}
						>
							<motion.div
								className="h-full bg-accent origin-left"
								variants={progressBarVariants}
								initial="initial"
								animate="animate"
							/>
						</motion.div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
