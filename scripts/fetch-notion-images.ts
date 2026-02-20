#!/usr/bin/env npx tsx
/**
 * Notion에서 마크다운 내 이미지를 다운로드하는 스크립트
 */

import { Client } from '@notionhq/client';
import * as fs from 'fs';
import * as path from 'path';
import https from 'https';

const NOTION_SECRET = process.env.NOTION_SECRET;
if (!NOTION_SECRET) {
  console.error('❌ NOTION_SECRET 환경변수가 필요합니다');
  process.exit(1);
}
const CONTENT_DIR = path.join(__dirname, '../src/content');

const notion = new Client({ auth: NOTION_SECRET });

// 파일 다운로드
async function downloadFile(url: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : require('http');
    
    protocol.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    }, (response: any) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlinkSync(destPath);
        downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
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
    }).on('error', (err: Error) => {
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      reject(err);
    });
  });
}

// URL에서 확장자 추출
function getExtFromUrl(url: string): string {
  const urlPath = new URL(url).pathname;
  const ext = path.extname(urlPath);
  return ext || '.png';
}

// Notion 블록에서 이미지 추출
async function getPageImages(pageId: string): Promise<{ url: string; caption?: string }[]> {
  const images: { url: string; caption?: string }[] = [];
  
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
          const caption = imageBlock.image.caption?.[0]?.plain_text;
          images.push({ url, caption });
        }
      }
    }
    
    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);
  
  return images;
}

// 마크다운에서 누락된 이미지 찾기
function findMissingImages(contentDir: string): { mdPath: string; images: string[] }[] {
  const results: { mdPath: string; images: string[] }[] = [];
  
  const mdFiles = ['index.md', 'content.md'];
  
  for (const mdFile of mdFiles) {
    const mdPath = path.join(contentDir, mdFile);
    if (!fs.existsSync(mdPath)) continue;
    
    const content = fs.readFileSync(mdPath, 'utf-8');
    const imageMatches = content.match(/!\[.*?\]\(\.\/(assets\/[^)]+)\)/g) || [];
    
    const missingImages: string[] = [];
    
    for (const match of imageMatches) {
      const imgPath = match.match(/\.\/(assets\/[^)]+)/)?.[1];
      if (imgPath) {
        const fullPath = path.join(contentDir, imgPath);
        if (!fs.existsSync(fullPath)) {
          missingImages.push(imgPath);
        }
      }
    }
    
    if (missingImages.length > 0) {
      results.push({ mdPath, images: missingImages });
    }
  }
  
  return results;
}

// 메인 함수
async function main() {
  const categories = ['projects', 'careers', 'skills'];
  
  console.log('🔍 누락된 이미지 스캔 중...\n');
  
  let totalMissing = 0;
  let totalDownloaded = 0;
  
  for (const category of categories) {
    const categoryDir = path.join(CONTENT_DIR, category);
    if (!fs.existsSync(categoryDir)) continue;
    
    const items = fs.readdirSync(categoryDir, { withFileTypes: true })
      .filter(d => d.isDirectory() && !d.name.startsWith('_'))
      .map(d => d.name);
    
    for (const item of items) {
      const itemDir = path.join(categoryDir, item);
      const metaPath = path.join(itemDir, 'meta.json');
      
      if (!fs.existsSync(metaPath)) continue;
      
      const missing = findMissingImages(itemDir);
      if (missing.length === 0) continue;
      
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
      const pageId = meta.id;
      
      if (!pageId) {
        console.log(`⚠️  ${category}/${item}: meta.json에 id 없음`);
        continue;
      }
      
      console.log(`\n📁 ${category}/${item}`);
      console.log(`   누락: ${missing.flatMap(m => m.images).join(', ')}`);
      
      totalMissing += missing.flatMap(m => m.images).length;
      
      try {
        const images = await getPageImages(pageId);
        console.log(`   Notion에서 ${images.length}개 이미지 발견`);
        
        if (images.length === 0) continue;
        
        const assetsDir = path.join(itemDir, 'assets');
        if (!fs.existsSync(assetsDir)) {
          fs.mkdirSync(assetsDir, { recursive: true });
        }
        
        // 이미지 다운로드 (순서대로 content-1, content-2, ...)
        for (let i = 0; i < images.length; i++) {
          const img = images[i];
          const ext = getExtFromUrl(img.url);
          const filename = `content-${i + 1}${ext}`;
          const destPath = path.join(assetsDir, filename);
          
          if (fs.existsSync(destPath)) {
            console.log(`   ⏭️  ${filename} 이미 존재`);
            continue;
          }
          
          try {
            process.stdout.write(`   ⬇️  ${filename}...`);
            await downloadFile(img.url, destPath);
            const size = fs.statSync(destPath).size;
            console.log(` ✅ (${Math.round(size / 1024)}KB)`);
            totalDownloaded++;
          } catch (err: any) {
            console.log(` ❌ ${err.message}`);
          }
          
          // Rate limit
          await new Promise(r => setTimeout(r, 200));
        }
      } catch (err: any) {
        console.log(`   ❌ Notion API 에러: ${err.message}`);
      }
    }
  }
  
  console.log(`\n\n✅ 완료: ${totalDownloaded}개 다운로드 (${totalMissing}개 누락 발견)`);
}

main().catch(console.error);
