import React from 'react';

import { generateIconSvgCode } from '@/utils/icons';
import { IconView } from '../../IconView';
import { getSkills } from '@/api/notion/skills';
import Link from 'next/link';
import { SkillItem } from '@/components/SkillItem';

export const revalidate = false;
export default async function SkillsPage() {
	console.log('[SSG] SkillsPage');

	const skills = await getSkills();

	return (
		<section className="pt-16 h-screen mx-auto my-0 p-20 max-w-5xl">
			<h1 className="text-4xl font-bold">Skills</h1>
			<h2 className="text-2xl">제가 구사할 수 있는 능력들이에요</h2>

			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fill, 50px)',
					gridGap: '16px',
				}}>
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
