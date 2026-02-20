#!/usr/bin/env npx tsx
/**
 * Notion → Local 마이그레이션 (멱등 스크립트)
 * 
 * 실행: npx tsx scripts/notion-to-local.ts
 * 
 * Option A: meta.ts 방식
 * - 모든 이미지 static import (icon, cover, content)
 * - TypeScript로 메타데이터 관리
 * - width/height 자동 추론
 */

import { Client } from '@notionhq/client';
import { NotionAPI } from 'notion-client';
import * as fs from 'fs';
import * as path from 'path';
import https from 'https';
import http from 'http';
import sizeOf from 'image-size';

// ─── Configuration ───────────────────────────────────────────────────────────

const NOTION_SECRET = process.env.NOTION_SECRET;
if (!NOTION_SECRET) {
  console.error('❌ NOTION_SECRET 환경변수 필요');
  console.error('   export NOTION_SECRET=your_secret');
  process.exit(1);
}

const DATABASE_IDS = {
  projects: '1aef42d566f84045a94303d07ea12e95',
  careers: '89d24d36ad334e62a418d765d6ed4c0b',
  skills: 'f3f9bf321850465d9d193c39e2a06d3e',
};

const CONTENT_DIR = path.join(process.cwd(), 'src/content');
const CONTENT_PREV_DIR = path.join(process.cwd(), 'src/content_prev');

// ─── Notion Clients ──────────────────────────────────────────────────────────

const notion = new Client({ auth: NOTION_SECRET });
const notionX = new NotionAPI();

// ─── Utilities ───────────────────────────────────────────────────────────────

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getFileExtension(url: string): string {
  try {
    const urlPath = new URL(url).pathname;
    const ext = path.extname(urlPath).toLowerCase();
    if (['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'].includes(ext)) {
      return ext.slice(1);
    }
  } catch {}
  return 'png';
}

// 통계
let cacheHits = 0;
let cacheMisses = 0;
let downloadSuccess = 0;
let downloadFail = 0;

// 이미지 다운로드 (캐시 우선)
async function downloadImage(
  url: string, 
  destPath: string, 
  prevAssetsDir: string,
  filename: string
): Promise<boolean> {
  // 캐시에서 복사 (같은 파일명)
  if (fs.existsSync(prevAssetsDir)) {
    const prevFiles = fs.readdirSync(prevAssetsDir);
    if (prevFiles.includes(filename)) {
      const cachePath = path.join(prevAssetsDir, filename);
      fs.copyFileSync(cachePath, destPath);
      cacheHits++;
      return true;
    }
  }
  cacheMisses++;

  // URL 검증
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    downloadFail++;
    return false;
  }

  // 다운로드
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const request = (targetUrl: string, redirectCount = 0) => {
      if (redirectCount > 5) {
        downloadFail++;
        resolve(false);
        return;
      }

      protocol.get(targetUrl, { 
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 30000
      }, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          const location = response.headers.location;
          if (location) {
            request(location, redirectCount + 1);
            return;
          }
        }

        if (response.statusCode !== 200) {
          downloadFail++;
          resolve(false);
          return;
        }

        const file = fs.createWriteStream(destPath);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          
          // 파일 타입 감지 후 확장자 수정
          const correctedPath = correctFileExtension(destPath);
          downloadSuccess++;
          resolve(correctedPath !== null);
        });
      }).on('error', () => {
        downloadFail++;
        resolve(false);
      });
    };

    request(url);
  });
}

// 이미지 확장자 목록
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico', '.bmp', '.tiff'];

// 파일이 이미지인지 확인
function isImageFile(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return IMAGE_EXTENSIONS.includes(ext);
}

// 실제 파일 매직 바이트로 타입 감지 후 확장자 수정
function correctFileExtension(filePath: string): string {
  try {
    const buffer = Buffer.alloc(16);
    const fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, buffer, 0, 16, 0);
    fs.closeSync(fd);
    
    const hex = buffer.toString('hex').toUpperCase();
    const currentExt = path.extname(filePath).toLowerCase();
    let detectedExt: string | null = null;
    
    // 매직 바이트로 실제 파일 타입 감지
    if (hex.startsWith('25504446')) {
      detectedExt = '.pdf';
    } else if (hex.startsWith('504B0304')) {
      // ZIP 기반 (docx, xlsx, pptx, hwpx 등)
      detectedExt = '.zip'; // 일단 zip으로, 나중에 내부 구조로 더 세분화 가능
    } else if (hex.startsWith('D0CF11E0')) {
      // OLE2 (doc, xls, ppt, hwp 등)
      detectedExt = '.doc'; // 레거시 MS Office / HWP
    }
    
    // 이미지로 표시됐지만 실제로는 문서인 경우 수정
    if (detectedExt && IMAGE_EXTENSIONS.includes(currentExt)) {
      const newPath = filePath.replace(/\.[^.]+$/, detectedExt);
      if (newPath !== filePath) {
        fs.renameSync(filePath, newPath);
        console.log(`    📄 파일 타입 수정: ${path.basename(filePath)} → ${path.basename(newPath)}`);
        return newPath;
      }
    }
    
    return filePath;
  } catch {
    return filePath;
  }
}

// ─── Notion Data Extraction ──────────────────────────────────────────────────

interface ImageInfo {
  url: string;
  filename: string;
}

interface PageContent {
  markdown: string;
  images: ImageInfo[];
}

// 공식 API로 리치텍스트 추출
function extractOfficialRichText(richText: any[]): string {
  if (!richText) return '';
  return richText.map((t: any) => {
    let text = t.plain_text || '';
    const ann = t.annotations || {};
    
    if (ann.bold) text = `**${text}**`;
    if (ann.italic) text = `*${text}*`;
    if (ann.strikethrough) text = `~~${text}~~`;
    if (ann.code) text = `\`${text}\``;
    if (t.href) text = `[${text}](${t.href})`;
    
    return text;
  }).join('');
}

// Notion 페이지 콘텐츠 추출 (공식 API 사용)
async function extractPageContent(pageId: string): Promise<PageContent> {
  const result: PageContent = { markdown: '', images: [] };
  
  try {
    let imageIndex = 0;
    const lines: string[] = [];
    let cursor: string | undefined;

    do {
      const response = await notion.blocks.children.list({
        block_id: pageId,
        start_cursor: cursor,
        page_size: 100,
      });

      for (const block of response.results) {
        if (!('type' in block)) continue;
        
        const type = block.type;
        const blockData = (block as any)[type];

        if (type === 'paragraph') {
          const text = extractOfficialRichText(blockData?.rich_text);
          if (text) lines.push(text + '\n');
        } else if (type === 'heading_1') {
          const text = extractOfficialRichText(blockData?.rich_text);
          if (text) lines.push('## ' + text + '\n');
        } else if (type === 'heading_2') {
          const text = extractOfficialRichText(blockData?.rich_text);
          if (text) lines.push('### ' + text + '\n');
        } else if (type === 'heading_3') {
          const text = extractOfficialRichText(blockData?.rich_text);
          if (text) lines.push('#### ' + text + '\n');
        } else if (type === 'bulleted_list_item') {
          const text = extractOfficialRichText(blockData?.rich_text);
          if (text) lines.push('- ' + text);
        } else if (type === 'numbered_list_item') {
          const text = extractOfficialRichText(blockData?.rich_text);
          if (text) lines.push('1. ' + text);
        } else if (type === 'code') {
          const text = extractOfficialRichText(blockData?.rich_text);
          const lang = blockData?.language || '';
          if (text) lines.push('```' + lang + '\n' + text + '\n```\n');
        } else if (type === 'quote') {
          const text = extractOfficialRichText(blockData?.rich_text);
          if (text) lines.push('> ' + text + '\n');
        } else if (type === 'divider') {
          lines.push('---\n');
        } else if (type === 'image') {
          let src: string | undefined;
          if (blockData?.type === 'file') {
            src = blockData.file?.url;
          } else if (blockData?.type === 'external') {
            src = blockData.external?.url;
          }
          if (src) {
            imageIndex++;
            const ext = getFileExtension(src);
            const filename = `content-${imageIndex}.${ext}`;
            result.images.push({ url: src, filename });
            lines.push(`{/* IMAGE: ${filename} */}\n`);
          }
        } else if (type === 'video') {
          let src: string | undefined;
          if (blockData?.type === 'file') {
            src = blockData.file?.url;
          } else if (blockData?.type === 'external') {
            src = blockData.external?.url;
          }
          if (src) {
            lines.push(`<video src="${src}" controls />\n`);
          }
        } else if (type === 'file') {
          // 첨부 파일 - 다운로드 대상
          let src: string | undefined;
          let name: string | undefined;
          if (blockData?.type === 'file') {
            src = blockData.file?.url;
            name = blockData.name || 'file';
          } else if (blockData?.type === 'external') {
            src = blockData.external?.url;
            name = blockData.name || 'file';
          }
          if (src) {
            imageIndex++;
            const ext = getFileExtension(src);
            const filename = `file-${imageIndex}.${ext}`;
            result.images.push({ url: src, filename });
            lines.push(`[${name}](./assets/${filename})\n`);
          }
        } else if (type === 'embed' || type === 'bookmark') {
          const src = blockData?.url;
          if (src) {
            lines.push(`[${src}](${src})\n`);
          }
        }
      }

      cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
    } while (cursor);
    
    result.markdown = lines.join('\n');
  } catch (error) {
    console.error(`  ⚠️  페이지 콘텐츠 추출 실패: ${pageId}`);
  }
  
  return result;
}

function extractRichText(richText: any): string {
  if (!richText) return '';
  return richText.map((t: any) => {
    let text = t[0] || '';
    const annotations = t[1] || [];
    
    for (const ann of annotations) {
      if (ann[0] === 'b') text = `**${text}**`;
      if (ann[0] === 'i') text = `*${text}*`;
      if (ann[0] === 's') text = `~~${text}~~`;
      if (ann[0] === 'c') text = `\`${text}\``;
      if (ann[0] === 'a') text = `[${text}](${ann[1]})`;
    }
    
    return text;
  }).join('');
}

// notionId → slug 맵 (전역, main에서 초기화)
let idToSlugMap: Map<string, string> = new Map();

// Notion 프로퍼티 추출 (relation은 slug로 변환)
function extractProperty(prop: any): any {
  if (!prop) return null;
  
  const type = prop.type;
  
  switch (type) {
    case 'title':
      return prop.title?.map((t: any) => t.plain_text).join('') || '';
    case 'rich_text':
      return prop.rich_text?.map((t: any) => t.plain_text).join('') || '';
    case 'number':
      return prop.number;
    case 'select':
      return prop.select?.name || null;
    case 'multi_select':
      return prop.multi_select?.map((s: any) => s.name) || [];
    case 'date':
      return prop.date?.start || null;
    case 'checkbox':
      return prop.checkbox;
    case 'url':
      return prop.url;
    case 'email':
      return prop.email;
    case 'files':
      return prop.files?.[0]?.file?.url || prop.files?.[0]?.external?.url || null;
    case 'relation':
      // UUID를 slug로 변환
      const ids = prop.relation?.map((r: any) => r.id) || [];
      return ids.map((id: string) => idToSlugMap.get(id) || id).filter(Boolean);
    default:
      return null;
  }
}

// 모든 DB에서 페이지 ID → slug 맵 구축
async function buildIdToSlugMap(): Promise<void> {
  console.log('🔗 ID → Slug 맵 구축 중...');
  
  for (const [category, databaseId] of Object.entries(DATABASE_IDS)) {
    let cursor: string | undefined;
    let count = 0;
    
    do {
      const response = await notion.databases.query({
        database_id: databaseId,
        start_cursor: cursor,
        page_size: 100,
      });
      
      for (const page of response.results) {
        const props = (page as any).properties;
        const titleProp = Object.values(props).find((p: any) => p.type === 'title') as any;
        const title = titleProp?.title?.map((t: any) => t.plain_text).join('') || 'Untitled';
        const slug = slugify(title);
        
        if (slug) {
          idToSlugMap.set(page.id, slug);
          count++;
        }
      }
      
      cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
    } while (cursor);
    
    console.log(`   ${category}: ${count}개`);
  }
  
  console.log(`   총 ${idToSlugMap.size}개 매핑 완료\n`);
}

// ─── meta.ts Generation ──────────────────────────────────────────────────────

function generateMetaTs(
  meta: Record<string, any>,
  hasIcon: boolean,
  hasCover: boolean,
  iconExt: string,
  coverExt: string
): string {
  const imports: string[] = [];
  
  if (hasIcon) {
    imports.push(`import icon from './assets/icon.${iconExt}';`);
  }
  if (hasCover) {
    imports.push(`import cover from './assets/cover.${coverExt}';`);
  }

  // meta 객체에서 icon/cover 관련 필드 제거 후 생성
  const cleanMeta = { ...meta };
  delete cleanMeta.iconPath;
  delete cleanMeta.coverPath;
  delete cleanMeta.iconWidth;
  delete cleanMeta.iconHeight;
  delete cleanMeta.coverWidth;
  delete cleanMeta.coverHeight;

  let content = '';
  
  if (imports.length > 0) {
    content += imports.join('\n') + '\n\n';
  }

  // meta 객체를 TypeScript 코드로 변환
  const formatValue = (value: any, indent: number = 2): string => {
    const spaces = ' '.repeat(indent);
    
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'boolean') return value.toString();
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'string') return `'${value.replace(/'/g, "\\'")}'`;
    
    if (Array.isArray(value)) {
      if (value.length === 0) return '[]';
      const items = value.map(v => formatValue(v, indent + 2));
      return `[\n${spaces}  ${items.join(`,\n${spaces}  `)},\n${spaces}]`;
    }
    
    if (typeof value === 'object') {
      const entries = Object.entries(value);
      if (entries.length === 0) return '{}';
      const lines = entries.map(([k, v]) => {
        const key = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : `'${k}'`;
        return `${spaces}  ${key}: ${formatValue(v, indent + 2)}`;
      });
      return `{\n${lines.join(',\n')},\n${spaces}}`;
    }
    
    return String(value);
  };

  content += `export const meta = {\n`;
  
  // 각 필드 추가
  for (const [key, value] of Object.entries(cleanMeta)) {
    const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `'${key}'`;
    content += `  ${safeKey}: ${formatValue(value)},\n`;
  }
  
  if (hasIcon) {
    content += `  icon,\n`;
  }
  if (hasCover) {
    content += `  cover,\n`;
  }
  
  content += `};\n`;
  
  return content;
}

// ─── MDX Generation ──────────────────────────────────────────────────────────

function generateMdx(markdown: string, images: ImageInfo[], assetsDir: string): string {
  const imports: string[] = [];
  let content = markdown;
  let hasImages = false;
  let hasAttachments = false;

  // 이미지/파일 처리
  for (const img of images) {
    // 실제 파일 확장자 확인 (파일 타입 수정됐을 수 있음)
    let actualFilename = img.filename;
    const baseName = img.filename.replace(/\.[^.]+$/, '');
    
    // 수정된 파일 찾기 (pdf, doc, zip 등)
    const possibleExts = ['.pdf', '.doc', '.zip', '.docx', '.xlsx', '.pptx', '.hwp', '.hwpx'];
    for (const ext of possibleExts) {
      const testPath = path.join(assetsDir, baseName + ext);
      if (fs.existsSync(testPath)) {
        actualFilename = baseName + ext;
        break;
      }
    }
    
    const placeholder = `{/* IMAGE: ${img.filename} */}`;
    const actualPath = path.join(assetsDir, actualFilename);
    
    if (fs.existsSync(actualPath) && isImageFile(actualPath)) {
      // 이미지는 Image 컴포넌트로
      hasImages = true;
      const varName = `img_${actualFilename.replace(/[^a-z0-9]/gi, '_')}`;
      imports.push(`import ${varName} from './assets/${actualFilename}';`);
      const jsxImage = `<Image src={${varName}} alt="" />`;
      content = content.replace(placeholder, jsxImage);
    } else {
      // 첨부파일은 FileDownload 컴포넌트로
      hasAttachments = true;
      const ext = path.extname(actualFilename).slice(1).toUpperCase();
      const jsx = `<FileDownload href="./assets/${actualFilename}" filename="${actualFilename}" type="${ext}" />`;
      content = content.replace(placeholder, jsx);
    }
  }

  if (hasImages) {
    imports.unshift(`import Image from 'next/image';`);
  }
  if (hasAttachments) {
    imports.unshift(`import { FileDownload } from '@/components/FileDownload';`);
  }

  if (imports.length === 0) {
    return content;
  }

  return `${imports.join('\n')}\n\n${content}`;
}

// ─── Main Migration ──────────────────────────────────────────────────────────

async function migrateCategory(
  category: 'projects' | 'careers' | 'skills',
  databaseId: string
) {
  console.log(`\n📦 ${category} 마이그레이션 시작...`);
  
  const categoryDir = path.join(CONTENT_DIR, category);
  const categoryPrevDir = path.join(CONTENT_PREV_DIR, category);
  ensureDir(categoryDir);

  // Notion에서 모든 페이지 가져오기
  const pages: any[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: cursor,
      page_size: 100,
    });
    pages.push(...response.results);
    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);

  console.log(`  📄 ${pages.length}개 항목 발견`);

  const index: any[] = [];

  for (const page of pages) {
    const props = (page as any).properties;
    
    // 제목 추출
    const titleProp = Object.values(props).find((p: any) => p.type === 'title') as any;
    const title = titleProp?.title?.map((t: any) => t.plain_text).join('') || 'Untitled';
    const slug = slugify(title);
    
    if (!slug) continue;

    const itemDir = path.join(categoryDir, slug);
    const assetsDir = path.join(itemDir, 'assets');
    const prevAssetsDir = path.join(categoryPrevDir, slug, 'assets');
    
    ensureDir(itemDir);
    ensureDir(assetsDir);

    console.log(`  📁 ${slug}`);

    // 메타데이터 추출
    const meta: Record<string, any> = {
      id: slug,
      notionId: page.id,
      title,
    };

    // 프로퍼티 매핑
    for (const [key, value] of Object.entries(props)) {
      const extracted = extractProperty(value);
      if (extracted !== null && extracted !== '' && 
          !(Array.isArray(extracted) && extracted.length === 0)) {
        meta[key] = extracted;
      }
    }

    // 아이콘/커버 다운로드
    const iconUrl = (page as any).icon?.file?.url || (page as any).icon?.external?.url;
    const coverUrl = (page as any).cover?.file?.url || (page as any).cover?.external?.url;

    let hasIcon = false;
    let hasCover = false;
    let iconExt = 'png';
    let coverExt = 'png';

    if (iconUrl) {
      iconExt = getFileExtension(iconUrl);
      const filename = `icon.${iconExt}`;
      const destPath = path.join(assetsDir, filename);
      
      hasIcon = await downloadImage(iconUrl, destPath, prevAssetsDir, filename);
      if (!hasIcon) {
        console.log(`    ⚠️  아이콘 다운로드 실패`);
      }
    }

    if (coverUrl) {
      coverExt = getFileExtension(coverUrl);
      const filename = `cover.${coverExt}`;
      const destPath = path.join(assetsDir, filename);
      
      hasCover = await downloadImage(coverUrl, destPath, prevAssetsDir, filename);
      if (!hasCover) {
        console.log(`    ⚠️  커버 다운로드 실패`);
      }
    }

    // 페이지 콘텐츠 추출
    const { markdown, images } = await extractPageContent(page.id);

    // 콘텐츠 이미지 다운로드
    const downloadedImages: ImageInfo[] = [];
    for (const img of images) {
      const destPath = path.join(assetsDir, img.filename);
      
      const success = await downloadImage(img.url, destPath, prevAssetsDir, img.filename);
      if (success) {
        downloadedImages.push(img);
      } else {
        console.log(`    ⚠️  이미지 다운로드 실패: ${img.filename}`);
      }
    }

    // meta.ts 생성
    const metaTsContent = generateMetaTs(meta, hasIcon, hasCover, iconExt, coverExt);
    fs.writeFileSync(path.join(itemDir, 'meta.tsx'), metaTsContent);

    // MDX 생성
    const mdxContent = generateMdx(markdown, downloadedImages, assetsDir);
    fs.writeFileSync(path.join(itemDir, 'index.mdx'), mdxContent);

    // 인덱스에 추가 (기본 정보만)
    index.push({
      id: slug,
      title,
      hasIcon,
      hasCover,
    });

    // Rate limiting
    await new Promise(r => setTimeout(r, 100));
  }

  console.log(`  ✅ ${pages.length}개 완료`);
}

// content의 assets를 content_prev로 복사 (캐시 보존)
function mergeAssetsToCache() {
  if (!fs.existsSync(CONTENT_DIR)) return;
  
  for (const category of ['projects', 'careers', 'skills']) {
    const srcCat = path.join(CONTENT_DIR, category);
    const dstCat = path.join(CONTENT_PREV_DIR, category);
    
    if (!fs.existsSync(srcCat)) continue;
    ensureDir(dstCat);
    
    const slugs = fs.readdirSync(srcCat, { withFileTypes: true })
      .filter(d => d.isDirectory() && !d.name.startsWith('_'))
      .map(d => d.name);
    
    for (const slug of slugs) {
      const srcAssets = path.join(srcCat, slug, 'assets');
      const dstAssets = path.join(dstCat, slug, 'assets');
      
      if (!fs.existsSync(srcAssets)) continue;
      ensureDir(dstAssets);
      
      const files = fs.readdirSync(srcAssets);
      for (const file of files) {
        const srcFile = path.join(srcAssets, file);
        const dstFile = path.join(dstAssets, file);
        if (!fs.existsSync(dstFile)) {
          fs.copyFileSync(srcFile, dstFile);
        }
      }
    }
  }
}

async function main() {
  console.log('🚀 Notion → Local 마이그레이션 시작 (Option A: meta.ts 방식)\n');

  // 1. ID → Slug 맵 먼저 구축 (relation 변환용)
  await buildIdToSlugMap();

  // 2. content의 assets를 content_prev로 복사 (캐시 보존)
  if (fs.existsSync(CONTENT_DIR)) {
    console.log('📦 현재 content assets를 캐시로 복사...');
    mergeAssetsToCache();
    
    console.log('🗑️  content 삭제...');
    fs.rmSync(CONTENT_DIR, { recursive: true });
  }

  // 3. 새 content 폴더 생성
  ensureDir(CONTENT_DIR);

  // 4. 각 카테고리 마이그레이션
  for (const [category, databaseId] of Object.entries(DATABASE_IDS)) {
    await migrateCategory(category as any, databaseId);
  }

  // 4. .gitignore에 content_prev 추가 확인
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const gitignore = fs.readFileSync(gitignorePath, 'utf-8');
    if (!gitignore.includes('src/content_prev')) {
      fs.appendFileSync(gitignorePath, '\n# Migration cache\nsrc/content_prev/\n');
      console.log('\n📝 .gitignore에 content_prev 추가됨');
    }
  }

  console.log('\n✅ 마이그레이션 완료!');
  console.log(`   📁 ${CONTENT_DIR}`);
  
  console.log('\n📊 이미지 통계:');
  console.log(`   캐시 히트: ${cacheHits}`);
  console.log(`   캐시 미스: ${cacheMisses}`);
  console.log(`   다운로드 성공: ${downloadSuccess}`);
  console.log(`   다운로드 실패: ${downloadFail}`);
  const total = cacheHits + downloadSuccess + downloadFail;
  const hitRate = total > 0 ? ((cacheHits / total) * 100).toFixed(1) : 0;
  console.log(`   캐시 히트율: ${hitRate}%`);
  console.log('\n📌 다음 단계:');
  console.log('   1. API 수정: meta.ts에서 동적 import');
  console.log('   2. 페이지 컴포넌트: MDX 동적 로드');
}

main().catch(console.error);
