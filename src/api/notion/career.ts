/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { unstable_cache } from 'next/cache';

import { notionXApi } from '../notion';

import { getCareers } from './careers';
import { getProjects, ProjectT } from './projects';
import { getSkills } from './skills';

export const getCareersWithRelated = () =>
	unstable_cache(
		async () => {
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
		},
		['careers-related'],
		{ revalidate: 3600, tags: ['careers-related'] },
	)();

export const getCareer = (careerId: string) =>
	unstable_cache(
		async () => {
			const careers = await getCareersWithRelated();
			return careers.find(career => career.id === careerId);
		},
		['careers', careerId],
		{ revalidate: 3600, tags: ['careers', careerId] },
	)();

export const getCareerPage = (careerId: string) =>
	unstable_cache(
		async () => {
			return await notionXApi.getPage(careerId);
		},
		['careers', careerId, 'page'],
		{ revalidate: 3600, tags: ['careers', careerId, 'page'] },
	)();
