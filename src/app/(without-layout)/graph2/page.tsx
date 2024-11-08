import React from 'react';

import { getSkillsWithRelated } from '@/api/notion/skill';
import GraphView from '@/components/GraphView';
import GraphView2 from '@/components/GraphView2';

export default async function SkillsPage() {
	const skillsWithRelated = await getSkillsWithRelated();

	return (
		<div>
			<GraphView2
				data={{
					nodes: skillsWithRelated.skills.map(skill => ({
						id: skill.id,
						name: skill.title,
						// relatedSkills: skill.relatedSkills.map(
						// 	relatedSkill => relatedSkill.id,
						// ),
					})),
					links: skillsWithRelated.skills.flatMap(skill =>
						skill.relatedSkills.map(relatedSkill => ({
							source: skill.id,
							target: relatedSkill.id,
						})),
					),
				}}
			/>
		</div>
	);
}
