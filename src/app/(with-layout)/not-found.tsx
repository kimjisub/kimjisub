'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { motion } from 'framer-motion';

/* ── floating code snippets ── */
const CODE_SNIPPETS = [
	'git checkout main',
	'npm run 404',
	'undefined',
	'null',
	'NaN',
	'> cd ..',
	'Error: ENOENT',
	'HTTP 404',
	'0x00000000',
	'notFound()',
	'throw new Error()',
	'// TODO: fix',
	'git status',
	'HEAD detached',
	'catch(err) {}',
	'return null;',
	'<Route path="*" />',
	'404.tsx',
	'[...slug]',
	'useRouter()',
	'res.status(404)',
	'Promise.reject()',
];

/* ── terminal messages ── */
const TERMINAL_STEPS = [
	{ text: '$ curl https://kimjisub.com/this-page', delay: 0, type: 'cmd' },
	{ text: '> Error 404: No such route exists', delay: 800, type: 'err' },
	{ text: '$ git checkout -- .', delay: 1800, type: 'cmd' },
	{ text: '> Already up to date.', delay: 2600, type: 'muted' },
	{ text: '$ find / -name "page.tsx"', delay: 3600, type: 'cmd' },
	{ text: '> find: permission denied', delay: 4400, type: 'err' },
	{ text: '$ sudo find the lost page', delay: 5400, type: 'cmd' },
	{ text: '> sudo: command not found', delay: 6200, type: 'err' },
	{ text: '$ git log --all --oneline', delay: 7200, type: 'cmd' },
	{ text: '> a3f9b12 Last seen: somewhere in hyperspace', delay: 8000, type: 'muted' },
	{ text: '$ _', delay: 9000, type: 'cmd' },
];

const TYPE_COLOR: Record<string, string> = {
	cmd: 'var(--accent)',
	err: '#f87171',
	muted: 'var(--muted-foreground)',
};

/* ── particle type ── */
interface Particle {
	id: number;
	text: string;
	x: number;
	y: number;
	duration: number;
	delay: number;
	opacity: number;
	size: number;
	xDrift: number;
}

function useParticles(count = 20): Particle[] {
	const [particles, setParticles] = useState<Particle[]>([]);
	useEffect(() => {
		const ps: Particle[] = Array.from({ length: count }, (_, i) => ({
			id: i,
			text: CODE_SNIPPETS[i % CODE_SNIPPETS.length],
			x: Math.random() * 100,
			y: Math.random() * 100,
			duration: 14 + Math.random() * 18,
			delay: Math.random() * 8,
			opacity: 0.05 + Math.random() * 0.1,
			size: 10 + Math.random() * 6,
			xDrift: (Math.random() - 0.5) * 160,
		}));
		setParticles(ps);
	}, [count]);
	return particles;
}

/* ── glitch hook ── */
const GLITCH_CHARS = '!<>-_\\/[]{}—=+*^?#';
function useGlitch(text: string, active: boolean) {
	const [display, setDisplay] = useState(text);
	const frameRef = useRef<ReturnType<typeof setInterval> | null>(null);

	useEffect(() => {
		if (!active) {
			setDisplay(text);
			return;
		}
		let iter = 0;
		const interval = setInterval(() => {
			setDisplay(
				text
					.split('')
					.map((char, i) => {
						if (i < iter) return char;
						return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
					})
					.join(''),
			);
			iter += 0.35;
			if (iter >= text.length) clearInterval(interval);
		}, 28);
		frameRef.current = interval;
		return () => clearInterval(interval);
	}, [active, text]);

	return display;
}

/* ── terminal line component ── */
function TerminalLine({
	text,
	type,
	delay,
}: {
	text: string;
	type: string;
	delay: number;
}) {
	const [visible, setVisible] = useState(false);
	const [typed, setTyped] = useState('');
	const isLast = text === '$ _';

	useEffect(() => {
		const showTimer = setTimeout(() => {
			setVisible(true);
			if (isLast) {
				setTyped('$ ');
				return;
			}
			let i = 0;
			const typeInterval = setInterval(() => {
				setTyped(text.slice(0, ++i));
				if (i >= text.length) clearInterval(typeInterval);
			}, 22);
			return () => clearInterval(typeInterval);
		}, delay);
		return () => clearTimeout(showTimer);
	}, [text, delay, isLast]);

	if (!visible) return null;

	return (
		<motion.div
			initial={{ opacity: 0, x: -4 }}
			animate={{ opacity: 1, x: 0 }}
			style={{ color: TYPE_COLOR[type] ?? 'inherit' }}
			className="font-mono text-xs sm:text-sm leading-relaxed whitespace-nowrap"
		>
			{typed}
			{(typed.length < text.length || isLast) && (
				<motion.span
					animate={{ opacity: [1, 0] }}
					transition={{ repeat: Infinity, duration: 0.6 }}
					className="inline-block w-[2px] h-[14px] align-middle ml-0.5 bg-current"
				/>
			)}
		</motion.div>
	);
}

/* ── suggested links ── */
const LINKS = [
	{ href: '/', label: '/ home', icon: '🏠' },
	{ href: '/projects', label: '/projects', icon: '🚀' },
	{ href: '/careers', label: '/careers', icon: '💼' },
	{ href: '/skills', label: '/skills', icon: '⚡' },
	{ href: '/blog', label: '/blog', icon: '📝' },
];

/* ════════════════════════════════════════════
   Main Component
════════════════════════════════════════════ */
export default function NotFoundPage() {
	const [glitchActive, setGlitchActive] = useState(false);
	const particles = useParticles(20);
	const glitched = useGlitch('404', glitchActive);

	/* periodic glitch trigger */
	useEffect(() => {
		const trigger = () => {
			setGlitchActive(true);
			setTimeout(() => setGlitchActive(false), 900);
		};
		trigger(); // initial on mount
		const id = setInterval(trigger, 4500);
		return () => clearInterval(id);
	}, []);

	return (
		<div className="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden px-6 py-16">

			{/* ── CSS for glitch keyframes ── */}
			<style dangerouslySetInnerHTML={{ __html: `
				@keyframes glitch-clip-1 {
					0%   { clip-path: inset(20% 0 60% 0); transform: translate(-4px, 0); }
					20%  { clip-path: inset(70% 0 10% 0); transform: translate(4px, 0); }
					40%  { clip-path: inset(40% 0 40% 0); transform: translate(-2px, 0); }
					60%  { clip-path: inset(90% 0 2%  0); transform: translate(3px, 0); }
					80%  { clip-path: inset(5%  0 80% 0); transform: translate(-3px, 0); }
					100% { clip-path: inset(20% 0 60% 0); transform: translate(0, 0); }
				}
				@keyframes glitch-clip-2 {
					0%   { clip-path: inset(60% 0 20% 0); transform: translate(4px, 0); }
					20%  { clip-path: inset(10% 0 70% 0); transform: translate(-4px, 0); }
					40%  { clip-path: inset(50% 0 30% 0); transform: translate(2px, 0); }
					60%  { clip-path: inset(2%  0 90% 0); transform: translate(-3px, 0); }
					80%  { clip-path: inset(80% 0 5%  0); transform: translate(3px, 0); }
					100% { clip-path: inset(60% 0 20% 0); transform: translate(0, 0); }
				}
				.glitch-l1 {
					animation: glitch-clip-1 0.18s steps(1) infinite;
					position: absolute;
					inset: 0;
					color: #22c55e;
					opacity: 0.5;
				}
				.glitch-l2 {
					animation: glitch-clip-2 0.22s steps(1) infinite;
					position: absolute;
					inset: 0;
					color: #3b82f6;
					opacity: 0.4;
				}
			` }} />

			{/* ── Background gradient ── */}
			<div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent pointer-events-none" />
			<div className="absolute inset-0 bg-gradient-to-br from-accent/3 via-transparent to-blue-500/3 pointer-events-none" />

			{/* ── Floating code particles ── */}
			<div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
				{particles.map((p) => (
					<motion.span
						key={p.id}
						className="absolute font-mono text-foreground"
						style={{
							left: `${p.x}%`,
							top: `${p.y}%`,
							fontSize: p.size,
							opacity: 0,
						}}
						animate={{
							y: [0, -200],
							x: [0, p.xDrift],
							opacity: [0, p.opacity, p.opacity, 0],
						}}
						transition={{
							duration: p.duration,
							delay: p.delay,
							repeat: Infinity,
							ease: 'linear',
						}}
					>
						{p.text}
					</motion.span>
				))}
			</div>

			{/* ── Main content ── */}
			<div className="relative z-10 w-full max-w-2xl mx-auto text-center">

				{/* ── Glitch 404 ── */}
				<motion.div
					className="relative mb-3 select-none"
					initial={{ opacity: 0, scale: 0.85 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
				>
					<div className="relative inline-block">
						{/* base */}
						<h1
							className="font-serif italic leading-none text-foreground/[0.08]"
							style={{ fontSize: 'clamp(7rem, 24vw, 16rem)' }}
						>
							{glitched}
						</h1>
						{/* glitch layers */}
						{glitchActive && (
							<>
								<h1
									aria-hidden
									className="glitch-l1 font-serif italic leading-none"
									style={{ fontSize: 'clamp(7rem, 24vw, 16rem)' }}
								>
									{glitched}
								</h1>
								<h1
									aria-hidden
									className="glitch-l2 font-serif italic leading-none"
									style={{ fontSize: 'clamp(7rem, 24vw, 16rem)' }}
								>
									{glitched}
								</h1>
							</>
						)}
					</div>
				</motion.div>

				{/* ── Error badge ── */}
				<motion.div
					className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/[0.08] text-red-500 font-mono text-xs mb-6"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					<span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
					STATUS 404 · PAGE_NOT_FOUND
				</motion.div>

				{/* ── Heading ── */}
				<motion.h2
					className="font-serif italic text-2xl sm:text-3xl text-foreground mb-3"
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
				>
					This page wandered off into the void
				</motion.h2>

				<motion.p
					className="text-muted-foreground mb-8 leading-relaxed text-sm sm:text-base"
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
				>
					찾으시는 페이지가 삭제되었거나, 주소가 바뀌었거나, 애초에 존재하지 않았을 수 있습니다.
					<br />
					<span className="font-mono text-accent text-xs">git checkout main</span>
					{' '}하시고 처음부터 시작해 보세요.
				</motion.p>

				{/* ── Terminal window ── */}
				<motion.div
					className="text-left rounded-xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden mb-8 shadow-xl"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
				>
					{/* title bar */}
					<div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
						<div className="flex gap-1.5">
							<div className="w-3 h-3 rounded-full bg-red-500/80" />
							<div className="w-3 h-3 rounded-full bg-yellow-500/80" />
							<div className="w-3 h-3 rounded-full bg-green-500/80" />
						</div>
						<span className="text-muted-foreground text-xs font-mono ml-2">
							zsh — kimjisub@server:~
						</span>
					</div>
					{/* terminal body */}
					<div className="p-4 space-y-0.5 min-h-[160px] max-h-[220px] overflow-hidden">
						{TERMINAL_STEPS.map((step, i) => (
							<TerminalLine key={i} text={step.text} type={step.type} delay={step.delay} />
						))}
					</div>
				</motion.div>

				{/* ── CTA buttons ── */}
				<motion.div
					className="flex flex-col sm:flex-row gap-3 justify-center mb-10"
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6 }}
				>
					<motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
						<Link
							href="/"
							className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-accent text-accent-foreground font-medium text-sm transition-opacity hover:opacity-90"
						>
							<span className="font-mono opacity-60">~/</span>
							홈으로 돌아가기
						</Link>
					</motion.div>
					<motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
						<button
							onClick={() => window.history.back()}
							className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border bg-card text-foreground font-medium text-sm hover:border-foreground/30 hover:bg-muted transition-all"
						>
							<span className="font-mono text-muted-foreground">←</span>
							이전 페이지
						</button>
					</motion.div>
				</motion.div>

				{/* ── Suggested navigation ── */}
				<motion.div
					className="pt-6 border-t border-border/40"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.75 }}
				>
					<p className="text-xs text-muted-foreground mb-4 font-mono">
						{'// '}<span className="text-accent">suggested</span>{' routes:'}
					</p>
					<div className="flex flex-wrap gap-2 justify-center">
						{LINKS.map((link, i) => (
							<motion.div
								key={link.href}
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.8 + i * 0.06 }}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.97 }}
							>
								<Link
									href={link.href}
									className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/60 border border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary hover:border-foreground/20 transition-all text-xs font-mono"
								>
									<span>{link.icon}</span>
									{link.label}
								</Link>
							</motion.div>
						))}
					</div>
				</motion.div>

				{/* ── Error code footer ── */}
				<motion.p
					className="mt-8 text-xs font-mono text-muted-foreground/30 tracking-widest"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1.2 }}
				>
					ERR_NOT_FOUND · 0x00000404 · kimjisub.com
				</motion.p>
			</div>
		</div>
	);
}
