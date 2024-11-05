import React from 'react';
import Link from 'next/link';

import { getSkills } from '@/api/notion/skills';
import { IconSlugView } from '@/components/IconSlugView';
import { Title } from '@/components/Title';

export default async function SkillsSection() {
	const skills = await getSkills();

	return (
		<section className="flex justify-center items-center">
			<div className="w-full max-w-5xl mx-auto px-4">
				<Title title="Skills" subTitle="제가 구사할 수 있는 능력들이에요" />

				<div
					className="my-8"
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fill, 50px)',
						gridGap: '16px',
					}}>
					{skills.map(skill => {
						return (
							<Link href={`/skills/${skill.id}`} key={skill.id}>
								<IconSlugView
									className="w-[100px] text-center"
									key={skill.id}
									title={skill.title}
									slug={skill.slug}
									color={skill.iconColor}
									raw={skill}
								/>
							</Link>
						);
					})}
				</div>
			</div>
		</section>
	);
}
