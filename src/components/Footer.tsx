'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

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

const Footer: React.FC = () => {
	return (
		<footer className={`w-full h-16 bg-[#262626] text-white`}>
			<div
				className={`h-16 max-w-5xl mx-auto px-6 flex justify-between items-center `}>
				<div className="flex items-center w-auto flex-grow justify-between">
					<ul
						className={[
							`absolute md:relative md:flex`,
							`top-16 md:top-0`,
							`bg-white md:bg-transparent`,
							`w-screen md:w-auto `,
							`left-0  md:flex`,
							`md:w-auto md:flex-grow`,
						].join(' ')}>
						{sections.map((section, index) =>
							section ? (
								<li
									key={section.id}
									className={`text-center md:text-left px-6 py-3 md:py-0 border-b md:border-none cursor-pointer`}
									// onClick={() => handleLinkClick(section.path)}
								>
									<p>{section.title}</p>
								</li>
							) : (
								<li key={`space-${index}`} className="md:flex-grow" />
							),
						)}
					</ul>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
