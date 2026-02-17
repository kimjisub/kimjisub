import React from 'react';
import type { Metadata } from 'next';
import { Text } from '@radix-ui/themes';
import { format } from 'date-fns';

import { getProjects } from '@/api/notion/projects';
import DebugView from '@/components/DebugView';
import { AnimatedGridItem,AnimatedSection, AnimatedTitle } from '@/components/motion/AnimatedSection';
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
    <section className="py-24 px-6 max-w-4xl mx-auto">
      <header className="mb-16">
        <AnimatedTitle className="font-serif text-3xl md:text-4xl text-foreground mb-4 italic">
          Projects
        </AnimatedTitle>
        <AnimatedSection delay={0.1}>
          <p className="text-muted-foreground leading-relaxed max-w-xl">
            {projects.length}개 프로젝트. 개인 프로젝트부터 회사 제품까지.
          </p>
        </AnimatedSection>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <AnimatedGridItem key={project.id} index={index}>
            <ProjectItem project={project} />
          </AnimatedGridItem>
        ))}
      </div>

      <DebugView>
        <Text className="text-muted-foreground text-sm">
          {format(fetchedAt, 'yyyy-MM-dd HH:mm:ss')}
        </Text>
      </DebugView>
    </section>
  );
}
