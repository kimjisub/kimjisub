import Link from 'next/link';

import { Section } from './Section';

import { getProjects } from '@/api/content/projects';
import { ProjectItem } from '@/components/ProjectItem';

const FEATURED_COUNT = 4;

export default async function ProjectSection() {
  const { projects } = await getProjects();
  // 중요도순 목록에서 커버 이미지가 있는 것만 골라, 빈 카드가 대표 자리에 오지 않게 한다
  const featured = projects.filter((project) => project.cover).slice(0, FEATURED_COUNT);

  if (featured.length === 0) return null;

  return (
    <Section
      id="projects"
      title="Projects"
      action={
        <Link href="/projects" className="link text-muted-foreground">
          전체 {projects.length}개
        </Link>
      }
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {featured.map((project) => (
          <ProjectItem key={project.id} project={project} />
        ))}
      </div>
    </Section>
  );
}
