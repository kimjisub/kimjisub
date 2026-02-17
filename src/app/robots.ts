import type { MetadataRoute } from 'next';

const siteUrl = 'https://kimjisub.com';

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: '*',
				allow: '/',
				disallow: ['/api/', '/_next/', '/graph'],
			},
			{
				userAgent: 'Googlebot',
				allow: '/',
				disallow: ['/api/', '/_next/'],
			},
			{
				userAgent: 'Bingbot',
				allow: '/',
				disallow: ['/api/', '/_next/'],
			},
		],
		sitemap: `${siteUrl}/sitemap.xml`,
		host: siteUrl,
	};
}
