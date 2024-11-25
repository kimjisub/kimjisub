/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { unstable_cache } from 'next/cache';

import { notionXApi } from '../notion';

import { getCareers } from './careers';
import { getProjects, ProjectT } from './projects';
import { getSkills } from './skills';

export const getCareersWithRelated = async () => {
  const [careersRes, projectsRes, skillsRes] = await Promise.all([
    getCareers(),
    getProjects(),
    getSkills(),
  ]);

  const relatedCareers = careersRes.careers.map(career => ({
    ...career,
    relatedProjects: career.relatedProjects
      .map(projectId =>
        projectsRes.projects.find(project => project.id === projectId),
      )
      .filter(Boolean) as ProjectT[],
  }));

  return {
    careers: relatedCareers,
    fetchedAt: careersRes.fetchedAt,
  };
};

export const getCareer = async (careerId: string) => {
  const careersRes = await getCareersWithRelated();
  const career = careersRes.careers.find(career => career.id === careerId);

  return {
    career,
    fetchedAt: careersRes.fetchedAt,
  };
};

export const getCareerPage = async (careerId: string) => {
  const getNotionPage = unstable_cache(
    async () => {
      const extendedRecordMap = await notionXApi.getPage(careerId);
      return {
        extendedRecordMap,
        fetchedAt: new Date(),
      };
    },
    ['career-page', careerId],
    {
      tags: ['career-page'],
      revalidate: 60 * 60,
    },
  );

  return await getNotionPage();
};
