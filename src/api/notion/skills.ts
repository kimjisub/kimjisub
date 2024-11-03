import { unstable_cache } from 'next/cache';

import { notionApi, notionXApi } from '.';
import { getProjects, ProjectT } from './projects';
import { getCareers } from './careers';

export type SkillT = {
	id: string;
	title: string;
	slug: string;
	iconColor: string;
	분류: string[];
	상위_항목: string[];
	visible: boolean;
	하위_항목: string[];
	숙련도: string;
	사용한_횟수: number;
	프로젝트: string[];
	관련_기술: string[];
	description: string;
	iconUrl: string;
	iconEmoji: string;
	coverImageUrl: string;
	raw: any;
};

export const getSkills = (): Promise<SkillT[]> =>
	unstable_cache(
		async () => {
			console.log('[API] getSkills');
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
					id: skill.id as string,
					title: skill.properties['환경 및 기술']?.title?.[0]?.text
						?.content as string,
					slug: slug as string,
					iconColor: iconColor as string,
					분류: skill.properties['분류']?.multi_select?.map(
						({ name }: { name: string }) => name as string,
					) as string[],
					상위_항목: skill.properties['상위 항목']?.relation?.map(
						({ id }: { id: string }) => id as string,
					) as string[],
					visible: skill.properties['visible']?.checkbox as boolean,
					하위_항목: skill.properties['하위 항목']?.relation?.map(
						({ id }: { id: string }) => id as string,
					) as string[],
					숙련도: skill.properties['숙련도']?.select?.name as string,
					사용한_횟수: skill.properties['사용한 횟수']?.rollup?.number as
						| number,
					프로젝트: skill.properties['프로젝트']?.relation?.map(
						({ id }: { id: string }) => id as string,
					) as string[],
					관련_기술: skill.properties['관련 기술']?.relation?.map(
						({ id }: { id: string }) => id as string,
					) as string[],
					description: skill.properties['설명']?.rich_text?.[0]?.plain_text as
						| string,
					iconUrl: skill['icon']?.file?.url as string,
					iconEmoji: skill['icon']?.emoji as string,
					coverImageUrl: skill['cover']?.file?.url as string,

					raw: skill as any,
				};
			});
		},
		['skills'],
		{ revalidate: 3600, tags: ['skills'] },
	)();

export const getSkillsWithRelated = () =>
	unstable_cache(
		async () => {
			console.log('[API] getSkillsWithRelated');
			const [careers, projects, skills] = await Promise.all([
				getCareers(),
				getProjects(),
				getSkills(),
			]);
			return skills.map(skill => ({
				...skill,
				relatedProject: skill['프로젝트']
					.map(projectId => projects.find(project => project.id === projectId))
					.filter(Boolean) as ProjectT[],
				relatedSkills: skill['관련_기술']
					.map(skillId => skills.find(skill => skill.id === skillId))
					.filter(Boolean) as SkillT[],
			}));
		},
		['skills-related'],
		{ revalidate: 3600, tags: ['skills-related'] },
	)();

export const getSkill = (skillId: string) =>
	unstable_cache(
		async () => {
			console.log('[API] getSkill', skillId);
			const skills = await getSkillsWithRelated();
			return skills.find(skill => skill.id === skillId);
		},
		['skills', skillId],
		{ revalidate: 3600, tags: ['skills', skillId] },
	)();

export const getSkillPage = (skillId: string) =>
	unstable_cache(
		async () => {
			console.log('[API] getSkillPage', skillId);
			return await notionXApi.getPage(skillId);
		},
		['skills', skillId, 'page'],
		{ revalidate: 3600, tags: ['skills', skillId, 'page'] },
	)();
