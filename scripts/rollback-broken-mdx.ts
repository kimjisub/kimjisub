#!/usr/bin/env npx tsx
/**
 * 이미지 파일이 누락된 MDX 파일을 원래 .md로 롤백
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const CONTENT_DIR = path.join(__dirname, '../src/content');

function main() {
  const categories = ['projects', 'careers'];
  let rolledBack = 0;

  console.log('🔍 Checking for broken MDX files...\n');

  for (const category of categories) {
    const categoryDir = path.join(CONTENT_DIR, category);
    if (!fs.existsSync(categoryDir)) continue;

    const slugs = fs.readdirSync(categoryDir, { withFileTypes: true })
      .filter(d => d.isDirectory() && !d.name.startsWith('_'))
      .map(d => d.name);

    for (const slug of slugs) {
      const slugDir = path.join(categoryDir, slug);
      const mdxPath = path.join(slugDir, 'index.mdx');
      const mdPath = path.join(slugDir, 'index.md');
      const assetsDir = path.join(slugDir, 'assets');

      if (!fs.existsSync(mdxPath)) continue;

      // MDX에서 import하는 이미지 파일들 추출
      const content = fs.readFileSync(mdxPath, 'utf-8');
      const imports = content.match(/from '\.\/(assets\/[^']+)'/g) || [];
      
      let hasMissing = false;
      for (const imp of imports) {
        const match = imp.match(/from '\.\/([^']+)'/);
        if (match) {
          const imgPath = path.join(slugDir, match[1]);
          if (!fs.existsSync(imgPath)) {
            hasMissing = true;
            break;
          }
        }
      }

      if (hasMissing) {
        console.log(`📁 ${category}/${slug} - 이미지 누락, 롤백`);
        
        // git에서 원본 .md 복구
        try {
          execSync(`git checkout -- "${mdPath}"`, { 
            cwd: path.join(__dirname, '..'),
            stdio: 'pipe'
          });
          // .mdx 삭제
          fs.unlinkSync(mdxPath);
          console.log(`   ✅ 롤백 완료`);
          rolledBack++;
        } catch (err) {
          console.log(`   ❌ 롤백 실패`);
        }
      }
    }
  }

  console.log(`\n🎉 Rolled back ${rolledBack} broken MDX files`);
}

main();
