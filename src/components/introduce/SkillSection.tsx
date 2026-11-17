import React from 'react';
import Link from 'next/link';

import { Section } from './Section';

import { getSkills } from '@/api/content/skills';
import { SafeSkillIcon } from '@/components/SafeSkillIcon';

const SKILL_PREVIEW_COUNT = 40;

export default async function SkillsSection() {
  const { skills } = await getSkills();

  return (
    <Section
      id="skills"
      title="Stack"
      action={
        <Link href="/skills" className="link text-muted-foreground">
          전체 {skills.length}개
        </Link>
      }
    >
      <ul className="flex flex-wrap gap-2">
        {skills.slice(0, SKILL_PREVIEW_COUNT).map((skill) => (
          <li key={skill.id}>
            <Link
              href={`/skills/${encodeURIComponent(skill.id)}`}
              aria-label={skill.title}
              title={skill.title}
              className="block rounded-lg border border-border bg-card p-2.5 transition-colors hover:border-border-strong"
            >
              <SafeSkillIcon skill={skill} />
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
