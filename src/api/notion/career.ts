/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { notionXApi } from '../notion';

import { getCareers } from './careers';
import { getProjects, ProjectT } from './projects';
import { getSkills } from './skills';

export const getCareersWithRelated = async () => {
	const [careers, projects, skills] = await Promise.all([
		getCareers(),
		getProjects(),
		getSkills(),
	]);

	return careers.map(career => ({
		...career,
		relatedProjects: career.relatedProjects
			.map(projectId => projects.find(project => project.id === projectId))
			.filter(Boolean) as ProjectT[],
	}));
};

export const getCareer = async (careerId: string) => {
	const careers = await getCareersWithRelated();
	return careers.find(career => career.id === careerId);
};

export const getCareerPage = async (careerId: string) => {
	return await notionXApi.getPage(careerId);
};
