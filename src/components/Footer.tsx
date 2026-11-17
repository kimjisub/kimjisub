'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';

const navLinks = [
	{ href: '/projects', label: 'Projects' },
	{ href: '/careers', label: 'Careers' },
	{ href: '/skills', label: 'Skills' },
	{ href: '/blog', label: 'Blog' },
];

const socialLinks = [
	{ href: 'https://github.com/kimjisub', label: 'GitHub', external: true },
	{ href: 'https://linkedin.com/in/kimjisub', label: 'LinkedIn', external: true },
	{ href: 'mailto:0226daniel@gmail.com', label: 'Email', external: false },
];

type SubscribeStatus = 'idle' | 'loading' | 'success' | 'error';

const footerLinkClass = 'text-sm text-muted-foreground transition-colors hover:text-foreground';

function NewsletterForm() {
	const [email, setEmail] = useState('');
	const [status, setStatus] = useState<SubscribeStatus>('idle');
	const [message, setMessage] = useState('');

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!email.trim()) return;

		setStatus('loading');
		try {
			const res = await fetch('/api/newsletter/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, source: 'footer' }),
			});
			const data = await res.json();
			if (res.ok) {
				setStatus('success');
				setMessage(data.message || '구독했습니다.');
			} else {
				setStatus('error');
				setMessage(data.error || '구독하지 못했습니다. 잠시 뒤 다시 시도해 주세요.');
			}
		} catch {
			setStatus('error');
			setMessage('네트워크 문제로 구독하지 못했습니다. 다시 시도해 주세요.');
		}
	};

	return (
		<form onSubmit={handleSubmit} aria-label="뉴스레터 구독" className="max-w-xs">
			<label htmlFor="newsletter-email" className="mb-2 block text-sm text-muted-foreground">
				새 글을 이메일로 받기
			</label>
			<div className="flex gap-2">
				<input
					id="newsletter-email"
					type="email"
					name="email"
					required
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="you@example.com"
					disabled={status === 'loading' || status === 'success'}
					autoComplete="email"
					className="min-w-0 flex-1 rounded-lg border border-border-strong bg-card px-3 py-2 text-base text-foreground placeholder:text-muted-foreground focus:border-ring disabled:opacity-60 sm:text-sm"
				/>
				<button
					type="submit"
					disabled={status === 'loading' || status === 'success'}
					className="rounded-lg border border-border-strong px-3.5 py-2 text-sm font-medium text-foreground transition-[scale,background-color] duration-150 ease-out hover:bg-muted enabled:active:scale-[0.96] disabled:opacity-60"
				>
					{status === 'loading' ? '구독 중…' : '구독'}
				</button>
			</div>
			<p role="status" className={`mt-2 min-h-5 text-sm ${status === 'error' ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'}`}>
				{status === 'success' || status === 'error' ? message : ''}
			</p>
		</form>
	);
}

export default function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="mt-16 border-t border-border">
			<div className="mx-auto flex max-w-5xl flex-col gap-10 px-5 py-12 md:px-6">
				<div className="flex flex-col justify-between gap-10 sm:flex-row">
					<div>
						<Link href="/" className="text-sm font-medium text-foreground">
							Jisub Kim
						</Link>
						<p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-muted-foreground">
							Founding Engineer building products that run without hands-on work, from firmware to cloud and AI.
						</p>
					</div>
					<NewsletterForm />
				</div>

				<div className="flex flex-col justify-between gap-6 border-t border-border pt-6 sm:flex-row sm:items-center">
					<nav aria-label="푸터 내비게이션">
						<ul className="flex flex-wrap gap-x-6 gap-y-2">
							{navLinks.map((link) => (
								<li key={link.href}>
									<Link href={link.href} className={footerLinkClass}>
										{link.label}
									</Link>
								</li>
							))}
							{socialLinks.map((link) => (
								<li key={link.href}>
									<a
										href={link.href}
										className={footerLinkClass}
										{...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
									>
										{link.label}
										{link.external && <span aria-hidden="true"> ↗</span>}
									</a>
								</li>
							))}
						</ul>
					</nav>
					<p className="text-sm text-muted-foreground">© {currentYear} Jisub Kim</p>
				</div>
			</div>
		</footer>
	);
}
