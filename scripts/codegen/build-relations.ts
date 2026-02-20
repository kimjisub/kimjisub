/**
 * 엔티티간의 역방향 관계를 계산해서 content/_graph.json을 만들어주는 스크립트
 * 
 * rebuild-index.ts가 먼저 실행되어야 함 (_index.ts 필요)
 */

import * as fs from 'fs';
import * as path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'src/content');

interface ProjectMeta {
  id?: string;
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

// meta.tsx 파일에서 meta 객체 파싱 (간단한 방식)
function parseMetaTsx(filePath: string): ProjectMeta | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // export const meta = { ... } 추출
    const match = content.match(/export const meta = \{([\s\S]*)\};?\s*$/);
    if (!match) return null;
    
    const objectContent = match[1];
    const result: Record<string, unknown> = {};
    
    // 배열 속성 추출 ('주요 기술', '프로그래밍 언어', '대회 및 수료')
    const arrayRegex = /'([^']+)':\s*\[([\s\S]*?)\]/g;
    let arrayMatch;
    
    while ((arrayMatch = arrayRegex.exec(objectContent)) !== null) {
      const key = arrayMatch[1];
      const arrayContent = arrayMatch[2];
      
      // 배열 내 문자열 추출
      const items: string[] = [];
      const itemRegex = /'([^']+)'/g;
      let itemMatch;
      while ((itemMatch = itemRegex.exec(arrayContent)) !== null) {
        items.push(itemMatch[1]);
      }
      
      result[key] = items;
    }
    
    // id, title 추출
    const idMatch = objectContent.match(/id:\s*'([^']+)'/);
    if (idMatch) result.id = idMatch[1];
    
    const titleMatch = objectContent.match(/title:\s*'([^']+)'/);
    if (titleMatch) result.title = titleMatch[1];
    
    return result as ProjectMeta;
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

function loadAllProjects(): Array<ProjectMeta & { slug: string }> {
  const projectsDir = path.join(CONTENT_DIR, 'projects');
  const slugs = getDirectories(projectsDir);

  const projects: Array<ProjectMeta & { slug: string }> = [];
  for (const slug of slugs) {
    const metaPath = path.join(projectsDir, slug, 'meta.tsx');
    const meta = parseMetaTsx(metaPath);
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
