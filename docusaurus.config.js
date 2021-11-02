// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
	title: 'Kimjisub',
	tagline: '개발자 김지섭입니다.',
	url: 'https://kimjisub.me',
	baseUrl: '/',
	onBrokenLinks: 'throw',
	onBrokenMarkdownLinks: 'warn',
	favicon: 'img/favicon.ico',
	organizationName: 'kimjisub', // Usually your GitHub org/user name.
	projectName: 'kimjisub.me', // Usually your repo name.

	presets: [
		[
			'@docusaurus/preset-classic',
			/** @type {import('@docusaurus/preset-classic').Options} */
			({
				docs: {
					sidebarPath: require.resolve('./sidebars.js'),
					// Please change this to your repo.
					editUrl: 'https://github.com/kimjisub/kimjisub.me/edit/main/',
				},
				blog: {
					showReadingTime: true,
					// Please change this to your repo.
					editUrl: 'https://github.com/kimjisub/kimjisub.me/edit/main/blog/',
				},
				theme: {
					customCss: require.resolve('./src/css/custom.css'),
				},
			}),
		],
	],

	themeConfig:
		/** @type {import('@docusaurus/preset-classic').ThemeConfig} */
		({
			navbar: {
				title: 'kimjisub.me',
				logo: {
					alt: 'kimjisub',
					src: 'img/logo.svg',
				},
				items: [
					{
						type: 'doc',
						docId: 'intro',
						position: 'left',
						label: '포트폴리오',
					},
					{ to: '/blog', label: '블로그', position: 'left' },
				],
			},
			footer: {
				style: 'dark',
				links: [
					{
						title: 'Links',
						items: [
							{
								label: 'Document',
								to: '/docs/intro',
							},
							{
								label: 'Blog',
								to: '/blog',
							},
						],
					},
					{
						title: 'SNS',
						items: [
							{
								label: 'Github',
								href: 'https://github.com/kimjisub',
							},
						],
					},
					{
						title: 'More',
						items: [
							{
								label: 'Blog',
								to: '/blog',
							},
							/*{
								label: 'GitHub',
								href: 'https://github.com/facebook/docusaurus',
							},*/
						],
					},
				],
				copyright: `Copyright © ${new Date().getFullYear()} Kimjisub.`,
			},
			prism: {
				theme: lightCodeTheme,
				darkTheme: darkCodeTheme,
			},
		}),

	i18n: {
		defaultLocale: 'ko',
		locales: ['ko'],
		localeConfigs: {
			ko: {
				label: '한국어',
			},
		},
	},
};

module.exports = config;
