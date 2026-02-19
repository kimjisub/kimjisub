/**
 * Prebuild script: 역방향 관계 그래프 생성 + 심링크 설정
 *
 * 1. public/content → src/content 심링크 생성 (이미지 서빙용)
 * 2. Projects → Skills/Careers 관계를 읽어서 역방향 관계 계산
 *    - skill.projectsUsingAsSkill: 이 스킬을 techSkills로 사용하는 프로젝트들
 *    - skill.projectsUsingAsLanguage: 이 스킬을 languages로 사용하는 프로젝트들
 *    - career.relatedProjects: 이 커리어와 연결된 프로젝트들
 *
 * Usage: tsx scripts/build-relations.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================
// 1. 콘텐츠 연결 (로컬: 심링크 / Vercel: 복사)
// ============================================
function ensureContentLink() {
  const publicDir = path.join(__dirname, '../public');
  const contentDest = path.join(publicDir, 'content');
  const contentSrc = path.join(__dirname, '../src/content');
  const relativeTarget = '../src/content';  // 심링크용 상대 경로

  const isVercel = process.env.VERCEL === '1';

  // public 폴더 없으면 생성
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 기존 content 폴더/심링크 정리
  if (fs.existsSync(contentDest)) {
    const stats = fs.lstatSync(contentDest);
    if (stats.isSymbolicLink()) {
      if (isVercel) {
        // Vercel에서는 심링크 제거하고 복사로 대체
        fs.unlinkSync(contentDest);
      } else {
        // 로컬: 이미 심링크 있으면 OK
        const currentTarget = fs.readlinkSync(contentDest);
        if (currentTarget === relativeTarget) {
          console.log('✅ Symlink already exists: public/content → src/content');
          return;
        }
        fs.unlinkSync(contentDest);
      }
    } else if (stats.isDirectory()) {
      if (isVercel) {
        console.log('✅ Content directory already exists');
        return;
      } else {
        // 로컬에서 실제 폴더면 에러 (심링크여야 함)
        console.error('❌ public/content exists but is not a symlink. Please remove it manually.');
        process.exit(1);
      }
    }
  }

  if (isVercel) {
    // Vercel: 실제 복사 (심링크 대신)
    fs.cpSync(contentSrc, contentDest, { recursive: true });
    console.log('✅ Copied src/content → public/content (Vercel build)');
  } else {
    // 로컬: 심링크 생성
    fs.symlinkSync(relativeTarget, contentDest, 'dir');
    console.log('✅ Created symlink: public/content → src/content');
  }
}

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
  console.log('🔧 Prebuild starting...\n');

  // 1. 콘텐츠 연결 (로컬: 심링크 / Vercel: 복사)
  ensureContentLink();
  console.log('');

  // 2. 관계 그래프 빌드
  console.log('🔗 Building relation graph...');

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
