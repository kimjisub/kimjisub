const axios = require('axios');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config({
	path: '.env.local',
});

const fetchAndSaveNotionData = (databaseId, filePath, data = {}) => {
	axios({
		method: 'post',
		url: `https://api.notion.com/v1/databases/${databaseId}/query`,
		headers: {
			Authorization: `Bearer ${process.env.NOTION_SECRET}`,
			'Notion-Version': '2022-06-28',
		},
		data,
	})
		.then(response => {
			const res = response.data;
			fs.writeFile(filePath, JSON.stringify(res, null, 2), err => {
				if (err) {
					console.error(`파일 저장 중 오류가 발생했습니다: ${filePath}`, err);
					return;
				}
				console.log(`파일이 성공적으로 저장되었습니다: ${filePath}`);
			});
		})
		.catch(error => {
			console.error('API 요청 중 오류가 발생했습니다:', error);
		});
};

fetchAndSaveNotionData(
	'f3f9bf321850465d9d193c39e2a06d3e',
	'./src/data/techs.json',
	{
		sorts: [
			{
				property: '분류',
				direction: 'ascending',
			},
			{
				property: '숙련도',
				direction: 'descending',
			},
		],
	},
);
fetchAndSaveNotionData(
	'1aef42d566f84045a94303d07ea12e95',
	'./src/data/projects.json',
);
fetchAndSaveNotionData(
	'89d24d36ad334e62a418d765d6ed4c0b',
	'./src/data/careers.json',
);
