#!/usr/bin/env npx tsx
/**
 * 비정규 이미지 파일명을 content-N.ext로 순차 rename
 * - content-1이 이미 있으면 content-2부터 시작
 * - 파일 수정시간 순으로 정렬 후 rename
 */

import * as fs from 'fs';
import * as path from 'path';

const CONTENT_DIR = path.join(__dirname, '../src/content');

// 마크다운에서 이미지 경로 추출
function getImagePathsFromMarkdown(mdPath: string): string[] {
  if (!fs.existsSync(mdPath)) return [];
  
  const content = fs.readFileSync(mdPath, 'utf-8');
  const matches = content.match(/!\[.*?\]\(\.\/(assets\/content-\d+\.[a-z]+)\)/gi) || [];
  
  return matches.map(m => {
    const match = m.match(/\.\/(assets\/content-(\d+)\.[a-z]+)/i);
    return match ? { path: match[1], num: parseInt(match[2]) } : null;
  }).filter(Boolean).sort((a, b) => a!.num - b!.num).map(x => x!.path);
}

// 메인
function main() {
  const categories = ['projects', 'careers'];
  let totalRenamed = 0;

  console.log('🔄 Renaming images to content-N format...\n');

  for (const category of categories) {
    const categoryDir = path.join(CONTENT_DIR, category);
    if (!fs.existsSync(categoryDir)) continue;

    const slugs = fs.readdirSync(categoryDir, { withFileTypes: true })
      .filter(d => d.isDirectory() && !d.name.startsWith('_'))
      .map(d => d.name);

    for (const slug of slugs) {
      const slugDir = path.join(categoryDir, slug);
      const assetsDir = path.join(slugDir, 'assets');
      const mdPath = path.join(slugDir, 'index.md');

      if (!fs.existsSync(assetsDir)) continue;

      // 마크다운에서 필요한 이미지 경로
      const neededPaths = getImagePathsFromMarkdown(mdPath);
      if (neededPaths.length === 0) continue;

      // 현재 파일들
      const files = fs.readdirSync(assetsDir);
      
      // 이미 content-N 형태인 파일들
      const contentFiles = files.filter(f => /^content-\d+\./i.test(f));
      const existingNums = contentFiles.map(f => {
        const m = f.match(/content-(\d+)\./i);
        return m ? parseInt(m[1]) : 0;
      });
      
      // 비정규 파일들 (시간순 정렬)
      const irregularFiles = files
        .filter(f => 
          !f.startsWith('content-') && 
          !f.startsWith('s3-') &&
          /\.(png|jpg|jpeg|gif|webp)$/i.test(f)
        )
        .map(f => ({
          name: f,
          mtime: fs.statSync(path.join(assetsDir, f)).mtime.getTime()
        }))
        .sort((a, b) => a.mtime - b.mtime)
        .map(x => x.name);

      if (irregularFiles.length === 0) continue;

      // 누락된 번호 찾기
      const missingNums: number[] = [];
      for (let i = 1; i <= neededPaths.length; i++) {
        if (!existingNums.includes(i)) {
          missingNums.push(i);
        }
      }

      if (missingNums.length === 0) continue;

      console.log(`📁 ${category}/${slug}`);
      console.log(`   필요: ${neededPaths.length}개, 누락: ${missingNums.length}개, 비정규: ${irregularFiles.length}개`);

      // 순서대로 rename
      for (let i = 0; i < Math.min(missingNums.length, irregularFiles.length); i++) {
        const srcFile = irregularFiles[i];
        const targetNum = missingNums[i];
        const ext = path.extname(srcFile);
        const targetFile = `content-${targetNum}${ext}`;
        
        const srcPath = path.join(assetsDir, srcFile);
        const targetPath = path.join(assetsDir, targetFile);

        try {
          fs.renameSync(srcPath, targetPath);
          console.log(`   ✅ ${srcFile} → ${targetFile}`);
          totalRenamed++;
        } catch (err: any) {
          console.log(`   ❌ ${srcFile}: ${err.message}`);
        }
      }
    }
  }

  console.log(`\n🎉 Renamed ${totalRenamed} files`);
}

main();
