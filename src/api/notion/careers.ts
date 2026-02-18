/**
 * Careers API - 로컬 파일 기반
 */

import * as path from 'path';
import { parseISO } from 'date-fns';

import { NotionColor } from '../type/color';
import { CONTENT_DIR, getDirectories, readJsonFile, findImageFile } from '.';

export type CareerT = {
  id: string;        // slug를 ID로 사용
  slug: string;
  title: string;
  description: string;
  iconUrl: string;
  iconEmoji: string;
  coverImageUrl: string;
  relatedProjects: string[];  // project slugs
  awardsAndCertifications: string;
  institutions: { name: string; color: NotionColor }[];
  importance: string;
  url: string;
  categories: { name: string; color: NotionColor }[];
  date: {
    start?: Date;
    end?: Date;
  };
  assignedTasks: { name: string; color: NotionColor }[];
};

// 로컬 meta.json 타입
interface CareerMeta {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  date: { start: string | null; end: string | null };
  institutions: { name: string; color: string }[];
  categories: { name: string; color: string }[];
  assignedTasks: { name: string; color: string }[];
  importance: string | null;
  url: string | null;
  awardsAndCertifications: string | null;
  iconUrl: string | null;
  iconEmoji: string | null;
  coverUrl: string | null;
  // 빌드 시점에 추가되는 역방향 관계
  relatedProjects?: string[];
}

function loadCareers(): CareerT[] {
  const careersDir = path.join(CONTENT_DIR, 'careers');
  const slugs = getDirectories(careersDir);
  
  const careers: CareerT[] = [];
  
  for (const slug of slugs) {
    const careerDir = path.join(careersDir, slug);
    const metaPath = path.join(careerDir, 'meta.json');
    const meta = readJsonFile<CareerMeta>(metaPath);
    
    if (!meta) continue;
    
    // 로컬 이미지 파일 찾기
    const localIcon = findImageFile(careerDir, 'icon');
    const localCover = findImageFile(careerDir, 'cover');
    
    careers.push({
      id: slug,  // slug를 ID로 사용
      slug,
      title: meta.title || '',
      description: meta.description || '',
      iconUrl: localIcon || meta.iconUrl || '',
      iconEmoji: meta.iconEmoji || '',
      coverImageUrl: localCover || meta.coverUrl || '',
      relatedProjects: meta.relatedProjects || [],
      awardsAndCertifications: meta.awardsAndCertifications || '',
      institutions: (meta.institutions || []).map(i => ({
        name: i.name,
        color: i.color as NotionColor,
      })),
      importance: meta.importance || '',
      url: meta.url || '',
      categories: (meta.categories || []).map(c => ({
        name: c.name,
        color: c.color as NotionColor,
      })),
      date: {
        start: meta.date?.start ? parseISO(meta.date.start) : undefined,
        end: meta.date?.end ? parseISO(meta.date.end) : undefined,
      },
      assignedTasks: (meta.assignedTasks || []).map(t => ({
        name: t.name,
        color: t.color as NotionColor,
      })),
    });
  }
  
  // 날짜 기준 내림차순 정렬
  careers.sort((a, b) => {
    const aDate = a.date.start?.getTime() || 0;
    const bDate = b.date.start?.getTime() || 0;
    return bDate - aDate;
  });
  
  return careers;
}

// 캐시
let careersCache: { careers: CareerT[]; fetchedAt: Date } | null = null;

export const getCareers = async () => {
  if (!careersCache) {
    const careers = loadCareers();
    careersCache = {
      careers,
      fetchedAt: new Date(),
    };
  }
  return careersCache;
};
