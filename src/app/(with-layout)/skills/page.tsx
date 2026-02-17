import { Text } from '@radix-ui/themes';
import { format } from 'date-fns';
import React from 'react';

import { getSkills } from '@/api/notion/skills';
import DebugView from '@/components/DebugView';
import { SkillItem } from '@/components/SkillItem';

export const revalidate = 3600;

const SkillCategory = ({ title, skills }: { title: string; skills: any[] }) => (
  <div className="mb-10">
    <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">{title}</h3>
    <div className="flex flex-wrap gap-2">
      {skills.map(skill => (
        <SkillItem key={skill.id} skill={skill} variant="inline" />
      ))}
    </div>
  </div>
);

export default async function SkillsPage() {
  console.log('[SSG] SkillsPage');

  const { skills, fetchedAt } = await getSkills();

  const categories = [
    { key: '언어', title: 'Languages' },
    { key: '기술', title: 'Frameworks & Libraries' },
    { key: 'DB', title: 'Databases' },
    { key: 'IDE', title: 'IDE' },
    { key: '개발 도구', title: 'Dev Tools' },
    { key: '프로토콜', title: 'Protocols' },
    { key: 'Infra', title: 'Infrastructure' },
    { key: 'CI/CD', title: 'CI/CD' },
    { key: 'OS', title: 'Operating Systems' },
    { key: '하드웨어', title: 'Hardware' },
    { key: '플랫폼', title: 'Platforms' },
    { key: '협업/문서', title: 'Collaboration' },
    { key: '디자인', title: 'Design' },
    { key: '음악', title: 'Music' },
    { key: '개념', title: 'Concepts' },
  ];

  return (
    <section className="py-24 px-6 max-w-4xl mx-auto">
      <header className="mb-16">
        <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4 italic">
          Skills
        </h1>
        <p className="text-muted-foreground leading-relaxed max-w-xl">
          실제로 써본 것들만 올렸습니다.
        </p>
      </header>

      <div>
        {categories.map(cat => {
          const filtered = skills.filter(skill => skill.분류.includes(cat.key));
          if (filtered.length === 0) return null;
          return <SkillCategory key={cat.key} title={cat.title} skills={filtered} />;
        })}
      </div>

      <DebugView>
        <Text className="text-muted-foreground text-sm">
          {format(fetchedAt, 'yyyy-MM-dd HH:mm:ss')}
        </Text>
      </DebugView>
    </section>
  );
}
