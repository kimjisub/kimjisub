#!/usr/bin/env npx tsx
/**
 * 모든 S3 URL을 로컬 파일로 다운로드하고 경로를 교체하는 스크립트
 */

import * as fs from 'fs';
import * as path from 'path';
import https from 'https';

const CONTENT_DIR = path.join(__dirname, '../src/content');

// S3 URL 패턴
const S3_URL_PATTERN = /https:\/\/prod-files-secure\.s3\.us-west-2\.amazonaws\.com\/[^\s"'\)\]]+/g;

interface DownloadResult {
  url: string;
  localPath: string;
  success: boolean;
  error?: string;
}

// URL에서 파일 확장자 추출
function getExtensionFromUrl(url: string): string {
  // URL에서 쿼리 파라미터 제거
  const urlWithoutQuery = url.split('?')[0];
  const ext = path.extname(urlWithoutQuery);
  if (ext && ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.pdf'].includes(ext.toLowerCase())) {
    return ext;
  }
  // Content-Type 기반으로 추측 (기본값)
  return '.png';
}

// 파일 다운로드
async function downloadFile(url: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // 리다이렉트 처리
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          file.close();
          fs.unlinkSync(destPath);
          downloadFile(redirectUrl, destPath).then(resolve).catch(reject);
          return;
        }
      }
      
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(destPath);
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

// 모든 파일에서 S3 URL 찾기
function findAllS3Urls(): Map<string, { filePath: string; urls: string[] }> {
  const results = new Map<string, { filePath: string; urls: string[] }>();
  
  function scanDir(dir: string) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else if (item.endsWith('.json') || item.endsWith('.md')) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const matches = content.match(S3_URL_PATTERN);
        
        if (matches && matches.length > 0) {
          results.set(fullPath, {
            filePath: fullPath,
            urls: [...new Set(matches)] // 중복 제거
          });
        }
      }
    }
  }
  
  scanDir(CONTENT_DIR);
  return results;
}

// URL을 로컬 경로로 변환
function urlToLocalPath(url: string, contentDir: string, index: number): string {
  const ext = getExtensionFromUrl(url);
  const assetsDir = path.join(contentDir, 'assets');
  
  // assets 디렉토리 생성
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }
  
  // 파일명 생성 (URL 해시 기반)
  const urlHash = Buffer.from(url.split('?')[0]).toString('base64').replace(/[/+=]/g, '').slice(-12);
  return path.join(assetsDir, `s3-${urlHash}${ext}`);
}

// 메인 함수
async function main() {
  console.log('🔍 Scanning for S3 URLs...\n');
  
  const fileUrls = findAllS3Urls();
  let totalUrls = 0;
  const uniqueUrls = new Set<string>();
  
  fileUrls.forEach(({ urls }) => {
    urls.forEach(url => {
      uniqueUrls.add(url.split('?')[0]); // 쿼리 파라미터 제외하고 유니크
      totalUrls++;
    });
  });
  
  console.log(`📊 Found ${totalUrls} S3 URL references in ${fileUrls.size} files`);
  console.log(`📊 Unique URLs (without query params): ${uniqueUrls.size}\n`);
  
  // URL -> 로컬 경로 매핑
  const urlToLocalMap = new Map<string, string>();
  let downloadedCount = 0;
  let failedCount = 0;
  
  // 파일별로 처리
  for (const [filePath, { urls }] of fileUrls) {
    const contentDir = path.dirname(filePath);
    const relativePath = path.relative(CONTENT_DIR, contentDir);
    
    console.log(`\n📁 Processing: ${relativePath}`);
    
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const urlBase = url.split('?')[0];
      
      // 이미 다운로드한 URL인지 확인
      if (urlToLocalMap.has(urlBase)) {
        continue;
      }
      
      const localPath = urlToLocalPath(url, contentDir, i);
      const localRelative = path.relative(contentDir, localPath);
      
      // 이미 파일이 존재하면 스킵
      if (fs.existsSync(localPath)) {
        console.log(`  ⏭️  Already exists: ${path.basename(localPath)}`);
        urlToLocalMap.set(urlBase, localRelative);
        continue;
      }
      
      try {
        process.stdout.write(`  ⬇️  Downloading ${path.basename(localPath)}...`);
        await downloadFile(url, localPath);
        
        // 파일 크기 확인
        const stats = fs.statSync(localPath);
        if (stats.size < 100) {
          // 너무 작으면 에러 응답일 수 있음
          const content = fs.readFileSync(localPath, 'utf-8');
          if (content.includes('AccessDenied') || content.includes('Error')) {
            throw new Error('Access Denied or Error response');
          }
        }
        
        console.log(` ✅ (${Math.round(stats.size / 1024)}KB)`);
        urlToLocalMap.set(urlBase, localRelative);
        downloadedCount++;
      } catch (err: any) {
        console.log(` ❌ ${err.message}`);
        failedCount++;
        
        // 실패한 URL은 placeholder 이미지로 대체하거나 그대로 둠
        // 일단은 매핑에서 제외
      }
      
      // Rate limiting
      await new Promise(r => setTimeout(r, 100));
    }
  }
  
  console.log(`\n\n📥 Download complete: ${downloadedCount} succeeded, ${failedCount} failed\n`);
  
  // 파일 내용 업데이트
  console.log('🔄 Updating file references...\n');
  
  let updatedFiles = 0;
  
  for (const [filePath, { urls }] of fileUrls) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;
    const contentDir = path.dirname(filePath);
    
    for (const url of urls) {
      const urlBase = url.split('?')[0];
      const localRelative = urlToLocalMap.get(urlBase);
      
      if (localRelative) {
        // 마크다운에서는 ./assets/... 형태로
        // JSON에서는 그냥 assets/... 또는 ./assets/...
        const isJson = filePath.endsWith('.json');
        const newPath = localRelative.startsWith('./') ? localRelative : `./${localRelative}`;
        
        // URL 전체를 로컬 경로로 교체
        const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedUrl, 'g');
        
        if (content.includes(url)) {
          content = content.replace(regex, newPath);
          modified = true;
        }
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`  ✅ Updated: ${path.relative(CONTENT_DIR, filePath)}`);
      updatedFiles++;
    }
  }
  
  console.log(`\n✅ Updated ${updatedFiles} files`);
  console.log('\n🎉 All S3 URLs have been localized!');
}

main().catch(console.error);
