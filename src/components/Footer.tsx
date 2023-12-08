'use client';

import React from 'react';
import Link from 'next/link';

// Footer 컴포넌트 정의
const Footer: React.FC = () => {
	return (
		<footer
			className={`w-full h-24 bg-[#262626] text-white flex flex-col justify-center items-center`}>
			<div className={`flex justify-center items-center`}>
				<li className="mx-4">
					<Link href="https://blog.jisub.kim">
						<span className="text-lg">Blog</span>
					</Link>
				</li>
				<li className="mx-4">
					<Link href="https://github.com/kimjisub">
						<span className="text-lg">Github</span>
					</Link>
				</li>
				<li className="mx-4">
					<Link href="https://www.linkedin.com/in/kimjisub">
						<span className="text-lg">LinkedIn</span>
					</Link>
				</li>
			</div>
			<div className={`flex justify-center items-center mt-4`}>
				<span className="text-md">© 2023 jisub.kim</span>
			</div>
		</footer>
	);
};

// Footer 컴포넌트를 export
export default Footer;
