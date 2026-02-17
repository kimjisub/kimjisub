import type { Metadata } from 'next';
import { Inter, Newsreader } from 'next/font/google';

import '@radix-ui/themes/styles.css';
import 'katex/dist/katex.min.css';
import 'react-notion-x/src/styles.css';
import '@/styles/prism-theme.css';
import '../globals.css';

import BackToTop from '@/components/BackToTop';
import CustomCursor from '@/components/CustomCursor';
import FloatingSocialSidebar from '@/components/FloatingSocialSidebar';
import Footer from '@/components/Footer';
import GrainOverlay from '@/components/GrainOverlay';
import JsonLd from '@/components/JsonLd';
import { AnimatePresenceWrapper } from '@/components/motion/AnimatePresenceWrapper';
import ScrollProgressIndicator from '@/components/ScrollProgressIndicator';
import SpotlightEffect from '@/components/SpotlightEffect';
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

const siteUrl = 'https://kimjisub.com';

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default: 'Jisub Kim | CTO & Product Engineer',
		template: '%s | Jisub Kim',
	},
	description: 'CTO at Alpaon. Product Engineer who builds software, firmware, and infrastructure. Portfolio of projects, skills, and career experiences.',
	keywords: ['김지섭', 'Jisub Kim', 'CTO', 'Product Engineer', 'Full Stack Developer', 'Alpaon', 'Candid', '포트폴리오', 'Portfolio'],
	authors: [{ name: 'Jisub Kim', url: siteUrl }],
	creator: 'Jisub Kim',
	openGraph: {
		type: 'website',
		locale: 'ko_KR',
		alternateLocale: 'en_US',
		url: siteUrl,
		siteName: 'Jisub Kim Portfolio',
		title: 'Jisub Kim | CTO & Product Engineer',
		description: 'CTO at Alpaon. Product Engineer who builds software, firmware, and infrastructure.',
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
		title: 'Jisub Kim | CTO & Product Engineer',
		description: 'CTO at Alpaon. Product Engineer who builds software, firmware, and infrastructure.',
		images: ['/logo512.png'],
		creator: '@kimjisub',
	},
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
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html className={`${inter.variable} ${newsreader.variable}`} suppressHydrationWarning>
			<head>
				<JsonLd />
			</head>
			<AppInfoProvider>
				<body className="font-sans bg-background text-foreground antialiased">
					<ThemeProvider>
						<GrainOverlay />
						<SpotlightEffect />
						<ScrollProgressIndicator />
						<BackToTop />
						<CustomCursor />
						<FloatingSocialSidebar />
						<div className="min-h-screen flex flex-col">
							<TopBar />
							<main className="flex-grow">
								<AnimatePresenceWrapper>
									{children}
								</AnimatePresenceWrapper>
							</main>
							<Footer />
						</div>
					</ThemeProvider>
				</body>
			</AppInfoProvider>
		</html>
	);
}
