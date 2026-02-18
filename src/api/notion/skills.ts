/**
 * Skills API - 로컬 파일 기반
 */

import * as path from 'path';

import { CONTENT_DIR, getDirectories, readJsonFile, findImageFile } from '.';

export type SkillT = {
  id: string;        // slug를 ID로 사용
  slug: string;
  title: string;
  iconColor: string;
  분류: string[];
  상위_항목: string[];
  visible: boolean;
  하위_항목: string[];
  숙련도: string;
  사용한_횟수: number;
  projectUsedBySkill: string[];    // project slugs
  projectUsedByLanguage: string[]; // project slugs
  관련_기술: string[];             // skill slugs
  description: string;
  iconUrl: string;
  iconEmoji: string;
  coverImageUrl: string;
};

// 로컬 meta.json 타입
interface SkillMeta {
  id: string;
  slug: string;
  title: string;
  iconSlug: string | null;
  iconColor: string | null;
  description: string | null;
  category: string[];
  proficiency: string | null;
  visible: boolean;
  parentSkills: string[];
  childSkills: string[];
  relatedSkills: string[];
  usedInProjects: string[];
  iconUrl: string | null;
  iconEmoji: string | null;
  coverUrl: string | null;
  // 빌드 시점에 추가되는 역방향 관계
  projectsUsingAsSkill?: string[];
  projectsUsingAsLanguage?: string[];
}

function loadSkills(): SkillT[] {
  const skillsDir = path.join(CONTENT_DIR, 'skills');
  const slugs = getDirectories(skillsDir);
  
  const skills: SkillT[] = [];
  
  for (const slug of slugs) {
    const skillDir = path.join(skillsDir, slug);
    const metaPath = path.join(skillDir, 'meta.json');
    const meta = readJsonFile<SkillMeta>(metaPath);
    
    if (!meta) continue;
    
    // 로컬 이미지 파일 찾기
    const localIcon = findImageFile(skillDir, 'icon');
    const localCover = findImageFile(skillDir, 'cover');
    
    // 사용 횟수 계산 (skill + language로 사용된 프로젝트 수)
    const usedAsSkill = meta.projectsUsingAsSkill?.length || 0;
    const usedAsLanguage = meta.projectsUsingAsLanguage?.length || 0;
    
    skills.push({
      id: slug,  // slug를 ID로 사용
      slug,
      title: meta.title || '',
      iconColor: meta.iconColor || '',
      분류: meta.category || [],
      상위_항목: meta.parentSkills || [],
      visible: meta.visible !== false,
      하위_항목: meta.childSkills || [],
      숙련도: meta.proficiency || '',
      사용한_횟수: usedAsSkill + usedAsLanguage,
      projectUsedBySkill: meta.projectsUsingAsSkill || [],
      projectUsedByLanguage: meta.projectsUsingAsLanguage || [],
      관련_기술: meta.relatedSkills || [],
      description: meta.description || '',
      iconUrl: localIcon || meta.iconUrl || '',
      iconEmoji: meta.iconEmoji || '',
      coverImageUrl: localCover || meta.coverUrl || '',
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
