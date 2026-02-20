/**
 * Projects API - meta.tsx static import 방식
 */

import { StaticImageData } from 'next/image';
import { parseISO } from 'date-fns';

import { NotionColor } from '../type/color';
import { projectsMetas } from '@/content/projects/_index';

export type ProjectT = {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: StaticImageData | null;
  iconEmoji: string;
  cover: StaticImageData | null;
  github: string;
  youtube: string;
  url: string;
  '맡은 업무': { name: string; color: NotionColor }[];
  태그: { name: string; color: NotionColor }[];
  중요도: {
    value: string;
    color: NotionColor;
  };
  '주요 기술': string[];
  '프로그래밍 언어': string[];
  date: {
    start?: Date;
    end?: Date;
  };
  분류: { name: string; color: NotionColor }[];
  '대회 및 수료': string[];
};

function loadProjects(): ProjectT[] {
  const projects: ProjectT[] = [];
  
  for (const [slug, meta] of Object.entries(projectsMetas)) {
    // visible이 false면 스킵
    if ((meta as any).visible === false) continue;
    
    const m = meta as any;
    
    projects.push({
      id: slug,
      slug,
      title: m.title || m['이름'] || '',
      description: m['설명'] || '',
      icon: m.icon || null,
      iconEmoji: m.iconEmoji || '',
      cover: m.cover || null,
      github: m.Github || m.GitHub || '',
      youtube: m.Youtube || '',
      url: m.URL || '',
      '맡은 업무': (m['맡은 업무'] || []).map((name: string) => ({
        name,
        color: 'default' as NotionColor,
      })),
      태그: (m['태그'] || []).map((name: string) => ({
        name,
        color: 'default' as NotionColor,
      })),
      중요도: {
        value: m['중요도'] || '',
        color: 'default' as NotionColor,
      },
      '주요 기술': m['주요 기술'] || [],
      '프로그래밍 언어': m['프로그래밍 언어'] || [],
      date: {
        start: m['날짜'] ? parseISO(m['날짜']) : undefined,
        end: undefined,
      },
      분류: (m['분류'] || []).map((name: string) => ({
        name,
        color: 'default' as NotionColor,
      })),
      '대회 및 수료': m['대회 및 수료'] || [],
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
