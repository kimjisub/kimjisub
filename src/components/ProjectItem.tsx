'use client';

import React from 'react';
import { Badge, Text } from '@radix-ui/themes';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';

import { ProjectT } from '@/api/content/projects';
import { BlurImage } from '@/components/BlurImage';

export interface ProjectItemProps {
  className?: string;
  project: ProjectT;
}

export const ProjectItem = ({ className, project }: ProjectItemProps) => {
  const icon = project.icon ? (
    <Image
      className="mr-2 w-6 h-6"
      width={24}
      height={24}
      src={project.icon}
      alt={`${project.title} 아이콘`}
    />
  ) : project.iconEmoji ? (
    <span className="mr-2">{project.iconEmoji}</span>
  ) : null;

  const coverImage = project.cover ? (
    <BlurImage
      className="w-full h-full"
      width={400}
      height={200}
      src={project.cover}
      alt={`${project.title} 프로젝트 커버 이미지`}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    />
  ) : (
    <div className="w-full h-full bg-gradient-to-br from-secondary to-primary" aria-label={`${project.title} 프로젝트`} />
  );

  return (
    <Link href={`/projects/${encodeURIComponent(project.id)}`} prefetch className="group block h-full">
      <article
        className={`h-full rounded-2xl border border-border bg-card overflow-hidden transition-colors group-hover:border-border-strong ${className ?? ''}`}
      >
        <div className="relative overflow-hidden">
          <div className="aspect-[1200/630]">{coverImage}</div>
          <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10">
            <p className="text-sm font-medium text-white flex items-center">
              {icon}
              {project.title}
            </p>
          </div>
        </div>
        <div className="p-5">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.태그.slice(0, 3).map(tag => (
              <Badge key={tag.name} color={tag.color} variant="soft" size="1">
                {tag.name}
              </Badge>
            ))}
            {project.분류.slice(0, 2).map(category => (
              <Badge key={category.name} color={category.color} variant="soft" size="1">
                {category.name}
              </Badge>
            ))}
          </div>
          <Text className="text-sm text-muted-foreground line-clamp-2" as="p">
            {project.description}
          </Text>
          {project.date.start && (
            <Text className="text-xs text-muted-foreground mt-3 block" as="p">
              {format(project.date.start, 'yyyy-MM-dd')}
            </Text>
          )}
        </div>
      </article>
    </Link>
  );
};
