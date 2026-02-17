import React from 'react';
import type { Metadata } from 'next';
import { Text } from '@radix-ui/themes';
import { format } from 'date-fns';

import { getSkills } from '@/api/notion/skills';
import DebugView from '@/components/DebugView';
import { AnimatedSection,AnimatedTitle } from '@/components/motion/AnimatedSection';
import { SkillCategoryAnimated } from '@/components/SkillCategoryAnimated';

export const metadata: Metadata = {
	title: 'Skills',
	description: '김지섭의 기술 스택. 프로그래밍 언어, 프레임워크, 데이터베이스, 개발 도구, 인프라 등 실제로 사용해본 기술들.',
	openGraph: {
		title: 'Skills | Jisub Kim',
		description: '김지섭의 기술 스택. 실제로 사용해본 기술들만 정리했습니다.',
		type: 'website',
		images: ['/logo512.png'],
	},
	twitter: {
		card: 'summary',
		title: 'Skills | Jisub Kim',
		description: '김지섭의 기술 스택.',
	},
};

export const revalidate = 3600;

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
        <AnimatedTitle className="font-serif text-3xl md:text-4xl text-foreground mb-4 italic">
          Skills
        </AnimatedTitle>
        <AnimatedSection delay={0.1}>
          <p className="text-muted-foreground leading-relaxed max-w-xl">
            실제로 써본 것들만 올렸습니다.
          </p>
        </AnimatedSection>
      </header>

      <div>
        {categories.map((cat, index) => {
          const filtered = skills.filter(skill => skill.분류.includes(cat.key));
          if (filtered.length === 0) return null;
          return (
            <SkillCategoryAnimated 
              key={cat.key} 
              title={cat.title} 
              skills={filtered}
              categoryIndex={index}
            />
          );
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
