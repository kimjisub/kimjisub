'use client';

import React from 'react';
import Link from 'next/link';

import { IconView } from '@/app/IconView';

// Footer 컴포넌트 정의
const Footer: React.FC = () => {
	return (
		<footer
			className={`w-full bg-[#262626] text-white flex flex-col justify-center items-center py-8`}>
			<div className={`flex justify-center items-center`}>
				<ul className="flex space-x-4">
					<li>
						<Link href="https://velog.io/@kimjisub">
							<IconView title="Velog" slug="velog" />
						</Link>
					</li>
					<li>
						<Link href="https://github.com/kimjisub">
							<IconView title="Github" slug="github" />
						</Link>
					</li>
					<li>
						<Link href="https://www.linkedin.com/in/kimjisub">
							<IconView title="Linkedin" slug="linkedin" />
						</Link>
					</li>
				</ul>
			</div>
			<div className={`flex justify-center items-center mt-4`}>
				<span className="text-md">© 2024 Jisub Kim All Rights Reserved.</span>
			</div>
		</footer>
	);
};

// Footer 컴포넌트를 export
export default Footer;
