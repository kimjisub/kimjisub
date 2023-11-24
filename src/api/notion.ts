import { NotionAPI } from 'notion-client';

import careers from '../data/careers.json';
import projects from '../data/projects.json';

export const notionApi = new NotionAPI()

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
			next: {
				revalidate: 3600,
			},
		},
	);

	if (!response.ok) {
		throw new Error('API 요청 중 오류가 발생했습니다');
	}

	return response.json();
};

export const fetchNotionPage = async (pageId: string) => {
	const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
		headers: {
			Authorization: `Bearer ${process.env.NOTION_SECRET}`,
			'Notion-Version': '2022-06-28',
		},
	});

	if (!response.ok) {
		throw new Error('API 요청 중 오류가 발생했습니다');
	}

	return response.json();
};

export const fetchNotionBlock = async (pageId: string) => {
	const response = await fetch(
		`https://api.notion.com/v1/blocks/${pageId}/children`,
		{
			headers: {
				Authorization: `Bearer ${process.env.NOTION_SECRET}`,
				'Notion-Version': '2022-06-28',
			},
		},
	);

	if (!response.ok) {
		throw new Error('API 요청 중 오류가 발생했습니다');
	}

	return response.json();
};

export type Project = (typeof projects.results)[number];
export const fetchProjects = async () => {
	const projects = await fetchNotionDB('1aef42d566f84045a94303d07ea12e95', {
		filter: {
			and: [
				{
					property: 'visible',
					checkbox: {
						equals: true,
					},
				},
			],
		},
	});

	return projects.results as Project[];
};

/**
 *
 * @param id notion project id
 * @returns 단일 프로젝트 | undefined
 */
export const fetchProject = async (id: string) => {
	const projects = await fetchProjects();

	const project = projects.filter(project => project.id === id) as Project[];

	const page = await fetchNotionPage(id);
	console.log('page', page);

	const blocks = await fetchNotionBlock(id);
	console.log('blocks', blocks);

	return blocks

	return project[0] as Project | undefined;
};

export type Career = (typeof careers.results)[number];
export const fetchCareers = async () => {
	const careers = await fetchNotionDB('89d24d36ad334e62a418d765d6ed4c0b', {
		filter: {
			and: [
				{
					property: '수상 순위',
					select: {
						does_not_equal: '비수상',
					},
				},
				{
					property: 'visible',
					checkbox: {
						equals: true,
					},
				},
			],
		},
	});

	return careers.results as Career[];
};

export const fetchCareer = async (id: string) => {
	const careers = await fetchCareers();

	const career = careers.filter(career => career.id === id) as Career[];

	return career[0] as Career | undefined;
};
