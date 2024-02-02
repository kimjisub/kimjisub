const simpleIcons = require('simple-icons');

const tableText = `언어	html5
언어	css3
언어	javascript
언어	typescript
언어	oracle|Java|dd553a
언어	kotlin
언어	python
언어	cplusplus
언어	svg
기술	nodedotjs
기술	react
기술	react|React Native
기술	electron
기술	nextdotjs
기술	recoil
기술	styledcomponents
기술	reactquery
기술	tailwindcss
기술	nestjs
기술	firebase
기술	ffmpeg
기술	adobeaftereffects
기술	googlechrome|Chrome Extention
기술	discord|Discord Bot
기술	nginx
기술	i18next
기술	elasticstack
기술	elasticsearch
기술	logstash
기술	kibana
기술	eslint
기술	githubcopilot
기술	googleadmob
기술	googleanalytics
기술	googlehome
기술	jsonwebtokens
기술	mailgun
기술	glide
DB	mysql
DB	postgresql
DB	mariadb
DB	sqlite
DB	duckdb
DB	mongodb
DB	influxdb
DB	neo4j
DB	redis
DB	prisma
DB	mongoose
IDE	visualstudio
IDE	visualstudiocode
IDE	xcode
IDE	androidstudio
IDE	intellijidea
IDE	easyeda
개발 도구	gitkraken
개발 도구	termius
개발 도구	warp
개발 도구	openai
개발 도구	arc
개발 도구	studio3t
개발 도구	zsh
프로토콜	socketdotio
프로토콜	apachekafka
프로토콜	rabbitmq
프로토콜	grpc|gRPC|2d4a59
프로토콜	mqtt
프로토콜	emqx|EMQX|47ac77
프로토콜	bluetooth
프로토콜	nfc
프로토콜	zigbee
프로토콜	modbus|ModBus
프로토콜	midi
Infra	docker
Infra	kubernetes
Infra	amazonec2
Infra	amazons3
Infra	amazonecs|Amazon ECR
Infra	amazonecs
Infra	amazoneks
Infra	amazonrds
Infra	vmware
Infra	cloudflare
Infra	prometheus
Infra	letsencrypt
Infra	openssl
Infra	portainer
Infra	visualstudioappcenter
Infra	vultr
Infra	haproxy|HAProxy|173c5e
CI/CD	fastlane
CI/CD	githubactions
CI/CD	jenkins
CI/CD	googlecloud
CI/CD	jest
OS	macos
OS	windows
OS	ubuntu
OS	ios
OS	android
OS	raspberrypi
OS	arduino
OS	alpinelinux
협업/문서	git
기술,협업/문서	github
협업/문서	postman
협업/문서	slack
협업/문서	discord
협업/문서	microsoftteams
협업/문서	notion
협업/문서	linear
디자인,협업/문서	figma
협업/문서	adobexd
기술,협업/문서	swagger
협업/문서	obsidian
협업/문서	mermaid
협업/문서	docusaurus
협업/문서	githubpages`;

const table = tableText
	.split('\n')
	.map(row => row.split('\t'))
	.filter(row => row.length === 2)
	.filter(row => row[1].length > 0)
	.map(row => ({ categories: row[0].split(','), customSlug: row[1] }));

const categories = table
	.flatMap(row => row.categories)
	.filter((value, index, self) => self.indexOf(value) === index);

const customSlugsEachCategory = categories.reduce((acc, category) => {
	acc[category] = table
		.filter(row => row.categories.includes(category))
		.map(row => row.customSlug);
	return acc;
}, {});

function getIconBadge(customSlug) {
	const [slug, customTitle, customHex] = customSlug.split('|');
	const si = Object.values(simpleIcons).find(value => value.slug === slug);
	const siTitle = si?.title;
	const siHex = si?.hex;

	const title = customTitle || siTitle || `${slug} (Not Found)`;
	const hex = customHex || siHex || '000000';

	const encodedTitle = encodeURIComponent(title.replaceAll('-', ' '));

	return `<img src="https://img.shields.io/badge/-${encodedTitle}-${hex}?style=flat&logo=${slug}&logoColor=white"/>`;
}

// Object.entries(customSlugsEachCategory).forEach(([category, customSlugs]) => {
// 	console.log(`${customSlugs.map(getIconBadge).join(' ')}`);
// });

console.log(table.map(({ customSlug }) => getIconBadge(customSlug)).join(' '));
