/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { unstable_cache } from 'next/cache';

import { CareerT, getCareers } from './careers';
import { getProjects } from './projects';
import { getSkills, SkillT } from './skills';
import { notionXApi } from '.';

export const getProjectsWithRelated = async () => {
  const [careersRes, projectsRes, skillsRes] = await Promise.all([
    getCareers(),
    getProjects(),
    getSkills(),
  ]);

  const relatedProjects = projectsRes.projects.map(project => ({
    ...project,
    relatedTechSkills: project['주요 기술']
      .map(skillId => skillsRes.skills.find(skill => skill.id === skillId))
      .filter(Boolean) as SkillT[],
    relatedLanguageSkills: project['프로그래밍 언어']
      .map(skillId => skillsRes.skills.find(skill => skill.id === skillId))
      .filter(Boolean) as SkillT[],
    relatedCareers: project['대회 및 수료']
      .map(careerId =>
        careersRes.careers.find(career => career.id === careerId),
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

export const getProjectPage = async (projectId: string) => {
  const getNotionPage = unstable_cache(
    async () => {
      const extendedRecordMap = await notionXApi.getPage(projectId);
      return {
        extendedRecordMap,
        fetchedAt: new Date(),
      };
    },
    ['project-page', projectId],
    {
      tags: ['project-page'],
      revalidate: 60 * 60,
    },
  );

  return await getNotionPage();
};
