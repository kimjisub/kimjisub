'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const PRELOADER_KEY = 'kimjisub_preloader_shown';

export default function Preloader() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		// 첫 방문 시에만 표시
		const shown = sessionStorage.getItem(PRELOADER_KEY);
		if (!shown) {
			setVisible(true);
			sessionStorage.setItem(PRELOADER_KEY, '1');

			// 1.6초 후 사라짐
			const timer = setTimeout(() => setVisible(false), 1600);
			return () => clearTimeout(timer);
		}
	}, []);

	return (
		<AnimatePresence>
			{visible && (
				<motion.div
					key="preloader"
					className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
					initial={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.5, ease: 'easeInOut' }}
				>
					{/* 로고 */}
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.4, ease: 'easeOut' }}
					>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src="/logo.svg"
							alt="Jisub Kim Logo"
							width={72}
							height={72}
							className="rounded-xl"
						/>
					</motion.div>

					{/* 이름 */}
					<motion.p
						className="mt-4 text-sm tracking-[0.25em] text-foreground/50 font-sans uppercase"
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, delay: 0.25, ease: 'easeOut' }}
					>
						Jisub Kim
					</motion.p>

					{/* 로딩 바 */}
					<motion.div
						className="mt-8 h-[2px] w-32 rounded-full overflow-hidden bg-foreground/10"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3 }}
					>
						<motion.div
							className="h-full bg-foreground/60 rounded-full"
							initial={{ width: '0%' }}
							animate={{ width: '100%' }}
							transition={{ duration: 1.0, delay: 0.4, ease: 'easeInOut' }}
						/>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
