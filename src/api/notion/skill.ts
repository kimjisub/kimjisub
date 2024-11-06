/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { getCareers } from './careers';
import { getProjects, ProjectT } from './projects';
import { getSkills, SkillT } from './skills';
import { notionXApi } from '.';

export const getSkillsWithRelated = async () => {
	const [careers, projects, skills] = await Promise.all([
		getCareers(),
		getProjects(),
		getSkills(),
	]);
	return skills.map(skill => ({
		...skill,
		relatedSkill: skill['관련_기술']
			.map(skillId => skills.find(skill => skill.id === skillId))
			.filter(Boolean) as SkillT[],
		relatedProjectUsedByLanguage: skill.projectUsedByLanguage
			.map(projectId => projects.find(project => project.id === projectId))
			.filter(Boolean) as ProjectT[],
		relatedProjectUsedBySkill: skill.projectUsedBySkill
			.map(projectId => projects.find(project => project.id === projectId))
			.filter(Boolean) as ProjectT[],
	}));
};

export const getSkill = async (skillId: string) => {
	const skills = await getSkillsWithRelated();
	return skills.find(skill => skill.id === skillId);
};

export const getSkillPage = async (skillId: string) => {
	return await notionXApi.getPage(skillId);
};
