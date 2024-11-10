import React from 'react';

import { getSkillsWithRelated } from '@/api/notion/skill';
import ForceGraph from '@/components/ForceGraph';
import { IconSlugView } from '@/components/IconSlugView';

export default async function SkillsPage() {
  const skillsWithRelated = await getSkillsWithRelated();

  return (
    <div>
      <ForceGraph
        data={{
          nodes: skillsWithRelated.skills.map(skill => ({
            id: skill.id,
            name: skill.title,
            svg: <IconSlugView slug={skill.slug} />,

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
