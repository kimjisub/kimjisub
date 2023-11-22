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
};

module.exports = nextConfig;
