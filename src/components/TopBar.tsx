'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

const TopBar: React.FC = () => {
	const pathname = usePathname();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [navBarHidden, setNavBarHidden] = useState(false);
	const lastScrollY = useRef(0);

	const handleScroll = () => {
		const currentScrollY = window.scrollY;
		if (currentScrollY <= 0 || currentScrollY <= lastScrollY.current) {
			setNavBarHidden(false);
		} else {
			setNavBarHidden(true);
		}
		lastScrollY.current = currentScrollY;
	};

	useEffect(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const links = [
		{ path: '/skills', label: 'Skills' },
		{ path: '/projects', label: 'Projects' },
		{ path: '/careers', label: 'Careers' },
		{ path: '/blog', label: 'Blog' },
	];

	return (
		<nav
			className={`fixed top-0 w-full h-14 z-50 bg-background/80 backdrop-blur-sm border-b border-border transition-transform duration-200 ${
				navBarHidden ? '-translate-y-full' : ''
			}`}
		>
			<div className="h-14 max-w-4xl mx-auto px-6 flex items-center justify-between">
				<Link href="/" className="flex items-center gap-3 text-foreground hover:text-muted-foreground transition-colors">
					<Image
						src="/logo192.png"
						alt=""
						width={28}
						height={28}
						className="rounded-md"
					/>
					<span className="text-sm font-medium">Jisub Kim</span>
				</Link>

				{/* Desktop */}
				<div className="hidden md:flex items-center gap-6">
					{links.map((link) => (
						<Link
							key={link.path}
							href={link.path}
							className={`text-sm transition-colors ${
								pathname.startsWith(link.path)
									? 'text-foreground'
									: 'text-muted-foreground hover:text-foreground'
							}`}
						>
							{link.label}
						</Link>
					))}
				</div>

				{/* Mobile toggle */}
				<button
					onClick={() => setIsMenuOpen(!isMenuOpen)}
					className="md:hidden text-sm text-muted-foreground"
				>
					{isMenuOpen ? 'Close' : 'Menu'}
				</button>
			</div>

			{/* Mobile menu */}
			{isMenuOpen && (
				<div className="md:hidden bg-background border-b border-border">
					{links.map((link) => (
						<Link
							key={link.path}
							href={link.path}
							onClick={() => setIsMenuOpen(false)}
							className={`block px-6 py-3 text-sm border-b border-border last:border-0 ${
								pathname.startsWith(link.path)
									? 'text-foreground'
									: 'text-muted-foreground'
							}`}
						>
							{link.label}
						</Link>
					))}
				</div>
			)}
		</nav>
	);
};

export default TopBar;
