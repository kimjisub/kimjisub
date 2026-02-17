import React from 'react';
import { Text } from '@radix-ui/themes';
import { format } from 'date-fns';
import type { Metadata } from 'next';

import { getSkills } from '@/api/notion/skills';
import DebugView from '@/components/DebugView';
import { AnimatedSection, AnimatedTitle } from '@/components/motion/AnimatedSection';
import { SkillCategoryAnimated } from '@/components/SkillCategoryAnimated';
import { SkillsRadarChart } from '@/components/SkillsRadarChart';

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

      {/* Radar Chart */}
      <AnimatedSection delay={0.15} className="mb-20">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
          <div className="flex-shrink-0">
            <SkillsRadarChart skills={skills} size={320} />
          </div>
          <div className="md:pt-6 space-y-3 max-w-xs">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              Overview
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              각 축은 해당 영역의 스킬 숙련도와 프로젝트 적용 빈도를 바탕으로 산출된 종합 점수입니다.
              꼭짓점 위에 마우스를 올리면 세부 스킬을 확인할 수 있습니다.
            </p>
            <p className="text-xs text-muted-foreground/60 leading-relaxed">
              Score = average proficiency × project usage depth
            </p>
          </div>
        </div>
      </AnimatedSection>

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
