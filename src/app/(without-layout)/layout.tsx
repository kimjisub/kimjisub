import { Theme } from '@radix-ui/themes';
import type { Metadata } from 'next';
import { DM_Sans, Space_Grotesk } from 'next/font/google';

import '../globals.css';
import 'react-notion-x/src/styles.css';
import 'prismjs/themes/prism-tomorrow.css';
import 'katex/dist/katex.min.css';
import '@radix-ui/themes/styles.css';

import CustomCursor from '@/components/CustomCursor';
import { AppInfoProvider } from '@/contexts/AppInfoContext';

const spaceGrotesk = Space_Grotesk({ 
	subsets: ['latin'],
	variable: '--font-heading',
	weight: ['400', '500', '600', '700'],
});

const dmSans = DM_Sans({ 
	subsets: ['latin'],
	variable: '--font-body',
	weight: ['400', '500', '700'],
});

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
		<html className={`${spaceGrotesk.variable} ${dmSans.variable}`}>
			<Theme appearance="dark">
				<AppInfoProvider>
					<body className="font-body bg-background text-foreground">
						<CustomCursor />
						{children}
					</body>
				</AppInfoProvider>
			</Theme>
		</html>
	);
}
