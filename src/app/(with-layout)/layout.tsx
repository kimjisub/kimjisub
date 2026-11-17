import type { Metadata } from 'next';
import { Inter, Newsreader } from 'next/font/google';

import '@radix-ui/themes/styles.css';
import 'katex/dist/katex.min.css';
import '@/styles/prism-theme.css';
import '../globals.css';

import { CommandPaletteWrapper } from '@/components/CommandPaletteWrapper';
import { FloatingTerminal } from '@/components/FloatingTerminal';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import { KeyboardShortcutsWrapper } from '@/components/KeyboardShortcutsWrapper';
import { SectionNavigation } from '@/components/SectionNavigation';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import { SkipToContent } from '@/components/SkipToContent';
import { ThemeProvider } from '@/components/ThemeProvider';
import TopBar from '@/components/TopBar';
import { TerminalProvider } from '@/context/TerminalContext';
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

const siteUrl = 'https://kimjisub.com';

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default: 'Jisub Kim | Founding Engineer',
		template: '%s | Jisub Kim',
	},
	description: 'Founding Engineer. 초기 제품의 기술 전부를 맡아, 사람 손 없이 돌아가는 제품으로 만듭니다. Co-founder and CTO (part-time) at Alpaon. Portfolio of projects, skills, and career experiences.',
	keywords: ['김지섭', 'Jisub Kim', 'Founding Engineer', 'Full Stack Developer', 'Alpaon', 'UniPad', '포트폴리오', 'Portfolio'],
	authors: [{ name: 'Jisub Kim', url: siteUrl }],
	creator: 'Jisub Kim',
	openGraph: {
		type: 'website',
		locale: 'ko_KR',
		alternateLocale: 'en_US',
		url: siteUrl,
		siteName: 'Jisub Kim Portfolio',
		title: 'Jisub Kim | Founding Engineer',
		description: 'Founding Engineer building products that run without hands-on work, from firmware to cloud and AI.',
		images: [
			{
				url: '/logo512.png',
				width: 512,
				height: 512,
				alt: 'Jisub Kim Profile',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Jisub Kim | Founding Engineer',
		description: 'Founding Engineer building products that run without hands-on work, from firmware to cloud and AI.',
		images: ['/logo512.png'],
		creator: '@kimjisub',
	},
	manifest: '/manifest.json',
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
	verification: {
		google: 'google-site-verification-code', // TODO: Add actual verification code
	},
	alternates: {
		types: {
			'application/rss+xml': `${siteUrl}/api/rss`,
		},
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ko" className={`${inter.variable} ${newsreader.variable}`} suppressHydrationWarning>
			<head>
				<JsonLd />
				<meta name="theme-color" content="#fafafa" />
				<meta name="color-scheme" content="light" />
				<link rel="apple-touch-icon" href="/logo192.png" />
			</head>
			<AppInfoProvider>
				<body className="font-sans bg-background text-foreground antialiased">
					<ThemeProvider>
						<SkipToContent />
						<ServiceWorkerRegistration />
						<CommandPaletteWrapper />
						<KeyboardShortcutsWrapper />
						<TerminalProvider>
							<SectionNavigation />
							<FloatingTerminal />
							<div className="min-h-screen flex flex-col">
								<TopBar />
								<main id="main-content" className="flex-grow pt-14" tabIndex={-1}>
									{children}
								</main>
								<Footer />
							</div>
						</TerminalProvider>
					</ThemeProvider>
				</body>
			</AppInfoProvider>
		</html>
	);
}
