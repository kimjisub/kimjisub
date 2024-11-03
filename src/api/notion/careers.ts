import { unstable_cache } from 'next/cache';

import { notionApi, notionXApi } from '.';

export const getCareers = unstable_cache(
	async () => {
		const result = await notionApi.databases.query({
			database_id: '89d24d36ad334e62a418d765d6ed4c0b',
			filter: {
				and: [
					{
						property: '수상 순위',
						select: {
							does_not_equal: '비수상',
						},
					},
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
					property: '날짜',
					direction: 'descending',
				},
			],
		});

		return result.results.map((career: any) => ({
			id: career.id,
			title: career.properties['이름']?.title?.[0]?.text?.content,
			description: career.properties['설명']?.rich_text?.[0]?.plain_text,
			iconUrl: career['icon']?.file?.url,
			iconEmoji: career['icon']?.emoji,
			coverImageUrl: career['cover']?.file?.url,

			relatedProjects: career.properties['관련된 프로젝트']?.relation?.map(
				(relation: any) => relation.id,
			),
			awardsAndCertifications:
				career.properties['수상 및 수료']?.rich_text?.[0]?.plain_text,
			institution: career.properties['기관']?.multi_select?.map(
				(select: any) => select.name,
			),
			importance: career.properties['중요도']?.select?.name,
			url: career.properties['URL']?.url,
			category: career.properties['분류']?.multi_select?.map(
				(select: any) => select.name,
			),
			date: career.properties['날짜']?.date?.start,
			assignedTasks: career.properties['맡은 업무']?.multi_select?.map(
				(select: any) => select.name,
			),

			raw: career,
		}));
	},
	['projects'],
	{ revalidate: 3600, tags: ['projects'] },
);

export const getCareer = (id: string) =>
	unstable_cache(
		async () => {
			const careers = await getCareers();
			return careers.find(career => career.id === id);
		},
		['careers', id],
		{ revalidate: 3600, tags: ['careers', id] },
	)();

export const getCareerPage = (careerId: string) =>
	unstable_cache(
		async () => {
			return await notionXApi.getPage(careerId);
		},
		['careers', careerId, 'page'],
		{ revalidate: 3600, tags: ['careers', careerId, 'page'] },
	)();
