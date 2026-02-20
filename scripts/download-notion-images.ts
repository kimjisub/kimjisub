/**
 * Notion S3 이미지 다운로드 스크립트
 * 
 * 마크다운 내 Notion S3 URL을 찾아서:
 * 1. 이미지를 다운로드하여 assets 폴더에 저장
 * 2. 마크다운 내 URL을 로컬 경로로 변경
 * 
 * Usage: npx tsx scripts/download-notion-images.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';

const CONTENT_DIR = path.join(__dirname, '../src/content');

// Notion S3 URL 패턴
const NOTION_S3_REGEX = /https:\/\/(?:s3-us-west-2\.amazonaws\.com\/secure\.notion-static\.com|prod-files-secure\.s3\.us-west-2\.amazonaws\.com)\/[^\s\)]+/g;

interface DownloadResult {
  file: string;
  downloaded: number;
  failed: number;
  errors: string[];
}

// URL에서 파일 확장자 추출
function getExtensionFromUrl(url: string): string {
  // URL에서 파일명 부분 추출 (쿼리스트링 제거)
  const urlPath = url.split('?')[0];
  const fileName = urlPath.split('/').pop() || '';
  const ext = path.extname(fileName).toLowerCase();
  
  if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)) {
    return ext;
  }
  
  // 확장자가 없으면 jpg로 기본 설정
  return '.jpg';
}

// 이미지 다운로드
function downloadImage(url: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const request = protocol.get(url, { timeout: 30000 }, (response) => {
      // 리다이렉트 처리
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          downloadImage(redirectUrl, destPath).then(resolve).catch(reject);
          return;
        }
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      
      const dir = path.dirname(destPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      const fileStream = fs.createWriteStream(destPath);
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
      
      fileStream.on('error', reject);
    });
    
    request.on('error', reject);
    request.on('timeout', () => {
      request.destroy();
      reject(new Error('Timeout'));
    });
  });
}

// 단일 마크다운 파일 처리
async function processMarkdownFile(mdPath: string): Promise<DownloadResult> {
  const result: DownloadResult = {
    file: mdPath,
    downloaded: 0,
    failed: 0,
    errors: [],
  };
  
  let content = fs.readFileSync(mdPath, 'utf-8');
  const matches = content.match(NOTION_S3_REGEX);
  
  if (!matches || matches.length === 0) {
    return result;
  }
  
  const uniqueUrls = [...new Set(matches)];
  const mdDir = path.dirname(mdPath);
  const assetsDir = path.join(mdDir, 'assets');
  
  console.log(`\n📄 ${path.relative(CONTENT_DIR, mdPath)}`);
  console.log(`   Found ${uniqueUrls.length} Notion S3 URLs`);
  
  for (let i = 0; i < uniqueUrls.length; i++) {
    const url = uniqueUrls[i];
    const ext = getExtensionFromUrl(url);
    const fileName = `notion-${i + 1}${ext}`;
    const localPath = path.join(assetsDir, fileName);
    const relativePath = `./assets/${fileName}`;
    
    try {
      // 이미 다운로드된 경우 스킵
      if (fs.existsSync(localPath)) {
        console.log(`   ⏭️  ${fileName} (already exists)`);
        content = content.split(url).join(relativePath);
        continue;
      }
      
      await downloadImage(url, localPath);
      content = content.split(url).join(relativePath);
      result.downloaded++;
      console.log(`   ✅ ${fileName}`);
    } catch (error) {
      result.failed++;
      const errorMsg = error instanceof Error ? error.message : String(error);
      result.errors.push(`${fileName}: ${errorMsg}`);
      console.log(`   ❌ ${fileName}: ${errorMsg}`);
    }
  }
  
  // 변경된 내용 저장
  if (result.downloaded > 0) {
    fs.writeFileSync(mdPath, content, 'utf-8');
  }
  
  return result;
}

// 모든 마크다운 파일 찾기
function findMarkdownFiles(dir: string): string[] {
  const files: string[] = [];
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory() && !entry.name.startsWith('_')) {
      files.push(...findMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

async function main() {
  console.log('🔄 Downloading Notion S3 images...\n');
  
  const mdFiles = findMarkdownFiles(CONTENT_DIR);
  console.log(`Found ${mdFiles.length} markdown files`);
  
  let totalDownloaded = 0;
  let totalFailed = 0;
  const allErrors: string[] = [];
  
  for (const mdPath of mdFiles) {
    const result = await processMarkdownFile(mdPath);
    totalDownloaded += result.downloaded;
    totalFailed += result.failed;
    allErrors.push(...result.errors);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Downloaded: ${totalDownloaded}`);
  console.log(`❌ Failed: ${totalFailed}`);
  
  if (allErrors.length > 0) {
    console.log('\nErrors:');
    allErrors.forEach(e => console.log(`  - ${e}`));
  }
  
  console.log('\n🎉 Done!');
}

main().catch(console.error);
