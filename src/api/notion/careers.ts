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
  awardRank: string;
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
      awardsAndCertifications: m['수상 및 자격증'] || m['수상 및 수료'] || '',
      awardRank: m['수상 순위'] || '',
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
        end: m['종료일'] ? parseISO(m['종료일']) : undefined,
      },
      assignedTasks: (m['맡은 업무'] || []).map((name: string) => ({
        name,
        color: 'default' as NotionColor,
      })),
    });
  }
  
  // 정렬: 진행 중(end 없음) 먼저, 그 다음 시작일 내림차순
  careers.sort((a, b) => {
    const aOngoing = !a.date.end;
    const bOngoing = !b.date.end;
    
    // 진행 중인 것 먼저
    if (aOngoing && !bOngoing) return -1;
    if (!aOngoing && bOngoing) return 1;
    
    // 둘 다 진행 중이거나 둘 다 완료면 시작일 내림차순
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
