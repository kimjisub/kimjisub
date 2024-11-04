import React from 'react';
import Link from 'next/link';

import { getSkills } from '@/api/notion/skills';
import { SkillItem } from '@/components/SkillItem';

export const revalidate = false;
export default async function SkillsPage() {
	console.log('[SSG] SkillsPage');

	const skills = await getSkills();

	return (
		<section className="pt-16 h-screen mx-auto my-0 p-20 max-w-5xl">
			<h1 className="text-4xl font-bold">Skills</h1>
			<h2 className="text-2xl">제가 구사할 수 있는 능력들이에요</h2>

			<div className="grid grid-cols-[repeat(auto-fill,_50px)] gap-4">
				{skills.map(skill => {
					return (
						<Link href={`/skills/${skill.id}`} key={skill.id} prefetch>
							<SkillItem
								className="w-[100px] text-center"
								key={skill.id}
								skill={skill}
							/>
						</Link>
					);
				})}
			</div>
		</section>
	);
}
