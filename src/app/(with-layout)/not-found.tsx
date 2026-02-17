'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
	return (
		<div className="min-h-[70vh] flex flex-col items-center justify-center px-6 relative overflow-hidden">
			{/* Subtle background gradient */}
			<div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent pointer-events-none" />
			
			<div className="relative z-10 text-center max-w-md">
				{/* 404 Number with staggered animation */}
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

				{/* Action buttons */}
				<motion.div
					className="flex flex-col sm:flex-row gap-3 justify-center"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.35 }}
				>
					<Link 
						href="/"
						className="px-6 py-3 rounded-lg bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
					>
						홈으로 돌아가기
					</Link>
					<Link 
						href="/projects"
						className="px-6 py-3 rounded-lg bg-card border border-border text-foreground font-medium hover:border-foreground/30 transition-colors"
					>
						프로젝트 둘러보기
					</Link>
				</motion.div>

				{/* Quick links */}
				<motion.div
					className="mt-12 pt-8 border-t border-border/50"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.5 }}
				>
					<p className="text-sm text-muted-foreground mb-4">또는 다른 페이지 방문하기</p>
					<div className="flex flex-wrap gap-2 justify-center">
						{[
							{ href: '/blog', label: 'Blog' },
							{ href: '/careers', label: 'Careers' },
							{ href: '/skills', label: 'Skills' },
						].map((link, index) => (
							<motion.div
								key={link.href}
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.3, delay: 0.55 + index * 0.05 }}
							>
								<Link
									href={link.href}
									className="px-4 py-2 text-sm rounded-lg bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
								>
									{link.label}
								</Link>
							</motion.div>
						))}
					</div>
				</motion.div>
			</div>
		</div>
	);
}
