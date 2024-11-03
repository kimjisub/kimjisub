import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import { getSkill, getSkillPage, getSkills } from '@/api/notion/skills';
import { JsonView } from '@/components/JsonView';
import { NotionClientRenderer } from '@/components/NotionPage';

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

export const revalidate = 60;

export const dynamicParams = true;

type Params = Promise<{ skillId: string }>;

const SkillPage = async (props: { params: Params }) => {
	const { skillId } = await props.params;
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

			<JsonView name="skill" src={skill} collapsed />

			<NotionClientRenderer
				rootPageId={skillId}
				recordMap={recordMap}
				fullPage={false}
				darkMode={false}
				disableHeader
				defaultPageIcon="📄"
				components={{
					nextImage: Image,
					nextLink: Link,
				}}
			/>
		</div>
	);
};

export default SkillPage;
