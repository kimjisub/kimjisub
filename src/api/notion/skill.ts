/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { unstable_cache } from 'next/cache';

import { getCareers } from './careers';
import { getProjects, ProjectT } from './projects';
import { getSkills, SkillT } from './skills';
import { notionXApi } from '.';

export const getSkillsWithRelated = () =>
	unstable_cache(
		async () => {
			console.time('[API] getSkillsWithRelated');
			try {
				console.log('[API] getSkillsWithRelated');
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
						.map(projectId =>
							projects.find(project => project.id === projectId),
						)
						.filter(Boolean) as ProjectT[],
					relatedProjectUsedBySkill: skill.projectUsedBySkill
						.map(projectId =>
							projects.find(project => project.id === projectId),
						)
						.filter(Boolean) as ProjectT[],
				}));
			} finally {
				console.timeEnd('[API] getSkillsWithRelated');
			}
		},
		['skills-related'],
		{ revalidate: 3600, tags: ['skills-related'] },
	)();

export const getSkill = (skillId: string) =>
	unstable_cache(
		async () => {
			console.time('[API] getSkill');
			try {
				console.log('[API] getSkill', skillId);
				const skills = await getSkillsWithRelated();
				return skills.find(skill => skill.id === skillId);
			} finally {
				console.timeEnd('[API] getSkill');
			}
		},
		['skills', skillId],
		{ revalidate: 3600, tags: ['skills', skillId] },
	)();

export const getSkillPage = (skillId: string) =>
	unstable_cache(
		async () => {
			console.time('[API] getSkillPage');
			try {
				console.log('[API] getSkillPage', skillId);
				return await notionXApi.getPage(skillId);
			} finally {
				console.timeEnd('[API] getSkillPage');
			}
		},
		['skills', skillId, 'page'],
		{ revalidate: 3600, tags: ['skills', skillId, 'page'] },
	)();
