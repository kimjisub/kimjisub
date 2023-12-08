import careers from '../../data/careers.json';

import { fetchNotionDB } from './notion';

export type Career = (typeof careers.results)[number];
export const fetchCareers = async () => {
	const careers = await fetchNotionDB('89d24d36ad334e62a418d765d6ed4c0b', {
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

	return careers.results as Career[];
};

export const fetchCareer = async (id: string) => {
	const careers = await fetchCareers();

	const career = careers.filter(career => career.id === id) as Career[];

	return career[0] as Career | undefined;
};
