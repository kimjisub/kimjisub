import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';
import 'react-notion-x/src/styles.css';
import 'prismjs/themes/prism-tomorrow.css';
import 'katex/dist/katex.min.css';

import Footer from '@/components/Footer';
import TopBar from '@/components/TopBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: '김지섭 소개페이지',
	description: '보유 기술, 프로젝트, 경력 등을 소개합니다.',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html>
			<body className={inter.className}>
				<TopBar />
				{children}
				<Footer />
			</body>
		</html>
	);
}
