#!/usr/bin/env npx tsx
/**
 * 마크다운의 이미지 경로를 실제 파일 확장자로 수정
 */

import * as fs from 'fs';
import * as path from 'path';

const CONTENT_DIR = path.join(__dirname, '../src/content');

function main() {
  const categories = ['projects', 'careers'];
  let totalFixed = 0;

  console.log('🔧 Fixing image extensions in markdown...\n');

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

      if (!fs.existsSync(mdPath) || !fs.existsSync(assetsDir)) continue;

      let content = fs.readFileSync(mdPath, 'utf-8');
      let modified = false;
      let fixCount = 0;

      // content-N.ext 패턴 찾기
      const pattern = /!\[([^\]]*)\]\(\.\/(assets\/content-(\d+))\.([a-z]+)\)/gi;
      
      content = content.replace(pattern, (match, alt, basePath, num, ext) => {
        // 실제 파일 확장자 찾기
        const files = fs.readdirSync(assetsDir);
        const actualFile = files.find(f => f.startsWith(`content-${num}.`));
        
        if (!actualFile) return match;
        
        const actualExt = path.extname(actualFile).slice(1);
        
        if (actualExt.toLowerCase() !== ext.toLowerCase()) {
          modified = true;
          fixCount++;
          return `![${alt}](./${basePath}.${actualExt})`;
        }
        
        return match;
      });

      if (modified) {
        fs.writeFileSync(mdPath, content);
        console.log(`📁 ${category}/${slug}: ${fixCount}개 수정`);
        totalFixed += fixCount;
      }
    }
  }

  console.log(`\n✅ Fixed ${totalFixed} image paths`);
}

main();
