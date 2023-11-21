import careers from '../data/careers.json';
import projects from '../data/projects.json';

export const fetchNotionDB = async (databaseId: string, data = {}) => {
	const response = await fetch(
		`https://api.notion.com/v1/databases/${databaseId}/query`,
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${process.env.NOTION_SECRET}`,
				'Notion-Version': '2022-06-28',
				'Content-Type': 'application/json',
			},
				body: JSON.stringify(data),
				//   next:{
			//     revalidate: 0
			//   }
			cache: 'no-cache',
		},
	);

	if (!response.ok) {
		throw new Error('API 요청 중 오류가 발생했습니다');
	}

	return response.json();
};

export type Project = (typeof projects.results)[number];
export const fetchProject = async () => {
	const projects = await fetchNotionDB('1aef42d566f84045a94303d07ea12e95');

	return projects.results as Project[];
};


export type Career = (typeof careers.results)[number];
export const fetchCareer = async () => {
	const projects = await fetchNotionDB('89d24d36ad334e62a418d765d6ed4c0b');

	return projects.results as Career[];
};
