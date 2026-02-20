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

// 로컬 meta.json 타입 (새 형식 - 한글 키)
interface ProjectMeta {
  id: string;
  title: string;
  '이름'?: string;
  '설명'?: string;
  '날짜'?: string;
  GitHub?: string;
  Youtube?: string;
  URL?: string;
  '중요도'?: string;
  '태그'?: string[];
  '분류'?: string[];
  '맡은 업무'?: string[];
  '주요 기술'?: string[];
  '프로그래밍 언어'?: string[];
  '대회 및 수료'?: string[];
  visible?: boolean;
  iconUrl?: string;
  coverUrl?: string;
  iconEmoji?: string;
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
    
    // visible이 false면 스킵
    if (meta.visible === false) continue;
    
    // 로컬 이미지 파일 찾기
    const assetsDir = path.join(projectDir, 'assets');
    const localIcon = findImageFile(assetsDir, 'icon');
    const localCover = findImageFile(assetsDir, 'cover');
    
    projects.push({
      id: slug,
      slug,
      title: meta.title || meta['이름'] || '',
      description: meta['설명'] || '',
      iconUrl: localIcon || meta.iconUrl || '',
      iconEmoji: meta.iconEmoji || '',
      coverImageUrl: localCover || meta.coverUrl || '',
      github: meta.GitHub || '',
      youtube: meta.Youtube || '',
      url: meta.URL || '',
      '맡은 업무': (meta['맡은 업무'] || []).map(name => ({
        name,
        color: 'default' as NotionColor,
      })),
      태그: (meta['태그'] || []).map(name => ({
        name,
        color: 'default' as NotionColor,
      })),
      중요도: {
        value: meta['중요도'] || '',
        color: 'default' as NotionColor,
      },
      '주요 기술': meta['주요 기술'] || [],
      '프로그래밍 언어': meta['프로그래밍 언어'] || [],
      date: {
        start: meta['날짜'] ? parseISO(meta['날짜']) : undefined,
        end: undefined,
      },
      분류: (meta['분류'] || []).map(name => ({
        name,
        color: 'default' as NotionColor,
      })),
      '대회 및 수료': meta['대회 및 수료'] || [],
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
