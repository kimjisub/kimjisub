import projects from '../../data/projects.json';

import { fetchNotionBlock, fetchNotionDB, fetchNotionPage } from './notion';
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
		sorts: [
			{
				property: '중요도',
				direction: 'ascending',
			},
		],
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

	return blocks;

	return project[0] as Project | undefined;
};
