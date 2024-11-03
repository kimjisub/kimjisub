import { unstable_cache } from 'next/cache';

import { notionApi, notionXApi } from '.';

export const getSkills = unstable_cache(
	async () => {
		const result = await notionApi.databases.query({
			database_id: 'f3f9bf321850465d9d193c39e2a06d3e',
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

		return result.results.map((skill: any) => {
			const iconSlugSplit =
				skill.properties['iconSlug']?.rich_text?.[0]?.plain_text?.split('|');

			const slug = iconSlugSplit?.[0];
			const iconColor = iconSlugSplit?.[1];

			return {
				id: skill.id,
				title: skill.properties['환경 및 기술']?.title?.[0]?.text?.content,
				slug,
				iconColor,
				분류: skill.properties['분류']?.multi_select?.map(
					({ name }: { name: string }) => name,
				),
				상위_항목: skill.properties['상위 항목']?.relation?.map(
					({ id }: { id: string }) => id,
				),
				visible: skill.properties['visible']?.checkbox,
				하위_항목: skill.properties['하위 항목']?.relation?.map(
					({ id }: { id: string }) => id,
				),
				숙련도: skill.properties['숙련도']?.select?.name,
				사용한_횟수: skill.properties['사용한 횟수']?.rollup?.number,
				프로젝트: skill.properties['프로젝트']?.relation?.map(
					({ id }: { id: string }) => id,
				),
				관련_기술: skill.properties['관련 기술']?.relation?.map(
					({ id }: { id: string }) => id,
				),
				description: skill.properties['설명']?.rich_text?.[0]?.plain_text,
				iconUrl: skill['icon']?.file?.url,
				iconEmoji: skill['icon']?.emoji,
				coverImageUrl: skill['cover']?.file?.url,

				raw: skill,
			};
		});
	},
	['projects'],
	{ revalidate: 3600, tags: ['projects'] },
);

export const getSkill = (id: string) =>
	unstable_cache(
		async () => {
			const skills = await getSkills();
			return skills.find(skill => skill.id === id);
		},
		['skills', id],
		{ revalidate: 3600, tags: ['skills', id] },
	)();

export const getSkillPage = (skillId: string) =>
	unstable_cache(
		async () => {
			return await notionXApi.getPage(skillId);
		},
		['skills', skillId, 'page'],
		{ revalidate: 3600, tags: ['skills', skillId, 'page'] },
	)();
