/**
 * Prebuild script: 역방향 관계 그래프 생성
 *
 * Projects → Skills/Careers 관계를 읽어서 역방향 관계 계산
 * - skill.projectsUsingAsSkill: 이 스킬을 techSkills로 사용하는 프로젝트들
 * - skill.projectsUsingAsLanguage: 이 스킬을 languages로 사용하는 프로젝트들
 * - career.relatedProjects: 이 커리어와 연결된 프로젝트들
 *
 * Usage: tsx scripts/build-relations.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const CONTENT_DIR = path.join(__dirname, '../src/content');

interface ProjectMeta {
  id: string;
  slug: string;
  title: string;
  techSkills?: string[];
  languages?: string[];
  relatedCareers?: string[];
  [key: string]: unknown;
}

interface SkillMeta {
  id: string;
  slug: string;
  title: string;
  projectsUsingAsSkill?: string[];
  projectsUsingAsLanguage?: string[];
  [key: string]: unknown;
}

interface CareerMeta {
  id: string;
  slug: string;
  title: string;
  relatedProjects?: string[];
  [key: string]: unknown;
}

interface RelationGraph {
  // skill slug → project slugs
  skillToProjects: Record<string, string[]>;
  languageToProjects: Record<string, string[]>;
  // career slug → project slugs
  careerToProjects: Record<string, string[]>;
  // 생성 시간
  generatedAt: string;
}

function readJsonFile<T>(filePath: string): T | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

function writeJsonFile(filePath: string, data: unknown): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
}

function getDirectories(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

function loadAllProjects(): ProjectMeta[] {
  const projectsDir = path.join(CONTENT_DIR, 'projects');
  const slugs = getDirectories(projectsDir);

  const projects: ProjectMeta[] = [];
  for (const slug of slugs) {
    const metaPath = path.join(projectsDir, slug, 'meta.json');
    const meta = readJsonFile<ProjectMeta>(metaPath);
    if (meta) {
      projects.push({ ...meta, slug });
    }
  }

  return projects;
}

function buildRelationGraph(projects: ProjectMeta[]): RelationGraph {
  const skillToProjects: Record<string, string[]> = {};
  const languageToProjects: Record<string, string[]> = {};
  const careerToProjects: Record<string, string[]> = {};

  for (const project of projects) {
    const projectSlug = project.slug;

    // techSkills → skillToProjects
    if (project.techSkills) {
      for (const skillSlug of project.techSkills) {
        if (!skillToProjects[skillSlug]) {
          skillToProjects[skillSlug] = [];
        }
        if (!skillToProjects[skillSlug].includes(projectSlug)) {
          skillToProjects[skillSlug].push(projectSlug);
        }
      }
    }

    // languages → languageToProjects
    if (project.languages) {
      for (const langSlug of project.languages) {
        if (!languageToProjects[langSlug]) {
          languageToProjects[langSlug] = [];
        }
        if (!languageToProjects[langSlug].includes(projectSlug)) {
          languageToProjects[langSlug].push(projectSlug);
        }
      }
    }

    // relatedCareers → careerToProjects
    if (project.relatedCareers) {
      for (const careerSlug of project.relatedCareers) {
        if (!careerToProjects[careerSlug]) {
          careerToProjects[careerSlug] = [];
        }
        if (!careerToProjects[careerSlug].includes(projectSlug)) {
          careerToProjects[careerSlug].push(projectSlug);
        }
      }
    }
  }

  return {
    skillToProjects,
    languageToProjects,
    careerToProjects,
    generatedAt: new Date().toISOString(),
  };
}

function updateSkillMetas(graph: RelationGraph): number {
  const skillsDir = path.join(CONTENT_DIR, 'skills');
  const slugs = getDirectories(skillsDir);
  let updated = 0;

  for (const slug of slugs) {
    const metaPath = path.join(skillsDir, slug, 'meta.json');
    const meta = readJsonFile<SkillMeta>(metaPath);
    if (!meta) continue;

    const projectsAsSkill = graph.skillToProjects[slug] || [];
    const projectsAsLanguage = graph.languageToProjects[slug] || [];

    // 변경사항 있는지 확인
    const currentAsSkill = meta.projectsUsingAsSkill || [];
    const currentAsLanguage = meta.projectsUsingAsLanguage || [];

    const hasChanges =
      JSON.stringify(currentAsSkill.sort()) !==
        JSON.stringify(projectsAsSkill.sort()) ||
      JSON.stringify(currentAsLanguage.sort()) !==
        JSON.stringify(projectsAsLanguage.sort());

    if (hasChanges) {
      meta.projectsUsingAsSkill = projectsAsSkill;
      meta.projectsUsingAsLanguage = projectsAsLanguage;
      writeJsonFile(metaPath, meta);
      updated++;
    }
  }

  return updated;
}

function updateCareerMetas(graph: RelationGraph): number {
  const careersDir = path.join(CONTENT_DIR, 'careers');
  const slugs = getDirectories(careersDir);
  let updated = 0;

  for (const slug of slugs) {
    const metaPath = path.join(careersDir, slug, 'meta.json');
    const meta = readJsonFile<CareerMeta>(metaPath);
    if (!meta) continue;

    const relatedProjects = graph.careerToProjects[slug] || [];

    // 변경사항 있는지 확인
    const currentProjects = meta.relatedProjects || [];

    const hasChanges =
      JSON.stringify(currentProjects.sort()) !==
      JSON.stringify(relatedProjects.sort());

    if (hasChanges) {
      meta.relatedProjects = relatedProjects;
      writeJsonFile(metaPath, meta);
      updated++;
    }
  }

  return updated;
}

async function main() {
  console.log('🔗 Building relation graph...\n');

  // 1. 모든 프로젝트 로드
  const projects = loadAllProjects();
  console.log(`📦 Loaded ${projects.length} projects`);

  // 2. 역방향 관계 그래프 계산
  const graph = buildRelationGraph(projects);

  const skillCount = Object.keys(graph.skillToProjects).length;
  const langCount = Object.keys(graph.languageToProjects).length;
  const careerCount = Object.keys(graph.careerToProjects).length;

  console.log(`   - Skills with projects: ${skillCount}`);
  console.log(`   - Languages with projects: ${langCount}`);
  console.log(`   - Careers with projects: ${careerCount}`);

  // 3. 전체 그래프 저장 (_graph.json)
  const graphPath = path.join(CONTENT_DIR, '_graph.json');
  writeJsonFile(graphPath, graph);
  console.log(`\n📊 Saved relation graph to _graph.json`);

  // 4. 각 skill의 meta.json에 역방향 관계 추가
  const updatedSkills = updateSkillMetas(graph);
  console.log(`✅ Updated ${updatedSkills} skill meta files`);

  // 5. 각 career의 meta.json에 역방향 관계 추가
  const updatedCareers = updateCareerMetas(graph);
  console.log(`✅ Updated ${updatedCareers} career meta files`);

  console.log('\n🎉 Relation graph build complete!');
}

main().catch(console.error);
