/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { parseISO } from 'date-fns';
import { unstable_cache } from 'next/cache';

import { notionApi } from '../notion';

export type CareerT = {
	id: string;
	title: string;
	description: string;
	iconUrl: string;
	iconEmoji: string;
	coverImageUrl: string;
	relatedProjects: string[];
	awardsAndCertifications: string;
	institutions: { name: string; color: string }[];
	importance: string;
	url: string;
	categories: { name: string; color: string }[];
	date: {
		start?: Date;
		end?: Date;
	};
	assignedTasks: { name: string; color: string }[];
	raw: any;
};

export const getCareers = (): Promise<CareerT[]> =>
	unstable_cache(
		async () => {
			console.log('[API] getCareers');
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
				id: career.id as string,
				title: career.properties['이름']?.title?.[0]?.text?.content as string,
				description: career.properties['설명']?.rich_text?.[0]
					?.plain_text as string,
				iconUrl: career['icon']?.file?.url as string,
				iconEmoji: career['icon']?.emoji as string,
				coverImageUrl: career['cover']?.file?.url as string,

				relatedProjects: career.properties['관련된 프로젝트']?.relation?.map(
					(relation: any) => relation.id as string,
				) as string[],
				awardsAndCertifications: career.properties['수상 및 수료']
					?.rich_text?.[0]?.plain_text as string,
				institutions: career.properties['기관']?.multi_select?.map(
					({ name, color }: { name: string; color: string }) => ({
						name: name,
						color: color,
					}),
				) as { name: string; color: string }[],
				importance: career.properties['중요도']?.select?.name as string,
				url: career.properties['URL']?.url as string,
				categories: career.properties['분류']?.multi_select?.map(
					({ name, color }: { name: string; color: string }) => ({
						name: name,
						color: color,
					}),
				) as { name: string; color: string }[],
				date: {
					start: career.properties['날짜']?.date?.start
						? parseISO(career.properties['날짜']?.date?.start)
						: undefined,
					end: career.properties['날짜']?.date?.end
						? parseISO(career.properties['날짜']?.date?.end)
						: undefined,
				} as { start?: Date; end?: Date },
				assignedTasks: career.properties['맡은 업무']?.multi_select?.map(
					({ name, color }: { name: string; color: string }) => ({
						name: name,
						color: color,
					}),
				) as { name: string; color: string }[],

				raw: career,
			}));
		},
		['careers'],
		{ revalidate: 3600, tags: ['careers'] },
	)();
