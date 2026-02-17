import React from 'react';
import { Text } from '@radix-ui/themes';
import { format } from 'date-fns';
import type { Metadata } from 'next';

import { getProjects } from '@/api/notion/projects';
import DebugView from '@/components/DebugView';
import { ProjectCarousel } from '@/components/ProjectCarousel';
import { AnimatedGridItem, AnimatedSection, AnimatedTitle } from '@/components/motion/AnimatedSection';
import { ProjectItem } from '@/components/ProjectItem';

export const metadata: Metadata = {
	title: 'Projects',
	description: '김지섭이 진행한 프로젝트 목록. 개인 프로젝트부터 회사 제품까지 다양한 소프트웨어, 펌웨어, 인프라 프로젝트.',
	openGraph: {
		title: 'Projects | Jisub Kim',
		description: '김지섭이 진행한 프로젝트 목록. 개인 프로젝트부터 회사 제품까지.',
		type: 'website',
		images: ['/logo512.png'],
	},
	twitter: {
		card: 'summary',
		title: 'Projects | Jisub Kim',
		description: '김지섭이 진행한 프로젝트 목록.',
	},
};

export const revalidate = 3600;

export default async function ProjectsPage() {
  console.log('[SSG] ProjectsPage');

  const { projects, fetchedAt } = await getProjects();

  return (
    <section className="py-24 max-w-7xl mx-auto">
      {/* 헤더 */}
      <header className="mb-12 px-6">
        <AnimatedTitle className="font-serif text-3xl md:text-4xl text-foreground mb-4 italic">
          Projects
        </AnimatedTitle>
        <AnimatedSection delay={0.1}>
          <p className="text-muted-foreground leading-relaxed max-w-xl">
            {projects.length}개 프로젝트. 개인 프로젝트부터 회사 제품까지.
          </p>
        </AnimatedSection>
      </header>

      {/* 데스크탑: 수평 캐러셀 */}
      <AnimatedSection delay={0.2} className="hidden md:block">
        <ProjectCarousel projects={projects} />
      </AnimatedSection>

      {/* 모바일: 세로 그리드 */}
      <div className="md:hidden px-6 grid grid-cols-1 gap-6">
        {projects.map((project, index) => (
          <AnimatedGridItem
            key={project.id}
            index={index}
            className="transition-opacity duration-200"
          >
            <ProjectItem project={project} />
          </AnimatedGridItem>
        ))}
      </div>

      <DebugView>
        <Text className="text-muted-foreground text-sm px-6">
          {format(fetchedAt, 'yyyy-MM-dd HH:mm:ss')}
        </Text>
      </DebugView>
    </section>
  );
}
