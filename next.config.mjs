import createMDX from '@next/mdx';

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
  // MDX 처리는 아래 createMDX(withMDX)가 turbopack/webpack 양쪽에 자동 등록한다.
  // (수동 @mdx-js/loader 등록은 remark/rehype 플러그인을 함수로 받지 못해 제거함)
  turbopack: {
    rules: {
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
  // 글 폴더 이름을 바꾼 뒤에도 옛 주소로 들어온 사람이 새 글로 가게 한다
  async redirects() {
    return [
      {
        source: '/blog/2025-06-17-nextjs-blog',
        destination: '/blog/2025-06-17-ai-era-writing',
        permanent: true,
      },
    ];
  },
};

// MDX 로더를 turbopack/webpack에 등록하고 remark/rehype 플러그인을 연결한다.
// turbopack은 직렬화 가능한 옵션만 받으므로 플러그인을 [이름, 옵션] 문자열 형태로 전달한다.
// - remark-gfm: GFM 표/취소선/자동링크
// - remark-math + rehype-katex: $...$ / $$...$$ 수식 렌더링 (CSS는 layout에서 katex.min.css import)
// - rehype-prism-plus: 코드 블록 신택스 하이라이팅 (CSS는 layout에서 prism-theme.css import)
const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [['remark-gfm'], ['remark-math']],
    rehypePlugins: [
      ['rehype-prism-plus', { ignoreMissing: true }],
      ['rehype-katex'],
    ],
  },
});

export default withMDX(nextConfig);
