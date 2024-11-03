import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import '../globals.css';
import 'react-notion-x/src/styles.css';
import 'prismjs/themes/prism-tomorrow.css';
import 'katex/dist/katex.min.css';

import Footer from '@/components/Footer';
import TopBar from '@/components/TopBar';
import { AppInfoProvider } from '@/contexts/AppInfoContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Jisub Kim, Software Engineer',
	description: '보유 기술, 프로젝트, 경력 등을 소개합니다.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html>
			<AppInfoProvider>
				<body className={`flex flex-col min-h-screen ${inter.className}`}>
					<TopBar />
					<main className="flex-grow">{children}</main>
					<Footer />
				</body>
			</AppInfoProvider>
		</html>
	);
}
