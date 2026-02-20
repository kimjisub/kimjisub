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

// 로컬 meta.json 타입 (새 형식 - 한글 키)
interface CareerMeta {
  id: string;
  title: string;
  '이름'?: string;
  '설명'?: string;
  '날짜'?: string;
  '기관'?: string[];
  '분류'?: string[];
  '맡은 업무'?: string[];
  '중요도'?: string;
  URL?: string;
  '수상 및 자격증'?: string;
  visible?: boolean;
  iconUrl?: string;
  coverUrl?: string;
  iconEmoji?: string;
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
    
    // visible이 false면 스킵
    if (meta.visible === false) continue;
    
    // 로컬 이미지 파일 찾기
    const assetsDir = path.join(careerDir, 'assets');
    const localIcon = findImageFile(assetsDir, 'icon');
    const localCover = findImageFile(assetsDir, 'cover');
    
    careers.push({
      id: slug,
      slug,
      title: meta.title || meta['이름'] || '',
      description: meta['설명'] || '',
      iconUrl: localIcon || meta.iconUrl || '',
      iconEmoji: meta.iconEmoji || '',
      coverImageUrl: localCover || meta.coverUrl || '',
      relatedProjects: meta.relatedProjects || [],
      awardsAndCertifications: meta['수상 및 자격증'] || '',
      institutions: (meta['기관'] || []).map(name => ({
        name,
        color: 'default' as NotionColor,
      })),
      importance: meta['중요도'] || '',
      url: meta.URL || '',
      categories: (meta['분류'] || []).map(name => ({
        name,
        color: 'default' as NotionColor,
      })),
      date: {
        start: meta['날짜'] ? parseISO(meta['날짜']) : undefined,
        end: undefined,
      },
      assignedTasks: (meta['맡은 업무'] || []).map(name => ({
        name,
        color: 'default' as NotionColor,
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
