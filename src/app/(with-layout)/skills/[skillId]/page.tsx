import React from 'react';
import { Text } from '@radix-ui/themes';
import { format } from 'date-fns';

import { getSkill, getSkillPage } from '@/api/notion/skill';
import { getSkills } from '@/api/notion/skills';
import DebugView from '@/components/DebugView';
import { JsonView } from '@/components/JsonView';
import { NotionClientRenderer } from '@/components/NotionPage';
import { ProjectItem } from '@/components/ProjectItem';
import { SkillItem } from '@/components/SkillItem';

export async function generateStaticParams() {
	console.log('[generateStaticParams]', 'skills/[skillId]');
	const { skills } = await getSkills();
	return skills.map(skill => ({
		skillId: skill.id,
	}));
}

export const revalidate = 3600;

export const dynamicParams = true;

type Params = Promise<{ skillId: string }>;

export async function generateMetadata(props: { params: Params }) {
	const { skillId } = await props.params;

	const { skill } = await getSkill(skillId);
	return {
		title: skill?.title || 'Not found',
	};
}

const SkillPage = async (props: { params: Params }) => {
	const { skillId } = await props.params;
	console.log('[SSG] SkillPage', { skillId });

	const [
		{ skill, fetchedAt },
		{ extendedRecordMap, fetchedAt: pageFetchedAt },
	] = await Promise.all([getSkill(skillId), getSkillPage(skillId)]);

	if (!skill) {
		return <div>Skill not found</div>;
	}

	return (
		<div className="pt-16 mx-auto p-6">
			<div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
				<section className="col-span-3 max-w-fit">
					<div className="flex items-center bg-center">
						<SkillItem skill={skill} />
						<h1 className="text-3xl font-bold">{skill.title}</h1>
					</div>

					<NotionClientRenderer
						className="w-full"
						rootPageId={skillId}
						recordMap={extendedRecordMap}
						fullPage={false}
						darkMode={false}
						disableHeader
					/>
					<DebugView>
						<Text>{format(pageFetchedAt, 'yyyy-MM-dd HH:mm:ss')}</Text>
					</DebugView>
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
								{skill.relatedSkills.map(skill => (
									<SkillItem key={skill.id} skill={skill} />
								))}
							</div>
						</div>

						<div className="space-y-4">
							<h2>관련된 프로젝트</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5 justify-center max-x-1xl">
								{[
									...skill.relatedProjectsUsedByLanguage,
									...skill.relatedProjectsUsedBySkill,
								].map(project => (
									<ProjectItem key={project.id} project={project} />
								))}
							</div>
						</div>

						<DebugView>
							<Text>{format(fetchedAt, 'yyyy-MM-dd HH:mm:ss')}</Text>
							<JsonView src={skill} collapsed />
						</DebugView>
					</div>
				</section>
			</div>
		</div>
	);
};

export default SkillPage;
