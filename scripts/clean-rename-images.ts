#!/usr/bin/env npx tsx
/**
 * 비정규 이미지 파일 정리 + Notion에서 재다운로드
 * - content-N.ext, s3-*.ext 외 파일 삭제
 * - Notion API로 이미지 다시 다운로드 (content-N.ext 형태로)
 */

import { Client } from '@notionhq/client';
import * as fs from 'fs';
import * as path from 'path';
import https from 'https';

const NOTION_SECRET = process.env.NOTION_SECRET;
if (!NOTION_SECRET) {
  console.error('❌ NOTION_SECRET 환경변수 필요');
  process.exit(1);
}

const CONTENT_DIR = path.join(__dirname, '../src/content');
const notion = new Client({ auth: NOTION_SECRET });

// 파일 다운로드
async function downloadFile(url: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        if (response.headers.location) {
          downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
        } else {
          reject(new Error('Redirect without location'));
        }
        return;
      }
      
      if (response.statusCode !== 200) {
        file.close();
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      reject(err);
    });
  });
}

// URL에서 확장자 추출
function getExtFromUrl(url: string): string {
  try {
    const urlPath = new URL(url).pathname;
    const ext = path.extname(urlPath).toLowerCase();
    if (['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext)) {
      return ext;
    }
  } catch {}
  return '.png';
}

// Notion 페이지에서 이미지 가져오기
async function getPageImages(pageId: string): Promise<string[]> {
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

        if (url) urls.push(url);
      }
    }

    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);

  return urls;
}

// 마크다운에서 이미지 경로 추출
function getImagePathsFromMarkdown(mdPath: string): string[] {
  if (!fs.existsSync(mdPath)) return [];
  
  const content = fs.readFileSync(mdPath, 'utf-8');
  const matches = content.match(/!\[.*?\]\(\.\/(assets\/[^)]+)\)/g) || [];
  
  return matches.map(m => {
    const match = m.match(/\.\/(assets\/[^)]+)/);
    return match ? match[1] : '';
  }).filter(Boolean);
}

// 메인
async function main() {
  const categories = ['projects', 'careers'];
  let totalCleaned = 0;
  let totalDownloaded = 0;

  console.log('🧹 Cleaning and re-downloading images...\n');

  for (const category of categories) {
    const categoryDir = path.join(CONTENT_DIR, category);
    if (!fs.existsSync(categoryDir)) continue;

    const slugs = fs.readdirSync(categoryDir, { withFileTypes: true })
      .filter(d => d.isDirectory() && !d.name.startsWith('_'))
      .map(d => d.name);

    for (const slug of slugs) {
      const slugDir = path.join(categoryDir, slug);
      const assetsDir = path.join(slugDir, 'assets');
      const metaPath = path.join(slugDir, 'meta.json');
      const mdPath = path.join(slugDir, 'index.md');

      if (!fs.existsSync(assetsDir) || !fs.existsSync(metaPath)) continue;

      // 마크다운에서 참조하는 이미지 경로
      const mdImagePaths = getImagePathsFromMarkdown(mdPath);
      if (mdImagePaths.length === 0) continue;

      // 비정규 파일 (content-N, s3-* 외) 찾기
      const files = fs.readdirSync(assetsDir);
      const irregularFiles = files.filter(f => 
        !f.startsWith('content-') && 
        !f.startsWith('s3-') &&
        /\.(png|jpg|jpeg|gif|webp|heic)$/i.test(f)
      );

      if (irregularFiles.length === 0) continue;

      console.log(`📁 ${category}/${slug}`);
      console.log(`   비정규 파일 ${irregularFiles.length}개 발견`);

      // 누락된 content-N 파일 확인
      const missingImages: string[] = [];
      for (const imgPath of mdImagePaths) {
        const fullPath = path.join(slugDir, imgPath);
        if (!fs.existsSync(fullPath)) {
          missingImages.push(imgPath);
        }
      }

      if (missingImages.length === 0) {
        console.log(`   모든 이미지 존재, 스킵`);
        continue;
      }

      console.log(`   누락된 이미지: ${missingImages.length}개`);

      // Notion에서 이미지 URL 가져오기
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
      const pageId = meta.id;
      if (!pageId) continue;

      try {
        const imageUrls = await getPageImages(pageId);
        console.log(`   Notion에서 ${imageUrls.length}개 이미지 발견`);

        // 비정규 파일 삭제
        for (const f of irregularFiles) {
          const fPath = path.join(assetsDir, f);
          fs.unlinkSync(fPath);
          console.log(`   🗑️  삭제: ${f}`);
          totalCleaned++;
        }

        // content-N 형태로 다운로드
        for (let i = 0; i < imageUrls.length; i++) {
          const url = imageUrls[i];
          const ext = getExtFromUrl(url);
          const filename = `content-${i + 1}${ext}`;
          const destPath = path.join(assetsDir, filename);

          if (fs.existsSync(destPath)) {
            console.log(`   ⏭️  이미 존재: ${filename}`);
            continue;
          }

          try {
            await downloadFile(url, destPath);
            const size = fs.statSync(destPath).size;
            console.log(`   ⬇️  다운로드: ${filename} (${Math.round(size / 1024)}KB)`);
            totalDownloaded++;
          } catch (err: any) {
            console.log(`   ❌ 실패: ${filename} - ${err.message}`);
          }

          await new Promise(r => setTimeout(r, 100));
        }
      } catch (err: any) {
        console.log(`   ❌ Notion API 에러: ${err.message}`);
      }

      await new Promise(r => setTimeout(r, 200));
    }
  }

  console.log(`\n✅ 정리: ${totalCleaned}개 삭제, ${totalDownloaded}개 다운로드`);
}

main().catch(console.error);
