'use client';

import React from 'react';
import { Badge, Text } from '@radix-ui/themes';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';

import { ProjectT } from '@/api/notion/projects';
import { BlurImage } from '@/components/BlurImage';
import { TiltCard } from '@/components/TiltCard';

export interface ProjectItemProps {
  className?: string;
  project: ProjectT;
}

export const ProjectItem = ({ className, project }: ProjectItemProps) => {
  const icon = project.iconUrl ? (
    <Image
      className="mr-2 w-6 h-6"
      width={24}
      height={24}
      src={project.iconUrl}
      alt={`${project.title} 아이콘`}
    />
  ) : project.iconEmoji ? (
    <span className="mr-2">{project.iconEmoji}</span>
  ) : null;

  const coverImage = project.coverImageUrl ? (
    <BlurImage
      className="w-full h-full transition-transform duration-500 group-hover:scale-110"
      width={400}
      height={200}
      src={project.coverImageUrl}
      alt={`${project.title} 프로젝트 커버 이미지`}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    />
  ) : (
    <div className="w-full h-full bg-gradient-to-br from-secondary to-primary" aria-label={`${project.title} 프로젝트`} />
  );

  return (
    <Link href={`/projects/${project.id}`} prefetch className="group">
      <TiltCard className="w-full">
      <article
        className={`cursor-pointer rounded-2xl border border-border bg-card overflow-hidden shadow-md hover:shadow-xl ${className}`}
      >
        <div className="relative overflow-hidden">
          <div className="aspect-video">{coverImage}</div>
          <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-colors duration-300" />
          <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-sm border border-border">
            <p className="text-sm font-medium text-foreground flex items-center">
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
      </TiltCard>
    </Link>
  );
};
