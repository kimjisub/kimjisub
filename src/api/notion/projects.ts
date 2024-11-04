/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { parseISO } from 'date-fns';
import { unstable_cache } from 'next/cache';

import { CareerT, getCareers } from './careers';
import { getSkills, SkillT } from './skills';
import { notionApi, notionXApi } from '.';

export type ProjectT = {
	id: string;
	title: string;
	description: string;
	iconUrl: string;
	iconEmoji: string;
	coverImageUrl: string;
	github: string;
	youtube: string;
	url: string;
	'맡은 업무': { name: string; color: string }[];
	태그: { name: string; color: string }[];
	중요도: {
		value: string;
		color: string;
	};
	'주요 기술': string[];
	'프로그래밍 언어': string[];
	date: {
		start?: Date;
		end?: Date;
	};
	분류: { name: string; color: string }[];
	'대회 및 수료': string[];
	raw: any;
};

export const getProjects: () => Promise<ProjectT[]> = unstable_cache(
	async () => {
		console.log('[API] getProjects');
		const result = await notionApi.databases.query({
			database_id: '1aef42d566f84045a94303d07ea12e95',
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

		return result.results.map((project: any) => ({
			id: project.id as string,
			title: project.properties['이름']?.title?.[0]?.text?.content as string,
			description: project.properties['설명']?.rich_text?.[0]
				?.plain_text as string,
			iconUrl: project['icon']?.file?.url as string,
			iconEmoji: project['icon']?.emoji as string,
			coverImageUrl: project['cover']?.file?.url as string,
			github: project.properties['Github']?.url as string,
			youtube: project.properties['Youtube']?.url as string,
			url: project.properties['URL']?.url as string,
			'맡은 업무': project.properties['맡은 업무']?.multi_select?.map(
				({ name, color }: { name: string; color: string }) => ({
					name: name,
					color: color,
				}),
			) as { name: string; color: string }[],
			태그: project.properties['태그']?.multi_select?.map(
				({ name, color }: { name: string; color: string }) => ({
					name: name,
					color: color,
				}),
			) as { name: string; color: string }[],
			중요도: {
				value: project.properties['중요도']?.select?.name as string,
				color: project.properties['중요도']?.select?.color as string,
			},
			'주요 기술': project.properties['주요 기술']?.relation?.map(
				({ id }: { id: string }) => id,
			) as string[],
			'프로그래밍 언어': project.properties['프로그래밍 언어']?.relation?.map(
				({ id }: { id: string }) => id,
			) as string[],
			date: {
				start: project.properties['날짜']?.date?.start
					? parseISO(project.properties['날짜']?.date?.start)
					: undefined,
				end: project.properties['날짜']?.date?.end
					? parseISO(project.properties['날짜']?.date?.end)
					: undefined,
			},
			분류: project.properties['분류']?.multi_select?.map(
				({ name, color }: { name: string; color: string }) => ({
					name: name,
					color: color,
				}),
			) as { name: string; color: string }[],
			'대회 및 수료': project.properties['대회 및 수료']?.relation?.map(
				({ id }: { id: string }) => id,
			) as string[],

			raw: project,
		}));
	},
	['projects'],
	{ revalidate: 3600, tags: ['projects'] },
);

export const getProjectsWithRelated = () =>
	unstable_cache(
		async () => {
			console.log('[API] getProjectsWithRelated');
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
		},
		['projects-related'],
		{ revalidate: 3600, tags: ['projects-related'] },
	)();

export const getProject = (projectId: string) =>
	unstable_cache(
		async () => {
			console.log('[API] getProject', projectId);
			const projects = await getProjectsWithRelated();
			return projects.find(project => project.id === projectId);
		},
		['projects', projectId],
		{ revalidate: 3600, tags: ['projects', projectId] },
	)();

export const getProjectPage = (projectId: string) =>
	unstable_cache(
		async () => {
			console.log('[API] getProjectPage', projectId);
			return await notionXApi.getPage(projectId);
		},
		['projects', projectId, 'page'],
		{ revalidate: 3600, tags: ['projects', projectId, 'page'] },
	)();
