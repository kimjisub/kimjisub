const siteUrl = 'https://kimjisub.com';

const personSchema = {
	'@context': 'https://schema.org',
	'@type': 'Person',
	name: '김지섭',
	alternateName: 'Jisub Kim',
	url: siteUrl,
	image: `${siteUrl}/logo512.png`,
	jobTitle: 'CTO & Product Engineer',
	worksFor: {
		'@type': 'Organization',
		name: 'Alpaon',
		url: 'https://alpaon.com',
	},
	alumniOf: {
		'@type': 'Organization',
		name: 'Candid',
		url: 'https://teamcandid.kr',
	},
	sameAs: [
		'https://github.com/kimjisub',
		'https://alpaon.com',
		'https://teamcandid.kr',
	],
	knowsAbout: [
		'Software Development',
		'Firmware Development',
		'Infrastructure',
		'Full Stack Development',
		'React',
		'Next.js',
		'TypeScript',
		'Node.js',
	],
	description: 'CTO at Alpaon. Product Engineer who builds software, firmware, and infrastructure.',
};

const websiteSchema = {
	'@context': 'https://schema.org',
	'@type': 'WebSite',
	name: 'Jisub Kim Portfolio',
	alternateName: '김지섭 포트폴리오',
	url: siteUrl,
	description: 'Portfolio website of Jisub Kim - CTO & Product Engineer',
	author: {
		'@type': 'Person',
		name: 'Jisub Kim',
	},
	publisher: {
		'@type': 'Person',
		name: 'Jisub Kim',
	},
	inLanguage: ['ko', 'en'],
	potentialAction: {
		'@type': 'SearchAction',
		target: `${siteUrl}/blog?q={search_term_string}`,
		'query-input': 'required name=search_term_string',
	},
};

const JsonLd = () => {
	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(personSchema),
				}}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(websiteSchema),
				}}
			/>
		</>
	);
};

export default JsonLd;
