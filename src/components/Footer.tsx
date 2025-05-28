'use client';

import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faPenNib } from '@fortawesome/free-solid-svg-icons';

const socials = [
	{
		href: 'https://velog.io/@kimjisub',
		title: 'Velog',
		icon: faPenNib,
	},
	{
		href: 'https://github.com/kimjisub',
		title: 'Github',
		icon: faGithub,
	},
	{
		href: 'https://www.linkedin.com/in/kimjisub',
		title: 'Linkedin',
		icon: faLinkedin,
	},
];

const sitemap = [
	{
		href: '/',
		title: '홈',
	},
	{
		href: '/project',
		title: '프로젝트',
	},
	{
		href: '/blog',
		title: '블로그',
	},
];

const Footer: React.FC = () => {
	const currentYear = new Date().getFullYear();
	return (
		<footer className="w-full bg-[#23272f] text-white flex flex-col items-center pt-8 pb-4 border-t border-slate-800 mt-12 px-4">
			{/* 소셜 아이콘 */}
			<div className="flex flex-row justify-center items-center gap-7 mb-4 w-full max-w-xs">
				{socials.map((s) => (
					<Link
						key={s.title}
						href={s.href}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={s.title}
						className="group"
					>
						<span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-blue-600 transition-colors text-2xl group-hover:shadow-lg">
							<FontAwesomeIcon icon={s.icon} />
						</span>
					</Link>
				))}
			</div>
			{/* 사이트맵 */}
			<nav className="flex flex-row flex-wrap justify-center gap-x-6 gap-y-1 mb-3 text-xs text-slate-400 w-full max-w-xs">
				{sitemap.map((item) => (
					<Link
						key={item.title}
						href={item.href}
						className="hover:text-white transition-colors px-1 py-0.5 rounded"
					>
						{item.title}
					</Link>
				))}
			</nav>
			{/* 구분선 */}
			<div className="w-full max-w-xs border-t border-slate-700 my-2" />
			{/* 저작권/이름 */}
			<div className="text-xs text-slate-500 text-center mt-2 w-full max-w-xs">
				<span className="block font-semibold text-white">Jisub Kim</span>
				<span className="block">© {currentYear} All Rights Reserved.</span>
			</div>
		</footer>
	);
};

export default Footer;
