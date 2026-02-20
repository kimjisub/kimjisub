/**
 * Career API - 단일 커리어 조회 + 관계 해결
 */

import * as path from 'path';

import { getCareers } from './careers';
import { getProjects, ProjectT } from './projects';
import { getSkills } from './skills';
import { CONTENT_DIR, readMdFile } from '.';

export const getCareersWithRelated = async () => {
  const [careersRes, projectsRes, _skillsRes] = await Promise.all([
    getCareers(),
    getProjects(),
    getSkills(),
  ]);

  const relatedCareers = careersRes.careers.map(career => ({
    ...career,
    relatedProjects: career.relatedProjects
      .map(projectSlug =>
        projectsRes.projects.find(project => project.id === projectSlug),
      )
      .filter(Boolean) as ProjectT[],
  }));

  return {
    careers: relatedCareers,
    fetchedAt: careersRes.fetchedAt,
  };
};

// 상대경로 ./assets/... 를 절대경로 /content/...로 변환
const transformAssetUrl = (url: string | null | undefined, category: string, slug: string): string | null => {
  if (!url) return null;
  if (url.startsWith('./')) {
    return `/content/${category}/${encodeURIComponent(slug)}/${url.slice(2)}`;
  }
  return url;
};

export const getCareer = async (careerId: string) => {
  const decodedId = decodeURIComponent(careerId);
  const careersRes = await getCareersWithRelated();
  const career = careersRes.careers.find(career => career.id === decodedId);

  if (!career) {
    return { career: undefined, fetchedAt: careersRes.fetchedAt };
  }

  // iconUrl, coverUrl 경로 변환
  const transformedCareer = {
    ...career,
    iconUrl: transformAssetUrl(career.iconUrl, 'careers', decodedId) || '',
    coverUrl: transformAssetUrl(career.coverImageUrl, 'careers', decodedId) || '',
  };

  return {
    career: transformedCareer,
    fetchedAt: careersRes.fetchedAt,
  };
};

// 페이지 콘텐츠 (마크다운)
export const getCareerPage = async (careerId: string) => {
  const decodedId = decodeURIComponent(careerId);
  const careerDir = path.join(CONTENT_DIR, 'careers', decodedId);
  let mdContent = readMdFile(path.join(careerDir, 'index.md'));
  
  // 상대경로 ./assets/를 절대경로로 변환
  if (mdContent) {
    mdContent = mdContent.replace(
      /\.\/(assets\/[^)\s]+)/g,
      `/content/careers/${encodeURIComponent(decodedId)}/$1`
    );
  }
  
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
