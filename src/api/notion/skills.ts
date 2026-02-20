/**
 * Skills API - meta.tsx static import 방식
 */

import { StaticImageData } from 'next/image';

import { skillsMetas } from '@/content/skills/_index';

export type SkillT = {
  id: string;
  slug: string;
  title: string;
  iconColor: string;
  분류: string[];
  상위_항목: string[];
  visible: boolean;
  하위_항목: string[];
  숙련도: string;
  사용한_횟수: number;
  projectUsedBySkill: string[];
  projectUsedByLanguage: string[];
  관련_기술: string[];
  description: string;
  icon: StaticImageData | null;
  iconEmoji: string;
  cover: StaticImageData | null;
};

function loadSkills(): SkillT[] {
  const skills: SkillT[] = [];
  
  for (const [slug, meta] of Object.entries(skillsMetas)) {
    const m = meta as any;
    
    // visible이 false면 스킵
    if (m.visible === false) continue;
    
    // 사용 횟수 계산
    const usedAsSkill = m.projectsUsingAsSkill?.length || 0;
    const usedAsLanguage = m.projectsUsingAsLanguage?.length || 0;
    
    skills.push({
      id: slug,
      slug,
      title: m.title || m['이름'] || '',
      iconColor: m.iconColor || '',
      분류: m['분류'] || [],
      상위_항목: m['상위_항목'] || [],
      visible: m.visible ?? true,
      하위_항목: m['하위_항목'] || [],
      숙련도: m['숙련도'] || '',
      사용한_횟수: usedAsSkill + usedAsLanguage,
      projectUsedBySkill: m.projectsUsingAsSkill || [],
      projectUsedByLanguage: m.projectsUsingAsLanguage || [],
      관련_기술: m['관련_기술'] || [],
      description: m['설명'] || '',
      icon: m.icon || null,
      iconEmoji: m.iconEmoji || '',
      cover: m.cover || null,
    });
  }
  
  return skills;
}

// 캐시
let skillsCache: { skills: SkillT[]; fetchedAt: Date } | null = null;

export const getSkills = async () => {
  if (!skillsCache) {
    const skills = loadSkills();
    skillsCache = {
      skills,
      fetchedAt: new Date(),
    };
  }
  return skillsCache;
};
