import { Text } from '@radix-ui/themes';
import { format } from 'date-fns';
import React from 'react';

import { getProjects } from '@/api/notion/projects';
import DebugView from '@/components/DebugView';
import { ProjectItem } from '@/components/ProjectItem';

export const revalidate = 3600;

export default async function ProjectsPage() {
  console.log('[SSG] ProjectsPage');

  const { projects, fetchedAt } = await getProjects();

  return (
    <section className="py-24 px-6 max-w-4xl mx-auto">
      <header className="mb-16">
        <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4 italic">
          Projects
        </h1>
        <p className="text-muted-foreground leading-relaxed max-w-xl">
          {projects.length}개 프로젝트. 개인 프로젝트부터 회사 제품까지.
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map(project => (
          <ProjectItem key={project.id} project={project} />
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
