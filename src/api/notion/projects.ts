import { unstable_cache } from 'next/cache';

import { notionApi, notionXApi } from '.';

export const getProjects = unstable_cache(
	async () => {
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
			id: project.id,
			title: project.properties['이름']?.title?.[0]?.text?.content,
			description: project.properties['설명']?.rich_text?.[0]?.plain_text,
			iconUrl: project['icon']?.file?.url,
			iconEmoji: project['icon']?.emoji,
			coverImageUrl: project['cover']?.file?.url,
			github: project.properties['Github']?.url,
			youtube: project.properties['Youtube']?.url,
			url: project.properties['URL']?.url,
			'맡은 업무': project.properties['맡은 업무']?.multi_select?.map(
				({ name, color }: { name: string; color: string }) => ({
					name,
					color,
				}),
			),
			태그: project.properties['태그']?.multi_select?.map(
				({ name, color }: { name: string; color: string }) => ({
					name,
					color,
				}),
			),
			중요도: {
				value: project.properties['중요도']?.select?.name,
				color: project.properties['중요도']?.select?.color,
			},
			'주요 기술': project.properties['주요 기술']?.relation?.map(
				({ id }: { id: string }) => id,
			),
			'프로그래밍 언어': project.properties['프로그래밍 언어']?.relation?.map(
				({ id }: { id: string }) => id,
			),
			date: {
				start: project.properties['날짜']?.date?.start,
				end: project.properties['날짜']?.date?.end,
			},
			분류: project.properties['분류']?.multi_select?.map(
				({ name, color }: { name: string; color: string }) => ({
					name,
					color,
				}),
			),
			'대회 및 수료': project.properties['대회 및 수료']?.relation?.map(
				({ id }: { id: string }) => id,
			),

			raw: project,
		}));
	},
	['projects'],
	{ revalidate: 3600, tags: ['projects'] },
);

export const getProject = (id: string) =>
	unstable_cache(
		async () => {
			const projects = await getProjects();
			return projects.find(project => project.id === id);
		},
		['projects', id],
		{ revalidate: 3600, tags: ['projects', id] },
	)();

export const getProjectPage = (projectId: string) =>
	unstable_cache(
		async () => {
			return await notionXApi.getPage(projectId);
		},
		['projects', projectId, 'page'],
		{ revalidate: 3600, tags: ['projects', projectId, 'page'] },
	)();
