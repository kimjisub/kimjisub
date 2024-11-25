/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { unstable_cache } from 'next/cache';

import { getCareers } from './careers';
import { getProjects, ProjectT } from './projects';
import { getSkills, SkillT } from './skills';
import { notionXApi } from '.';

export type SkillsWithRelatedT = Awaited<
  ReturnType<typeof getSkillsWithRelated>
>;

export const getSkillsWithRelated = async () => {
  const [careersRes, projectsRes, skillsRes] = await Promise.all([
    getCareers(),
    getProjects(),
    getSkills(),
  ]);

  const relatedSkills = skillsRes.skills.map(skill => ({
    ...skill,
    relatedSkills: skill['관련_기술']
      .map(skillId => skillsRes.skills.find(skill => skill.id === skillId))
      .filter(Boolean) as SkillT[],
    relatedProjectsUsedByLanguage: skill.projectUsedByLanguage
      .map(projectId =>
        projectsRes.projects.find(project => project.id === projectId),
      )
      .filter(Boolean) as ProjectT[],
    relatedProjectsUsedBySkill: skill.projectUsedBySkill
      .map(projectId =>
        projectsRes.projects.find(project => project.id === projectId),
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

export const getSkillPage = async (skillId: string) => {
  const getNotionPage = unstable_cache(
    async () => {
      const extendedRecordMap = await notionXApi.getPage(skillId);
      return {
        extendedRecordMap,
        fetchedAt: new Date(),
      };
    },
    ['skill-page', skillId],
    {
      tags: ['skill-page'],
      revalidate: 60 * 60,
    },
  );

  return await getNotionPage();
};
