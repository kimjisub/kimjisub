/**
 * Projects API - 로컬 파일 기반
 */

import * as path from 'path';
import { parseISO } from 'date-fns';

import { NotionColor } from '../type/color';
import { CONTENT_DIR, getDirectories, readJsonFile, findImageFile } from '.';

export type ProjectT = {
  id: string;        // slug를 ID로 사용
  slug: string;      // URL용 slug
  title: string;
  description: string;
  iconUrl: string;
  iconEmoji: string;
  coverImageUrl: string;
  github: string;
  youtube: string;
  url: string;
  '맡은 업무': { name: string; color: NotionColor }[];
  태그: { name: string; color: NotionColor }[];
  중요도: {
    value: string;
    color: NotionColor;
  };
  '주요 기술': string[];      // skill slugs
  '프로그래밍 언어': string[]; // skill slugs (languages)
  date: {
    start?: Date;
    end?: Date;
  };
  분류: { name: string; color: NotionColor }[];
  '대회 및 수료': string[];   // career slugs
};

// 로컬 meta.json 타입
interface ProjectMeta {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  date: { start: string | null; end: string | null };
  github: string | null;
  youtube: string | null;
  url: string | null;
  importance: string | null;
  tags: { name: string; color: string }[];
  categories: { name: string; color: string }[];
  assignedTasks: { name: string; color: string }[];
  techSkills: string[];
  languages: string[];
  relatedCareers: string[];
  iconUrl: string | null;
  iconEmoji: string | null;
  coverUrl: string | null;
}

function loadProjects(): ProjectT[] {
  const projectsDir = path.join(CONTENT_DIR, 'projects');
  const slugs = getDirectories(projectsDir);
  
  const projects: ProjectT[] = [];
  
  for (const slug of slugs) {
    const projectDir = path.join(projectsDir, slug);
    const metaPath = path.join(projectDir, 'meta.json');
    const meta = readJsonFile<ProjectMeta>(metaPath);
    
    if (!meta) continue;
    
    // 로컬 이미지 파일 찾기 (있으면 사용, 없으면 원본 URL)
    const localIcon = findImageFile(projectDir, 'icon');
    const localCover = findImageFile(projectDir, 'cover');
    
    projects.push({
      id: slug,  // slug를 ID로 사용
      slug,
      title: meta.title || '',
      description: meta.description || '',
      iconUrl: localIcon || meta.iconUrl || '',
      iconEmoji: meta.iconEmoji || '',
      coverImageUrl: localCover || meta.coverUrl || '',
      github: meta.github || '',
      youtube: meta.youtube || '',
      url: meta.url || '',
      '맡은 업무': (meta.assignedTasks || []).map(t => ({
        name: t.name,
        color: t.color as NotionColor,
      })),
      태그: (meta.tags || []).map(t => ({
        name: t.name,
        color: t.color as NotionColor,
      })),
      중요도: {
        value: meta.importance || '',
        color: 'default' as NotionColor,
      },
      '주요 기술': meta.techSkills || [],
      '프로그래밍 언어': meta.languages || [],
      date: {
        start: meta.date?.start ? parseISO(meta.date.start) : undefined,
        end: meta.date?.end ? parseISO(meta.date.end) : undefined,
      },
      분류: (meta.categories || []).map(c => ({
        name: c.name,
        color: c.color as NotionColor,
      })),
      '대회 및 수료': meta.relatedCareers || [],
    });
  }
  
  // 중요도 기준 정렬
  projects.sort((a, b) => {
    const aVal = a.중요도.value || '999';
    const bVal = b.중요도.value || '999';
    return aVal.localeCompare(bVal);
  });
  
  return projects;
}

// 캐시
let projectsCache: { projects: ProjectT[]; fetchedAt: Date } | null = null;

export const getProjects = async () => {
  if (!projectsCache) {
    const projects = loadProjects();
    projectsCache = {
      projects,
      fetchedAt: new Date(),
    };
  }
  return projectsCache;
};
