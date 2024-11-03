import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import { getSkill, getSkillPage, getSkills } from '@/api/notion/skills';
import { JsonView } from '@/components/JsonView';
import { NotionClientRenderer } from '@/components/NotionPage';
import { SkillItem } from '@/components/SkillItem';
import { CareerItem } from '@/components/CareerItem';
import { ProjectItem } from '@/components/ProjectItem';

export async function generateStaticParams() {
	console.log('[generateStaticParams]', 'skills/[skillId]');
	const skills = await getSkills();
	const skillIds = skills.map(skill => ({
		params: {
			skillId: skill.id,
		},
	}));
	console.log('[generateStaticParams]', 'skills/[skillId]', skillIds);
	return skillIds;
}

export const revalidate = false;

export const dynamicParams = true;

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

			<h1>{skill.title}</h1>

			<SkillItem skill={skill} />

			<div>
				<p>관련된 기술</p>
				<div className="grid grid-cols-[repeat(auto-fill,_50px)] gap-4">
					{skill.relatedSkills.map(skill => (
						<Link key={skill.id} href={`/skills/${skill.id}`}>
							<SkillItem skill={skill} />
						</Link>
					))}
				</div>
			</div>

			<div>
				<p>관련된 Project</p>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5 justify-center max-x-1xl">
					{skill.relatedProject.map(project => (
						<Link key={project.id} href={`/project/${project.id}`}>
							<ProjectItem project={project} />
						</Link>
					))}
				</div>
			</div>

			<JsonView name="skill" src={skill} collapsed />

			<NotionClientRenderer
				rootPageId={skillId}
				recordMap={recordMap}
				fullPage={false}
				darkMode={false}
				disableHeader
			/>
		</div>
	);
};

export default SkillPage;
