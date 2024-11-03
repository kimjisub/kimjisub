/** @type {import('next').NextConfig} */
const nextConfig = {
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
	// async headers() {
	// 	return [
	// 		{
	// 			source: '/_next/image(.*)', // next/image로 로드되는 모든 이미지 파일에 대해
	// 			headers: [
	// 				{
	// 					key: 'Cache-Control',
	// 					value: 'public, max-age=31536000, immutable', // 1년간 캐시 유효, 변경되지 않음
	// 				},
	// 			],
	// 		},
	// 	];
	// },
};

module.exports = nextConfig;
