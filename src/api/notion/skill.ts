/**
 * Skill API - 단일 스킬 조회 + 관계 해결
 */

import * as path from 'path';

import { getCareers } from './careers';
import { getProjects, ProjectT } from './projects';
import { getSkills, SkillT } from './skills';
import { CONTENT_DIR, readMdFile } from '.';

export type SkillsWithRelatedT = Awaited<
  ReturnType<typeof getSkillsWithRelated>
>;

export const getSkillsWithRelated = async () => {
  const [_careersRes, projectsRes, skillsRes] = await Promise.all([
    getCareers(),
    getProjects(),
    getSkills(),
  ]);

  const relatedSkills = skillsRes.skills.map(skill => ({
    ...skill,
    relatedSkills: skill['관련_기술']
      .map(skillSlug => skillsRes.skills.find(s => s.id === skillSlug))
      .filter(Boolean) as SkillT[],
    relatedProjectsUsedByLanguage: skill.projectUsedByLanguage
      .map(projectSlug =>
        projectsRes.projects.find(project => project.id === projectSlug),
      )
      .filter(Boolean) as ProjectT[],
    relatedProjectsUsedBySkill: skill.projectUsedBySkill
      .map(projectSlug =>
        projectsRes.projects.find(project => project.id === projectSlug),
      )
      .filter(Boolean) as ProjectT[],
  }));

  return {
    skills: relatedSkills,
    fetchedAt: skillsRes.fetchedAt,
  };
};

export const getSkill = async (skillId: string) => {
  const skillsRes = await getSkillsWithRelated();
  const skill = skillsRes.skills.find(skill => skill.id === skillId);

  return {
    skill,
    fetchedAt: skillsRes.fetchedAt,
  };
};

// 페이지 콘텐츠 (마크다운)
export const getSkillPage = async (skillId: string) => {
  const skillDir = path.join(CONTENT_DIR, 'skills', skillId);
  const mdContent = readMdFile(path.join(skillDir, 'index.md'));
  
  return {
    markdown: mdContent || '',
    extendedRecordMap: {
      block: {},
      collection: {},
      collection_view: {},
      notion_user: {},
      collection_query: {},
      signed_urls: {},
    },
    fetchedAt: new Date(),
  };
};
