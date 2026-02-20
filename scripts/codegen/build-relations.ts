/**
 * 엔티티간의 역방향 관계를 계산해서 content/_graph.json을 만들어주는 스크립트
 */

import * as fs from 'fs';
import * as path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'src/content');

interface ProjectMeta {
  slug: string;
  title: string;
  '주요 기술'?: string[];
  '프로그래밍 언어'?: string[];
  '대회 및 수료'?: string[];
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

function getDirectories(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('_'))
    .map((d) => d.name);
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

export function buildRelationGraph(): RelationGraph {
  const projects = loadAllProjects();
  
  const skillToProjects: Record<string, string[]> = {};
  const languageToProjects: Record<string, string[]> = {};
  const careerToProjects: Record<string, string[]> = {};

  for (const project of projects) {
    const projectSlug = project.slug;

    // 주요 기술 → skillToProjects
    const techSkills = project['주요 기술'] || [];
    for (const skillSlug of techSkills) {
      if (!skillToProjects[skillSlug]) {
        skillToProjects[skillSlug] = [];
      }
      if (!skillToProjects[skillSlug].includes(projectSlug)) {
        skillToProjects[skillSlug].push(projectSlug);
      }
    }

    // 프로그래밍 언어 → languageToProjects
    const languages = project['프로그래밍 언어'] || [];
    for (const langSlug of languages) {
      if (!languageToProjects[langSlug]) {
        languageToProjects[langSlug] = [];
      }
      if (!languageToProjects[langSlug].includes(projectSlug)) {
        languageToProjects[langSlug].push(projectSlug);
      }
    }

    // 대회 및 수료 → careerToProjects
    const relatedCareers = project['대회 및 수료'] || [];
    for (const careerSlug of relatedCareers) {
      if (!careerToProjects[careerSlug]) {
        careerToProjects[careerSlug] = [];
      }
      if (!careerToProjects[careerSlug].includes(projectSlug)) {
        careerToProjects[careerSlug].push(projectSlug);
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

export function buildAndSaveRelations(): void {
  console.log('🔗 Building relation graph...');
  
  const graph = buildRelationGraph();
  
  const skillCount = Object.keys(graph.skillToProjects).length;
  const langCount = Object.keys(graph.languageToProjects).length;
  const careerCount = Object.keys(graph.careerToProjects).length;

  console.log(`   skills→projects: ${skillCount}`);
  console.log(`   languages→projects: ${langCount}`);
  console.log(`   careers→projects: ${careerCount}`);

  // _graph.json 저장
  const graphPath = path.join(CONTENT_DIR, '_graph.json');
  fs.writeFileSync(graphPath, JSON.stringify(graph, null, 2) + '\n');
  console.log(`   → ${path.relative(process.cwd(), graphPath)}`);
}

// Direct execution
if (require.main === module) {
  buildAndSaveRelations();
}
