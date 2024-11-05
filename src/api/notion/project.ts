/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { unstable_cache } from 'next/cache';

import { CareerT, getCareers } from './careers';
import { getProjects } from './projects';
import { getSkills, SkillT } from './skills';
import { notionXApi } from '.';

export const getProjectsWithRelated = () =>
	unstable_cache(
		async () => {
			console.time('[API] getProjectsWithRelated');
			try {
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
			} finally {
				console.timeEnd('[API] getProjectsWithRelated');
			}
		},
		['projects-related'],
		{ revalidate: 3600, tags: ['projects-related'] },
	)();

export const getProject = (projectId: string) =>
	unstable_cache(
		async () => {
			console.time('[API] getProject');
			try {
				const projects = await getProjectsWithRelated();
				return projects.find(project => project.id === projectId);
			} finally {
				console.timeEnd('[API] getProject');
			}
		},
		['projects', projectId],
		{ revalidate: 3600, tags: ['projects', projectId] },
	)();

export const getProjectPage = (projectId: string) =>
	unstable_cache(
		async () => {
			console.time('[API] getProjectPage');
			try {
				return await notionXApi.getPage(projectId);
			} finally {
				console.timeEnd('[API] getProjectPage');
			}
		},
		['projects', projectId, 'page'],
		{ revalidate: 3600, tags: ['projects', projectId, 'page'] },
	)();