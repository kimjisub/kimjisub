/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Mutex } from 'async-mutex';
import { parseISO } from 'date-fns';
import { unstable_cache } from 'next/cache';

import { NotionColor } from '../type/color';

import { notionApi } from '.';

import { isBuildPhase } from '@/utils/phase';

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
	'맡은 업무': { name: string; color: NotionColor }[];
	태그: { name: string; color: NotionColor }[];
	중요도: {
		value: string;
		color: NotionColor;
	};
	'주요 기술': string[];
	'프로그래밍 언어': string[];
	date: {
		start?: Date;
		end?: Date;
	};
	분류: { name: string; color: NotionColor }[];
	'대회 및 수료': string[];
	raw: any;
};

const fetchProjects = async () => {
	console.log('[API] getProjects');

	const allResults: any[] = [];
	let nextCursor: string | null | undefined = undefined;

	do {
		const result = await notionApi.databases.query({
			database_id: '1aef42d566f84045a94303d07ea12e95',
			start_cursor: nextCursor,
			// filter: {
			// 	and: [
			// 		{
			// 			property: 'visible',
			// 			checkbox: {
			// 				equals: true,
			// 			},
			// 		},
			// 	],
			// },
			sorts: [
				{
					property: '중요도',
					direction: 'ascending',
				},
			],
		});

		allResults.push(...result.results);
		nextCursor = result.next_cursor;
	} while (nextCursor);

	const projects = allResults.map(
		(project: any) =>
			({
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
					({ name, color }: { name: string; color: NotionColor }) => ({
						name: name,
						color: color,
					}),
				) as { name: string; color: NotionColor }[],
				태그: project.properties['태그']?.multi_select?.map(
					({ name, color }: { name: string; color: NotionColor }) => ({
						name: name,
						color: color,
					}),
				) as { name: string; color: NotionColor }[],
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
					({ name, color }: { name: string; color: NotionColor }) => ({
						name: name,
						color: color,
					}),
				) as { name: string; color: NotionColor }[],
				'대회 및 수료': project.properties['대회 및 수료']?.relation?.map(
					({ id }: { id: string }) => id,
				) as string[],

				raw: project,
			} as ProjectT),
	);

	return { projects, fetchedAt: new Date() };
};

const mutex = new Mutex();

// export const getProjects = () =>
// 	mutex.runExclusive(async () =>
// 		NotionCache.getInstance().cacheProjects(fetchProjects),
// 	);

let buildCache: Awaited<ReturnType<typeof fetchProjects>> | null = null;
export const getProjects = async () => {
	if (isBuildPhase()) {
		return await mutex.runExclusive(async () => {
			if (buildCache) return buildCache;
			const data = await fetchProjects();
			buildCache = data;
			return data;
		});
	} else {
		const getCachedProjects = unstable_cache(
			async () => {
				const data = await fetchProjects();
				return data;
			},
			[],
			{
				tags: ['projects'],
				revalidate: 60 * 60,
			},
		);

		return await getCachedProjects();
	}
};
