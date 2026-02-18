'use client';

import { useEffect, useRef, useState } from 'react';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import {
	faArrowRight,
	faBriefcase,
	faEnvelope,
	faFileCode,
	faFolderOpen,
	faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	animate,
	motion,
	useInView,
	useMotionValue,
	Variants,
} from 'framer-motion';
import Link from 'next/link';

// ─── Data ───────────────────────────────────────────────────────────────────

const socialLinks = [
	{
		name: 'GitHub',
		url: 'https://github.com/kimjisub',
		icon: faGithub,
		label: 'GitHub 프로필',
	},
	{
		name: 'LinkedIn',
		url: 'https://linkedin.com/in/kimjisub',
		icon: faLinkedin,
		label: 'LinkedIn 프로필',
	},
	{
		name: 'Email',
		url: 'mailto:0226daniel@gmail.com',
		icon: faEnvelope,
		label: '이메일 보내기',
	},
];

const navLinks = [
	{ href: '/skills', label: 'Skills', icon: faFileCode },
	{ href: '/projects', label: 'Projects', icon: faFolderOpen },
	{ href: '/careers', label: 'Careers', icon: faBriefcase },
	{ href: '/blog', label: 'Blog', icon: faFileCode },
];

const siteStats = [
	{ label: 'Projects', value: 20, suffix: '+' },
	{ label: 'Blog Posts', value: 15, suffix: '+' },
	{ label: 'Years Coding', value: 10, suffix: '+' },
];

// Current activity config — edit here to update status
const currentActivity = {
	role: 'CTO @ Alpaon',
	secondaryRole: 'Product Engineer @ Candid',
	updatedAt: '2026',
};

// ─── Variants ───────────────────────────────────────────────────────────────

const containerVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { staggerChildren: 0.08, delayChildren: 0.05 },
	},
};

const itemVariants: Variants = {
	hidden: { opacity: 0, y: 16 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.45, ease: 'easeOut' },
	},
};

// ─── Sub-components ─────────────────────────────────────────────────────────

/** Animated stat counter (0 → value on first view) */
function StatCounter({
	value,
	suffix = '',
	duration = 1.8,
}: {
	value: number;
	suffix?: string;
	duration?: number;
}) {
	const ref = useRef<HTMLSpanElement>(null);
	const isInView = useInView(ref, { once: true, margin: '-40px' });
	const mv = useMotionValue(0);
	const [display, setDisplay] = useState('0');

	useEffect(() => {
		return mv.on('change', (v) => setDisplay(Math.round(v).toLocaleString()));
	}, [mv]);

	useEffect(() => {
		if (isInView) {
			const c = animate(mv, value, { duration, ease: 'easeOut' });
			return c.stop;
		}
	}, [isInView, value, duration, mv]);

	return (
		<span ref={ref}>
			{display}
			{suffix}
		</span>
	);
}

/** Current activity widget */
function CurrentWidget() {
	return (
		<motion.div
			variants={itemVariants}
			className="flex flex-col gap-3 rounded-xl border border-border bg-card/40 px-5 py-4 backdrop-blur-sm"
		>
			<p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
				Currently
			</p>

			{/* Primary Role */}
			<div className="flex items-center gap-2">
				<FontAwesomeIcon
					icon={faBriefcase}
					className="h-3 w-3 text-accent/70 shrink-0"
				/>
				<span className="text-sm text-foreground font-medium">
					{currentActivity.role}
				</span>
			</div>

			{/* Secondary Role */}
			<div className="flex items-center gap-2">
				<FontAwesomeIcon
					icon={faBriefcase}
					className="h-3 w-3 text-muted-foreground/50 shrink-0"
				/>
				<span className="text-xs text-muted-foreground">
					{currentActivity.secondaryRole}
				</span>
			</div>

			{/* Updated */}
			<p className="text-[10px] text-muted-foreground/40">
				Updated {currentActivity.updatedAt}
			</p>
		</motion.div>
	);
}

/** Site stats row */
function SiteStats() {
	return (
		<motion.div
			variants={itemVariants}
			className="flex gap-6"
		>
			{siteStats.map((stat) => (
				<div key={stat.label} className="flex flex-col gap-0.5">
					<span className="text-lg font-semibold text-foreground tabular-nums">
						<StatCounter value={stat.value} suffix={stat.suffix} />
					</span>
					<span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">
						{stat.label}
					</span>
				</div>
			))}
		</motion.div>
	);
}

/** Newsletter signup placeholder */
function NewsletterBox() {
	const [value, setValue] = useState('');
	const [sent, setSent] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (value.trim()) setSent(true);
	};

	return (
		<motion.div variants={itemVariants} className="flex flex-col gap-2">
			<p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
				Newsletter
			</p>
			{sent ? (
				<motion.p
					initial={{ opacity: 0, y: 4 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-xs text-emerald-400"
				>
					Thanks! I&apos;ll reach out soon. ✨
				</motion.p>
			) : (
				<form
					onSubmit={handleSubmit}
					className="flex items-center gap-2"
					aria-label="뉴스레터 구독"
				>
					<label htmlFor="newsletter-email" className="sr-only">
						이메일 주소
					</label>
					<input
						id="newsletter-email"
						type="email"
						value={value}
						onChange={(e) => setValue(e.target.value)}
						placeholder="your@email.com"
						className="w-44 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-accent/50 transition"
						autoComplete="email"
					/>
					<motion.button
						type="submit"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-accent hover:border-accent/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-none transition-colors"
						aria-label="Subscribe"
					>
						<FontAwesomeIcon icon={faPaperPlane} className="h-3 w-3" />
					</motion.button>
				</form>
			)}
		</motion.div>
	);
}

// ─── Main Footer ─────────────────────────────────────────────────────────────

export default function Footer() {
	const ref = useRef<HTMLElement>(null);
	const isInView = useInView(ref, { once: true, margin: '-60px' });
	const currentYear = new Date().getFullYear();

	return (
		<footer
			ref={ref}
			className="relative mt-16 border-t border-border overflow-hidden"
		>
			{/* Subtle gradient glow */}
			<div
				className="pointer-events-none absolute inset-x-0 top-0 h-px"
				aria-hidden
			>
				<div className="mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
			</div>

			<div className="max-w-4xl mx-auto px-6 py-14">
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate={isInView ? 'visible' : 'hidden'}
					className="flex flex-col gap-10"
				>
					{/* ── Row 1: Brand + Nav + CurrentActivity ── */}
					<motion.div
						variants={itemVariants}
						className="flex flex-col sm:flex-row justify-between gap-8"
					>
						{/* Brand */}
						<div className="flex flex-col gap-3">
							<Link
								href="/"
								className="text-sm font-semibold text-foreground hover:text-accent transition-colors"
							>
								Jisub Kim
							</Link>
							<p className="text-xs text-muted-foreground max-w-[220px] leading-relaxed">
								CTO &amp; Product Engineer building software, firmware, and infrastructure.
							</p>
							<SiteStats />
						</div>

						{/* Right side: nav + current widget */}
						<div className="flex flex-col gap-6 sm:items-end">
							{/* Nav links with hover underline animation */}
							<nav aria-label="Footer navigation">
								<ul className="flex flex-wrap gap-x-6 gap-y-2 sm:justify-end">
									{navLinks.map((link) => (
										<li key={link.href}>
											<Link
												href={link.href}
												className="group relative flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
											>
												<FontAwesomeIcon
													icon={link.icon}
													className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity"
												/>
												<span>
													{link.label}
													<span className="absolute -bottom-px left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
												</span>
												<FontAwesomeIcon
													icon={faArrowRight}
													className="h-2.5 w-2.5 opacity-0 -translate-x-1 group-hover:opacity-70 group-hover:translate-x-0 transition-all duration-200"
												/>
											</Link>
										</li>
									))}
								</ul>
							</nav>

							{/* Current Activity */}
							<CurrentWidget />
						</div>
					</motion.div>

					{/* ── Divider ── */}
					<motion.div variants={itemVariants} className="h-px bg-border" />

					{/* ── Row 2: Copyright + Newsletter + Social ── */}
					<motion.div
						variants={itemVariants}
						className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
					>
						{/* Left: copyright */}
						<div className="flex flex-col gap-2">
							<p className="text-xs text-muted-foreground">
								© {currentYear} Jisub Kim. All rights reserved.
							</p>
						</div>

						{/* Middle: Newsletter */}
						<NewsletterBox />

						{/* Right: social icons */}
						<ul className="flex items-center gap-2" aria-label="Social links">
							{socialLinks.map((link) => (
								<motion.li
									key={link.name}
									whileHover={{ y: -3 }}
									whileTap={{ scale: 0.92 }}
									transition={{ type: 'spring', stiffness: 400, damping: 20 }}
								>
									<a
										href={link.url}
										target={link.url.startsWith('mailto') ? undefined : '_blank'}
										rel={
											link.url.startsWith('mailto')
												? undefined
												: 'noopener noreferrer'
										}
										aria-label={link.label}
										className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-accent/50 hover:bg-accent/5 transition-all duration-200"
									>
										<FontAwesomeIcon
											icon={link.icon}
											className="h-[15px] w-[15px]"
										/>
									</a>
								</motion.li>
							))}
						</ul>
					</motion.div>
				</motion.div>
			</div>
		</footer>
	);
}
