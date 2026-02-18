import React from 'react';
import { Text } from '@radix-ui/themes';
import { format } from 'date-fns';

import { getSkill, getSkillPage } from '@/api/notion/skill';
import { getSkills } from '@/api/notion/skills';
import { ContentEngagement } from '@/components/ContentEngagement';
import DebugView from '@/components/DebugView';
import { JsonView } from '@/components/JsonView';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { ProjectItem } from '@/components/ProjectItem';
import { SkillItem } from '@/components/SkillItem';

// Skills with known rendering issues that cause build failures
const EXCLUDED_SKILL_IDS = [
	'734db84a-70f6-458e-8c5c-19b0d09c2682', // Build error
	'b4f1dcf8-0067-4ffa-86ca-7390c8936c35', // Build error
	'a18fd511-b9f4-42d1-b529-2423c75bb8f4', // Build error
	'28bc9939-6d4e-4883-8e34-5509feabb9ec', // Element type invalid error during prerender
	'e1dd526d-97da-424a-b1dc-e7ffd5fbc26d', // Element type invalid error during prerender
	'681343ff-92ca-42c7-a073-7f72ef77e7ef', // Element type invalid error during prerender
	'b0dae757-f63f-4523-880a-116d4039afa6', // Element type invalid error during prerender
	'd13c7309-6784-432b-b787-dea741b28eb3', // Element type invalid error during prerender
];

export async function generateStaticParams() {
	console.log('[generateStaticParams]', 'skills/[skillId]');
	const { skills } = await getSkills();
	return skills
		.filter(skill => !EXCLUDED_SKILL_IDS.includes(skill.id))
		.map(skill => ({
			skillId: skill.id,
		}));
}

export const revalidate = 3600;

export const dynamicParams = true;

type Params = Promise<{ skillId: string }>;

export async function generateMetadata(props: { params: Params }) {
	const { skillId } = await props.params;

	const { skill } = await getSkill(skillId);
	
	if (!skill) {
		return { title: 'Skill Not Found' };
	}

	const description = `${skill.title} - 김지섭이 사용하는 기술. 관련 프로젝트 및 경험.`;
	
	return {
		title: skill.title,
		description: description,
		keywords: [skill.title, ...skill.분류, '기술 스택', 'skill'],
		openGraph: {
			title: `${skill.title} | Jisub Kim Skills`,
			description: description,
			type: 'article',
			images: ['/logo512.png'],
		},
		twitter: {
			card: 'summary',
			title: `${skill.title} | Jisub Kim`,
			description: description,
		},
	};
}

const SkillPage = async (props: { params: Params }) => {
	const { skillId } = await props.params;
	console.log('[SSG] SkillPage', { skillId });

	const [
		{ skill, fetchedAt },
		{ markdown, fetchedAt: pageFetchedAt },
	] = await Promise.all([getSkill(skillId), getSkillPage(skillId)]);

	if (!skill) {
		return <div>Skill not found</div>;
	}

	return (
		<div className="py-12 md:py-24 px-4 md:px-6 max-w-7xl mx-auto">
			<div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
				<section className="col-span-3">
					<div className="flex items-center space-x-3 mb-4">
						<SkillItem skill={skill} />
						<h1 className="font-serif text-3xl md:text-4xl text-foreground italic">{skill.title}</h1>
					</div>
					
					<ContentEngagement slug={skillId} contentType="skill" className="mb-8" />

					<MarkdownRenderer content={markdown} className="w-full" />
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
						{skill.relatedSkills.length > 0 && (
							<div className="space-y-4">
								<h2 className="font-serif text-xl text-foreground italic">Related Skills</h2>
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
						)}

						<div className="space-y-4 mt-8">
							<h2 className="font-serif text-xl text-foreground italic">Related Projects</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center">
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
