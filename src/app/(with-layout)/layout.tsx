import { Theme } from '@radix-ui/themes';
import type { Metadata } from 'next';
import { Inter, Newsreader } from 'next/font/google';

import '../globals.css';
import '@/styles/prism-theme.css';
import 'react-notion-x/src/styles.css';
import 'katex/dist/katex.min.css';
import '@radix-ui/themes/styles.css';

import Footer from '@/components/Footer';
import TopBar from '@/components/TopBar';
import { AppInfoProvider } from '@/contexts/AppInfoContext';

const inter = Inter({ 
	subsets: ['latin'],
	variable: '--font-sans',
});

const newsreader = Newsreader({ 
	subsets: ['latin'],
	variable: '--font-serif',
	weight: ['400', '500', '600'],
	style: ['normal', 'italic'],
});

export const metadata: Metadata = {
	title: 'Jisub Kim',
	description: 'CTO, Product Engineer, Builder',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html className={`${inter.variable} ${newsreader.variable}`}>
			<AppInfoProvider>
				<body className="font-sans bg-background text-foreground antialiased">
					<Theme appearance="dark">
						<div className="min-h-screen flex flex-col">
							<TopBar />
							<main className="flex-grow">{children}</main>
							<Footer />
						</div>
					</Theme>
				</body>
			</AppInfoProvider>
		</html>
	);
}
