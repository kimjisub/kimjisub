/** @type {import('next').NextConfig} */
const nextConfig = {
  // Serverless Function 번들에서 불필요한 파일 제외
  outputFileTracingExcludes: {
    '*': [
      // pnpm store (Vercel 빌드 시 생성됨 - 절대 포함되면 안 됨!)
      './.pnpm-store/**/*',
      '.pnpm-store/**/*',
      './node_modules/.pnpm-store/**/*',
      // 콘텐츠 assets (이미지/미디어)
      './src/content/**/*.{png,jpg,jpeg,gif,webp,mp4,mov,svg}',
      './public/content/**/*',
      // 무거운 native 모듈
      './node_modules/canvas/**/*',
      './node_modules/sharp/**/*',
      // 기타
      './.git/**/*',
    ],
  },
  // canvas를 서버 번들에서 제외 (react-pdf용, 클라이언트만 사용)
  serverExternalPackages: ['canvas'],
  // Next.js 16: Turbopack configuration
  turbopack: {
    rules: {
      '*.mdx': {
        loaders: ['@mdx-js/loader'],
        as: '*.js',
      },
      '*.md': {
        loaders: ['@mdx-js/loader'],
        as: '*.js',
      },
      // SVG를 asset으로 처리 (컴포넌트 변환 X)
      // '*.svg': { loaders: ['@svgr/webpack'], as: '*.js' },
    },
  },
  // Next.js 16: Allow dev origins for Tailscale
  allowedDevOrigins: [
    'kimjisub-openclaw.tail07a0c6.ts.net',
  ],
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
    localPatterns: [
      {
        pathname: '/**',
      },
    ],
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
  // Webpack config (fallback for --webpack mode)
  webpack: config => {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find(rule =>
      rule.test?.test?.('.svg'),
    );

    if (fileLoaderRule) {
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
          resourceQuery: { not: [...(fileLoaderRule.resourceQuery?.not || []), /url/] },
          use: ['@svgr/webpack'],
        },
      );

      // Modify the file loader rule to ignore *.svg
      fileLoaderRule.exclude = /\.svg$/i;
    }

    return config;
  },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
};

export default nextConfig;
