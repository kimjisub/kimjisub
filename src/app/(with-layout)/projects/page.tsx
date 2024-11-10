import React from 'react';
import { Text } from '@radix-ui/themes';
import { format } from 'date-fns';

import { getProjects } from '@/api/notion/projects';
import DebugView from '@/components/DebugView';
import { ProjectItem } from '@/components/ProjectItem';
import { Title } from '@/components/Title';

export const revalidate = 3600;

export default async function ProjectsPage() {
  console.log('[SSG] ProjectsPage');

  const { projects, fetchedAt } = await getProjects();

  return (
    <div className="pt-16 mx-auto p-6 max-w-5xl">
      <Title
        title="프로젝트"
        subTitle="새로운 것을 만든다는 것은 언제나 짜릿합니다. 제가 진행했던 다양한 프로젝트들입니다."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5 justify-center max-x-1xl">
        {projects.map(project => (
          <ProjectItem key={project.id} project={project} />
        ))}
      </div>

      <DebugView>
        <Text>{format(fetchedAt, 'yyyy-MM-dd HH:mm:ss')}</Text>
      </DebugView>
    </div>
  );
}
