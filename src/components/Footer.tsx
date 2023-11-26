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
	return <footer className={`w-full h-16 bg-[#262626] text-white`}></footer>;
};

export default Footer;
