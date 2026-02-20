/**
 * Careers API - meta.tsx static import 방식
 */

import { StaticImageData } from 'next/image';
import { parseISO } from 'date-fns';

import { NotionColor } from '../type/color';
import { careersMetas } from '@/content/careers/_index';

export type CareerT = {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: StaticImageData | null;
  iconEmoji: string;
  cover: StaticImageData | null;
  relatedProjects: string[];
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

function loadCareers(): CareerT[] {
  const careers: CareerT[] = [];
  
  for (const [slug, meta] of Object.entries(careersMetas)) {
    const m = meta as any;
    
    // visible이 false면 스킵
    if (m.visible === false) continue;
    
    careers.push({
      id: slug,
      slug,
      title: m.title || m['이름'] || '',
      description: m['설명'] || '',
      icon: m.icon || null,
      iconEmoji: m.iconEmoji || '',
      cover: m.cover || null,
      relatedProjects: m.relatedProjects || [],
      awardsAndCertifications: m['수상 및 자격증'] || '',
      institutions: (m['기관'] || []).map((name: string) => ({
        name,
        color: 'default' as NotionColor,
      })),
      importance: m['중요도'] || '',
      url: m.URL || '',
      categories: (m['분류'] || []).map((name: string) => ({
        name,
        color: 'default' as NotionColor,
      })),
      date: {
        start: m['날짜'] ? parseISO(m['날짜']) : undefined,
        end: undefined,
      },
      assignedTasks: (m['맡은 업무'] || []).map((name: string) => ({
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
