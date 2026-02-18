'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NotFoundPage() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden bg-background">
			{/* Subtle background gradient */}
			<div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent pointer-events-none" />
			
			<div className="relative z-10 text-center max-w-md">
				{/* 404 Number */}
				<motion.div
					className="mb-8"
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5, ease: 'easeOut' }}
				>
					<h1 className="font-serif italic text-8xl md:text-9xl text-foreground/10 select-none">
						404
					</h1>
				</motion.div>

				{/* Main message */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.15 }}
				>
					<h2 className="font-serif italic text-2xl md:text-3xl text-foreground mb-3">
						Page not found
					</h2>
				</motion.div>

				<motion.p
					className="text-muted-foreground mb-10 leading-relaxed"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.25 }}
				>
					찾으시는 페이지가 존재하지 않거나 이동되었을 수 있습니다.
				</motion.p>

				{/* Home button */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.35 }}
				>
					<Link 
						href="/"
						className="inline-block px-6 py-3 rounded-lg bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
					>
						홈으로 돌아가기
					</Link>
				</motion.div>
			</div>
		</div>
	);
}
