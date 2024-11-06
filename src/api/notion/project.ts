/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { CareerT, getCareers } from './careers';
import { getProjects } from './projects';
import { getSkills, SkillT } from './skills';
import { notionXApi } from '.';

export const getProjectsWithRelated = async () => {
	const [careers, projects, skills] = await Promise.all([
		getCareers(),
		getProjects(),
		getSkills(),
	]);

	return projects.map(project => ({
		...project,
		relatedTechSkills: project['주요 기술']
			.map(skillId => skills.find(skill => skill.id === skillId))
			.filter(Boolean) as SkillT[],
		relatedLanguageSkills: project['프로그래밍 언어']
			.map(skillId => skills.find(skill => skill.id === skillId))
			.filter(Boolean) as SkillT[],
		relatedCareers: project['대회 및 수료']
			.map(careerId => careers.find(career => career.id === careerId))
			.filter(Boolean) as CareerT[],
	}));
};

export const getProject = async (projectId: string) => {
	const projects = await getProjectsWithRelated();
	return projects.find(project => project.id === projectId);
};

export const getProjectPage = async (projectId: string) => {
	return await notionXApi.getPage(projectId);
};
