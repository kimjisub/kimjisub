'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';

interface Section {
	id: string;
	title: string;
	path: string;
}

const sections: (Section | null)[] = [
	{ id: 'skills', title: 'Skills', path: '/skills' },
	{ id: 'projects', title: 'Projects', path: '/projects' },
	{ id: 'careers', title: 'Careers', path: '/careers' },
	null,
	{ id: 'blog', title: 'Blog', path: 'https://blog.jisub.kim' },
	{ id: 'github', title: 'Github', path: 'https://github.com/kimjisub' },
];

const blur = 'bg-white bg-opacity-60 backdrop-filter backdrop-blur-lg';

const TopBar: React.FC = () => {
	const router = useRouter();
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

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	const handleLinkClick = (path: string) => {
		setIsMenuOpen(false);

		if (path.startsWith('http://') || path.startsWith('https://')) {
			window.location.href = path;
		} else {
			router.push(path);
		}
	};

	return (
		<nav
			className={`fixed top-0 left-0 w-full h-16 md:h-16 z-10 ${blur} transition-transform ${
				navBarHidden ? '-translate-y-full' : ''
			}`}
		>
			<div
				className={`h-16 max-w-5xl mx-auto px-6 flex justify-between items-center `}
			>
				<div className="flex items-center w-auto flex-grow justify-between">
					<Link href="/" className="text-xl font-bold mr-6 flex items-center">
						<Image
							src="/logo192.png"
							alt="logo"
							width={36}
							height={36}
							className="mr-4"
						/>
						jisub.kim
					</Link>

					<p
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						className="text-md p-4 md:hidden cursor-pointer"
					>
						메뉴
					</p>

					<ul
						className={[
							`absolute md:relative md:flex`,
							`top-16 md:top-0`,
							`bg-white md:bg-transparent`,
							`w-screen md:w-auto `,
							`left-0  md:flex`,
							`md:w-auto md:flex-grow`,
							`transition-transform ${
								isMenuOpen ? '' : '-translate-x-full opacity-0 md:opacity-100'
							} md:translate-x-0`,
						].join(' ')}
					>
						{sections.map((section, index) =>
							section ? (
								<li
									key={section.id}
									className={`text-center md:text-left px-6 py-3 md:py-0 border-b md:border-none cursor-pointer ${
										pathname === section.path
											? 'text-blue-500 font-bold'
											: 'text-gray-600'
									}`}
									onClick={() => handleLinkClick(section.path)}
								>
									<p>{section.title}</p>
								</li>
							) : (
								<li key={`space-${index}`} className="md:flex-grow" />
							)
						)}
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default TopBar;
