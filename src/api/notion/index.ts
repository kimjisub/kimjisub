/**
 * Content API - 로컬 파일 기반
 * 
 * 기존 Notion API를 로컬 파일 시스템으로 대체
 * src/content/ 폴더의 JSON/MD 파일을 읽어서 반환
 */

import * as fs from 'fs';
import * as path from 'path';

// 콘텐츠 디렉토리 경로
export const CONTENT_DIR = path.join(process.cwd(), 'src/content');

// JSON 파일 읽기 헬퍼
export function readJsonFile<T>(filePath: string): T | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

// MD 파일 읽기 헬퍼
export function readMdFile(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}

// 디렉토리 목록 가져오기
export function getDirectories(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .filter((dirent) => !dirent.name.startsWith('_')) // _index.json 등 제외
    .map((dirent) => dirent.name);
}

// 이미지 파일 찾기 (cover.*, icon.*)
export function findImageFile(dir: string, prefix: string): string | null {
  const extensions = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'];
  for (const ext of extensions) {
    const filePath = path.join(dir, `${prefix}.${ext}`);
    if (fs.existsSync(filePath)) {
      // 상대 경로 반환 (content 폴더 기준)
      return filePath.replace(CONTENT_DIR, '/content');
    }
  }
  return null;
}
