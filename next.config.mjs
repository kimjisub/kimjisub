import createMDX from '@next/mdx';
import rehypePrismPlus from 'rehype-prism-plus';

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
          { key: 'Content-Type', value: 'application/manifest+json' },
        ],
      },
    ];
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'www.notion.so',
        port: '',
        pathname: '**',
      },
    ],
  },
  webpack: config => {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find(rule =>
      rule.test?.test?.('.svg'),
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      },
      // Raw loader
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        use: ['raw-loader'],
        resourceQuery: /raw/, // *.svg?raw
      },
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
};

const withMDX = createMDX({
	extension: /\.(md|mdx)$/,
	options: {
		rehypePlugins: [[rehypePrismPlus, { ignoreMissing: true }]],
	},
});

export default withMDX(nextConfig);
