import React from 'react';
import Head from 'next/head';

import { getSkill, getSkillPage } from '@/api/notion/skill';
import { getSkills } from '@/api/notion/skills';
import { JsonView } from '@/components/JsonView';
import { NotionClientRenderer } from '@/components/NotionPage';
import { ProjectItem } from '@/components/ProjectItem';
import { SkillItem } from '@/components/SkillItem';

export async function generateStaticParams() {
	console.log('[generateStaticParams]', 'skills/[skillId]');
	const skills = await getSkills();
	const skillIds = skills.map(skill => ({
		params: {
			skillId: skill.id,
		},
	}));
	return skillIds;
}

export const revalidate = false;

export const dynamicParams = false;

type Params = Promise<{ skillId: string }>;

const SkillPage = async (props: { params: Params }) => {
	const { skillId } = await props.params;
	console.log('[SSG] SkillPage', { skillId });

	const [skill, recordMap] = await Promise.all([
		getSkill(skillId),
		getSkillPage(skillId),
	]);

	if (!skill) {
		return <div>Skill not found</div>;
	}

	return (
		<div className="pt-16 mx-auto p-6 max-w-5xl">
			<Head>
				<meta name="description" content="React Notion X Minimal Demo" />
				<title>{skill.title}</title>
			</Head>

			<div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
				<section className="col-span-3 max-w-fit">
					<div className="flex items-center bg-center">
						<SkillItem skill={skill} />
						<h1 className="text-3xl font-bold">{skill.title}</h1>
					</div>

					<NotionClientRenderer
						className="w-full"
						rootPageId={skillId}
						recordMap={recordMap}
						fullPage={false}
						darkMode={false}
						disableHeader
					/>
				</section>

				<section className="col-span-2">
					<div className="space-y-4">
						{/* <div>
							태그
							<div className="space-x-2">
								{skill.태그.map(tag => (
									<Badge key={tag.name} text={tag.name} color={tag.color} />
								))}
							</div>
						</div>
						<div>
							분류
							<div className="space-x-2">
								{skill.분류.map(category => (
									<Badge
										key={category.name}
										text={category.name}
										color={category.color}
									/>
								))}
							</div>
						</div>
						<div>
							맡은 업무
							<div className="space-x-2">
								{project['맡은 업무'].map(role => (
									<Badge key={role.name} text={role.name} color={role.color} />
								))}
							</div>
						</div> */}
						<div className="space-y-4">
							<h2>관련 기술</h2>
							<div
								className="grid gap-4"
								style={{
									gridTemplateColumns: 'repeat(auto-fill, minmax(48px, 1fr))',
								}}>
								{skill.relatedSkill.map(skill => (
									<SkillItem key={skill.id} skill={skill} />
								))}
							</div>
						</div>

						<div className="space-y-4">
							<h2>관련된 프로젝트</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5 justify-center max-x-1xl">
								{[
									...skill.relatedProjectUsedByLanguage,
									...skill.relatedProjectUsedBySkill,
								].map(project => (
									<ProjectItem key={project.id} project={project} />
								))}
							</div>
						</div>

						<JsonView src={skill} collapsed />
					</div>
				</section>
			</div>
		</div>
	);
};

export default SkillPage;
