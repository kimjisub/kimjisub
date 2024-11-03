'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { IconView } from '@/app/IconView';
import MaintainingBar from './MaintainingBar';

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
			className={`fixed top-0 w-full h-16 md:h-16 z-10 ${blur} transition-transform ${
				navBarHidden ? '-translate-y-full' : ''
			}`}>
			<div
				className={`h-16 mx-auto px-6 flex justify-between items-center container`}>
				<div className="flex items-center w-auto flex-grow justify-between">
					<Link href="/" className="text-xl font-bold mr-6 flex items-center">
						<Image
							src="/logo192.png"
							alt="logo"
							width={36}
							height={36}
							className="mr-4 rounded-full"
						/>
						jisub.kim
					</Link>

					<div className="flex">
						<p
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="text-md p-4 md:hidden cursor-pointer">
							메뉴
						</p>

						<ul
							className={[
								`absolute md:relative`,
								`md:flex`,
								`top-16 md:top-0`,
								`w-screen md:w-auto`,
								`left-0`,
								`transition-transform`,
								`${
									isMenuOpen
										? 'bg-white w-full'
										: '-translate-x-full opacity-0 md:opacity-100'
								} md:translate-x-0`,
							].join(' ')}>
							<li
								key="skills"
								className={`text-center md:text-left px-6 py-3 md:py-0 border-b md:border-none cursor-pointer ${
									pathname === '/skills'
										? 'text-blue-500 font-bold'
										: 'text-gray-600'
								}`}
								onClick={() => handleLinkClick('/skills')}>
								<p>Skills</p>
							</li>
							<li
								key="projects"
								className={`text-center md:text-left px-6 py-3 md:py-0 border-b md:border-none cursor-pointer ${
									pathname === '/projects'
										? 'text-blue-500 font-bold'
										: 'text-gray-600'
								}`}
								onClick={() => handleLinkClick('/projects')}>
								<p>Projects</p>
							</li>
							<li
								key="careers"
								className={`text-center md:text-left px-6 py-3 md:py-0 border-b md:border-none cursor-pointer ${
									pathname === '/careers'
										? 'text-blue-500 font-bold'
										: 'text-gray-600'
								}`}
								onClick={() => handleLinkClick('/careers')}>
								<p>Careers</p>
							</li>
							<li
								key="graph"
								className={`text-center md:text-left px-6 py-3 md:py-0 border-b md:border-none cursor-pointer ${
									pathname === '/graph'
										? 'text-blue-500 font-bold'
										: 'text-gray-600'
								}`}
								onClick={() => handleLinkClick('/graph')}>
								<p className="space-x-2">
									<span>Graph</span>
									<span className="badge bg-blue-500 text-white rounded-full px-2 py-1 text-xs">
										beta
									</span>
								</p>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<MaintainingBar />
		</nav>
	);
};

export default TopBar;
