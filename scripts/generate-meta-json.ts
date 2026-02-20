/**
 * Generate meta.json from meta.tsx files
 * 
 * meta.tsx는 static import를 위한 파일이고,
 * API는 JSON 파일을 읽어야 하므로 meta.json도 생성합니다.
 */

import * as fs from 'fs';
import * as path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'src/content');
const CATEGORIES = ['projects', 'careers', 'skills'];

function parseMetaTsx(content: string): Record<string, unknown> | null {
  try {
    // export const meta = { ... } 부분 추출
    const match = content.match(/export const meta = \{([\s\S]*)\};?\s*$/);
    if (!match) return null;
    
    const objectContent = match[1];
    
    // icon, cover import 제거하고 파싱 가능한 형태로 변환
    // 단순 문자열/배열/객체만 추출
    const result: Record<string, unknown> = {};
    
    // 각 속성 추출 (간단한 파싱)
    const lines = objectContent.split('\n');
    let currentKey = '';
    let currentValue = '';
    let inArray = false;
    let arrayDepth = 0;
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed === ',' || trimmed === 'icon,' || trimmed === 'cover,') continue;
      
      // 배열 시작
      if (trimmed.includes(': [') && !trimmed.includes('],')) {
        const keyMatch = trimmed.match(/^['"]?([^'":\s]+)['"]?\s*:\s*\[/);
        if (keyMatch) {
          currentKey = keyMatch[1];
          currentValue = '[';
          inArray = true;
          arrayDepth = 1;
          continue;
        }
      }
      
      // 배열 안에서
      if (inArray) {
        if (trimmed === '],') {
          currentValue += ']';
          try {
            result[currentKey] = JSON.parse(currentValue.replace(/'/g, '"').replace(/,\s*]/, ']'));
          } catch {
            result[currentKey] = [];
          }
          inArray = false;
          currentKey = '';
          currentValue = '';
          continue;
        }
        // 배열 항목 추가
        currentValue += trimmed.replace(/,$/, '') + ',';
        continue;
      }
      
      // 단일 값 속성
      const propMatch = trimmed.match(/^['"]?([^'":\s]+)['"]?\s*:\s*(.+?),?$/);
      if (propMatch) {
        const key = propMatch[1];
        let value = propMatch[2].replace(/,$/, '').trim();
        
        // skip icon, cover (import된 변수)
        if (value === 'icon' || value === 'cover') continue;
        
        // 문자열 처리
        if (value.startsWith("'") || value.startsWith('"')) {
          value = value.slice(1, -1);
          result[key] = value;
        } else if (value === 'true') {
          result[key] = true;
        } else if (value === 'false') {
          result[key] = false;
        } else if (!isNaN(Number(value))) {
          result[key] = Number(value);
        } else if (value.startsWith('[') && value.endsWith(']')) {
          // 인라인 배열
          try {
            result[key] = JSON.parse(value.replace(/'/g, '"'));
          } catch {
            result[key] = [];
          }
        }
      }
    }
    
    return result;
  } catch (err) {
    console.error('Parse error:', err);
    return null;
  }
}

function getDirectories(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .filter((dirent) => !dirent.name.startsWith('_'))
    .map((dirent) => dirent.name);
}

function processCategory(category: string): number {
  const categoryDir = path.join(CONTENT_DIR, category);
  const slugs = getDirectories(categoryDir);
  let count = 0;
  
  for (const slug of slugs) {
    const itemDir = path.join(categoryDir, slug);
    const metaTsxPath = path.join(itemDir, 'meta.tsx');
    const metaJsonPath = path.join(itemDir, 'meta.json');
    
    if (!fs.existsSync(metaTsxPath)) continue;
    
    const content = fs.readFileSync(metaTsxPath, 'utf-8');
    const meta = parseMetaTsx(content);
    
    if (meta) {
      // assets 폴더에서 icon/cover 파일 찾기
      const assetsDir = path.join(itemDir, 'assets');
      if (fs.existsSync(assetsDir)) {
        const files = fs.readdirSync(assetsDir);
        const iconFile = files.find(f => f.startsWith('icon.'));
        const coverFile = files.find(f => f.startsWith('cover.'));
        if (iconFile) meta.iconUrl = `./assets/${iconFile}`;
        if (coverFile) meta.coverUrl = `./assets/${coverFile}`;
      }
      
      fs.writeFileSync(metaJsonPath, JSON.stringify(meta, null, 2));
      count++;
    }
  }
  
  return count;
}

console.log('🔧 Generating meta.json from meta.tsx...\n');

let total = 0;
for (const category of CATEGORIES) {
  const count = processCategory(category);
  console.log(`   ${category}: ${count} files`);
  total += count;
}

console.log(`\n✅ Generated ${total} meta.json files`);
