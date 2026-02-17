import type { Metadata } from 'next';
import { Inter, Newsreader } from 'next/font/google';

import '@radix-ui/themes/styles.css';
import 'katex/dist/katex.min.css';
import 'react-notion-x/src/styles.css';

import '@/styles/prism-theme.css';

import '../globals.css';

import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
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
		<html className={`${inter.variable} ${newsreader.variable}`} suppressHydrationWarning>
			<AppInfoProvider>
				<body className="font-sans bg-background text-foreground antialiased">
					<ThemeProvider>
						<div className="min-h-screen flex flex-col">
							<TopBar />
							<main className="flex-grow">{children}</main>
							<Footer />
						</div>
					</ThemeProvider>
				</body>
			</AppInfoProvider>
		</html>
	);
}
