import React from 'react';
import Link from 'next/link';

import { IconView } from '../IconView';

import { fetchSkills } from '@/api/notion/skills';
import { Title } from '@/components/Title';

export default async function SkillsSection() {
	const skills = await fetchSkills();

	return (
		<section className="h-screen flex justify-center items-center">
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
						const title =
							skill.properties['환경 및 기술'].title?.[0]?.text?.content;
						const iconSlug = skill.properties.iconSlug.rich_text[0]?.plain_text;
						return (
							<Link href={`/skills/${title}`} key={title}>
								<IconView
									className="w-[100px] text-center"
									key={title}
									title={title}
									iconSlug={iconSlug}
								/>
							</Link>
						);
					})}
				</div>
			</div>
		</section>
	);
}
