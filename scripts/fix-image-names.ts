#!/usr/bin/env npx tsx
/**
 * 이미지 파일명 정규화 스크립트
 * - Notion 블록 순서대로 이미지를 content-N.ext로 rename
 * - 마크다운의 참조 경로와 일치시킴
 */

import { Client } from '@notionhq/client';
import * as fs from 'fs';
import * as path from 'path';

const NOTION_SECRET = process.env.NOTION_SECRET;
if (!NOTION_SECRET) {
  console.error('❌ NOTION_SECRET 환경변수 필요');
  process.exit(1);
}

const CONTENT_DIR = path.join(__dirname, '../src/content');
const notion = new Client({ auth: NOTION_SECRET });

// 확장자 추출
function getExt(filename: string): string {
  return path.extname(filename).toLowerCase();
}

// Notion 페이지에서 이미지 블록 가져오기 (순서대로)
async function getPageImageUrls(pageId: string): Promise<string[]> {
  const urls: string[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
      page_size: 100,
    });

    for (const block of response.results) {
      if ('type' in block && block.type === 'image') {
        const imageBlock = block as any;
        let url: string | undefined;

        if (imageBlock.image.type === 'file') {
          url = imageBlock.image.file.url;
        } else if (imageBlock.image.type === 'external') {
          url = imageBlock.image.external.url;
        }

        if (url) {
          urls.push(url);
        }
      }
    }

    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);

  return urls;
}

// URL에서 원본 파일명 추출
function getFilenameFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathname = decodeURIComponent(urlObj.pathname);
    const filename = path.basename(pathname);
    // AWS S3 URL의 경우 UUID/filename 형태
    const parts = filename.split('/');
    return parts[parts.length - 1];
  } catch {
    return null;
  }
}

// 파일명 rename
async function fixImagesInFolder(
  category: string,
  slug: string,
  pageId: string
): Promise<{ renamed: number; errors: string[] }> {
  const assetsDir = path.join(CONTENT_DIR, category, slug, 'assets');
  
  if (!fs.existsSync(assetsDir)) {
    return { renamed: 0, errors: [] };
  }

  const existingFiles = fs.readdirSync(assetsDir);
  const notionUrls = await getPageImageUrls(pageId);
  
  let renamed = 0;
  const errors: string[] = [];

  for (let i = 0; i < notionUrls.length; i++) {
    const url = notionUrls[i];
    const expectedName = `content-${i + 1}`;
    
    // URL에서 원본 파일명 또는 특징 추출
    const urlPath = new URL(url).pathname;
    const ext = path.extname(urlPath) || '.png';
    const targetName = `${expectedName}${ext}`;
    
    // 이미 올바른 이름이면 스킵
    if (existingFiles.includes(targetName)) {
      continue;
    }

    // 기존 파일 중 매칭되는 것 찾기
    // (이미 다운로드된 파일 중 content-N 패턴이 아닌 것)
    const nonContentFiles = existingFiles.filter(f => !f.startsWith('content-'));
    
    if (nonContentFiles.length > i - renamed) {
      // 순서대로 매칭 (단순화)
      const sourceFile = nonContentFiles[i - renamed];
      if (sourceFile) {
        const sourcePath = path.join(assetsDir, sourceFile);
        const targetPath = path.join(assetsDir, `content-${i + 1}${getExt(sourceFile)}`);
        
        try {
          fs.renameSync(sourcePath, targetPath);
          console.log(`    ${sourceFile} → content-${i + 1}${getExt(sourceFile)}`);
          renamed++;
        } catch (err: any) {
          errors.push(`${sourceFile}: ${err.message}`);
        }
      }
    }
  }

  return { renamed, errors };
}

// 메인
async function main() {
  const categories = ['projects', 'careers'];
  let totalRenamed = 0;

  console.log('🔧 Fixing image names...\n');

  for (const category of categories) {
    const categoryDir = path.join(CONTENT_DIR, category);
    if (!fs.existsSync(categoryDir)) continue;

    const slugs = fs.readdirSync(categoryDir, { withFileTypes: true })
      .filter(d => d.isDirectory() && !d.name.startsWith('_'))
      .map(d => d.name);

    for (const slug of slugs) {
      const metaPath = path.join(categoryDir, slug, 'meta.json');
      if (!fs.existsSync(metaPath)) continue;

      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
      const pageId = meta.id;
      if (!pageId) continue;

      const assetsDir = path.join(categoryDir, slug, 'assets');
      if (!fs.existsSync(assetsDir)) continue;

      // content-N 패턴이 아닌 파일이 있는지 확인
      const files = fs.readdirSync(assetsDir);
      const nonContentFiles = files.filter(f => 
        !f.startsWith('content-') && 
        !f.startsWith('s3-') &&
        /\.(png|jpg|jpeg|gif|webp)$/i.test(f)
      );

      if (nonContentFiles.length === 0) continue;

      console.log(`📁 ${category}/${slug}`);
      
      const result = await fixImagesInFolder(category, slug, pageId);
      totalRenamed += result.renamed;
      
      if (result.errors.length > 0) {
        result.errors.forEach(e => console.log(`   ❌ ${e}`));
      }

      // Rate limit
      await new Promise(r => setTimeout(r, 200));
    }
  }

  console.log(`\n✅ Renamed ${totalRenamed} files`);
}

main().catch(console.error);
