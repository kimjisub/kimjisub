import skills from '../../data/skills.json';

import { fetchNotionBlock, fetchNotionDB, fetchNotionPage } from './notion';
export type Skill = (typeof skills.results)[number];
export const fetchSkills = async () => {
	const skills = await fetchNotionDB('f3f9bf321850465d9d193c39e2a06d3e', {
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
		// sorts: [
		// 	{
		// 		property: '중요도',
		// 		direction: 'ascending',
		// 	},
		// ],
	});

	return skills.results as Skill[];
};

/**
 *
 * @param id notion skill id
 * @returns 단일 스킬 | undefined
 */
export const fetchSkill = async (id: string) => {
	const skills = await fetchSkills();

	const skill = skills.filter(skill => skill.id === id) as Skill[];

	const page = await fetchNotionPage(id);
	console.log('page', page);

	const blocks = await fetchNotionBlock(id);
	console.log('blocks', blocks);

	return blocks;

	return skill[0] as Skill | undefined;
};
