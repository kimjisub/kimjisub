'use client';

import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion, useInView, Variants } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';

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
	{ href: '/skills', label: 'Skills' },
	{ href: '/projects', label: 'Projects' },
	{ href: '/careers', label: 'Careers' },
	{ href: '/blog', label: 'Blog' },
];

const techStack = [
	{ label: 'Next.js', url: 'https://nextjs.org' },
	{ label: 'TypeScript', url: 'https://typescriptlang.org' },
	{ label: 'Framer Motion', url: 'https://framer.com/motion' },
	{ label: 'Tailwind CSS', url: 'https://tailwindcss.com' },
];

const containerVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.08,
			delayChildren: 0.05,
		},
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

export default function Footer() {
	const ref = useRef<HTMLElement>(null);
	const isInView = useInView(ref, { once: true, margin: '-60px' });
	const currentYear = new Date().getFullYear();

	return (
		<footer ref={ref} className="relative mt-16 border-t border-border overflow-hidden">
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
					{/* Top row: brand + nav */}
					<motion.div
						variants={itemVariants}
						className="flex flex-col sm:flex-row justify-between gap-8"
					>
						{/* Brand block */}
						<div className="flex flex-col gap-2">
							<Link
								href="/"
								className="text-sm font-semibold text-foreground hover:text-accent transition-colors"
							>
								Jisub Kim
							</Link>
							<p className="text-xs text-muted-foreground max-w-[220px] leading-relaxed">
								CTO &amp; Product Engineer building software, firmware, and infrastructure.
							</p>
						</div>

						{/* Nav links */}
						<nav aria-label="Footer navigation">
							<ul className="flex flex-wrap gap-x-6 gap-y-2">
								{navLinks.map((link) => (
									<li key={link.href}>
										<Link
											href={link.href}
											className="text-sm text-muted-foreground hover:text-foreground transition-colors"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</nav>
					</motion.div>

					{/* Divider */}
					<motion.div
						variants={itemVariants}
						className="h-px bg-border"
					/>

					{/* Bottom row: copyright + social + tech */}
					<motion.div
						variants={itemVariants}
						className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
					>
						{/* Left: copyright + tech stack */}
						<div className="flex flex-col gap-2">
							<p className="text-xs text-muted-foreground">
								© {currentYear} Jisub Kim. All rights reserved.
							</p>
							<p className="text-xs text-muted-foreground/70 flex flex-wrap gap-1 items-center">
								Built with{' '}
								{techStack.map((tech, i) => (
									<span key={tech.label}>
										<a
											href={tech.url}
											target="_blank"
											rel="noopener noreferrer"
											className="hover:text-accent transition-colors underline-offset-2 hover:underline"
										>
											{tech.label}
										</a>
										{i < techStack.length - 1 && (
											<span className="mx-0.5 opacity-50">·</span>
										)}
									</span>
								))}
							</p>
						</div>

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
										rel={link.url.startsWith('mailto') ? undefined : 'noopener noreferrer'}
										aria-label={link.label}
										className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-accent/50 hover:bg-accent/5 transition-all duration-200"
									>
										<FontAwesomeIcon icon={link.icon} className="h-[15px] w-[15px]" />
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
