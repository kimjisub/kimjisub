/**
 * Project API - 단일 프로젝트 조회 + 관계 해결
 */

import * as path from 'path';

import { CareerT, getCareers } from './careers';
import { getProjects, ProjectT } from './projects';
import { getSkills, SkillT } from './skills';
import { CONTENT_DIR, readMdFile } from '.';

export const getProjectsWithRelated = async () => {
  const [careersRes, projectsRes, skillsRes] = await Promise.all([
    getCareers(),
    getProjects(),
    getSkills(),
  ]);

  const relatedProjects = projectsRes.projects.map(project => ({
    ...project,
    relatedTechSkills: project['주요 기술']
      .map(skillSlug => skillsRes.skills.find(skill => skill.id === skillSlug))
      .filter(Boolean) as SkillT[],
    relatedLanguageSkills: project['프로그래밍 언어']
      .map(skillSlug => skillsRes.skills.find(skill => skill.id === skillSlug))
      .filter(Boolean) as SkillT[],
    relatedCareers: project['대회 및 수료']
      .map(careerSlug =>
        careersRes.careers.find(career => career.id === careerSlug),
      )
      .filter(Boolean) as CareerT[],
  }));

  return {
    projects: relatedProjects,
    fetchedAt: projectsRes.fetchedAt,
  };
};

export const getProject = async (projectId: string) => {
  const projectsRes = await getProjectsWithRelated();
  const project = projectsRes.projects.find(
    project => project.id === projectId,
  );

  return {
    project,
    fetchedAt: projectsRes.fetchedAt,
  };
};

// 페이지 콘텐츠 (마크다운)
export const getProjectPage = async (projectId: string) => {
  const projectDir = path.join(CONTENT_DIR, 'projects', projectId);
  const mdContent = readMdFile(path.join(projectDir, 'index.md'));
  
  return {
    // 마크다운 콘텐츠
    markdown: mdContent || '',
    // 빈 ExtendedRecordMap (기존 코드 호환용)
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
