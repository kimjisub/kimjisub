#!/usr/bin/env npx tsx
/**
 * .md → .mdx 변환 스크립트
 * - ![alt](./assets/...) → import + <Image> 컴포넌트
 * - 빌드 타임 이미지 최적화 지원
 */

import * as fs from 'fs';
import * as path from 'path';

const CONTENT_DIR = path.join(__dirname, '../src/content');

// 이미지 마크다운 패턴: ![alt](path)
const IMAGE_PATTERN = /!\[([^\]]*)\]\(([^)]+)\)/g;

// 변수명 생성 (파일명 기반)
function toVarName(filePath: string, index: number): string {
  const basename = path.basename(filePath, path.extname(filePath));
  // 숫자로 시작하거나 특수문자 포함 시 처리
  const clean = basename.replace(/[^a-zA-Z0-9]/g, '_').replace(/^(\d)/, '_$1');
  return `img_${clean}_${index}`;
}

// 단일 파일 변환
function convertFile(mdPath: string): { converted: boolean; images: number } {
  const content = fs.readFileSync(mdPath, 'utf-8');
  
  // 이미지 찾기
  const images: { full: string; alt: string; src: string; varName: string }[] = [];
  let match;
  let index = 0;
  
  // 패턴 리셋
  IMAGE_PATTERN.lastIndex = 0;
  
  while ((match = IMAGE_PATTERN.exec(content)) !== null) {
    const [full, alt, src] = match;
    
    // 외부 URL은 스킵
    if (src.startsWith('http://') || src.startsWith('https://')) {
      continue;
    }
    
    // 로컬 이미지만 처리
    if (src.startsWith('./') || src.startsWith('assets/')) {
      images.push({
        full,
        alt: alt || 'image',
        src,
        varName: toVarName(src, index++),
      });
    }
  }
  
  // 이미지가 없으면 변환 불필요
  if (images.length === 0) {
    return { converted: false, images: 0 };
  }
  
  // import 문 생성
  const imports = [
    "import Image from 'next/image'",
    ...images.map(img => `import ${img.varName} from '${img.src}'`),
  ].join('\n');
  
  // 이미지 태그 교체
  let newContent = content;
  for (const img of images) {
    // ![alt](src) → <Image src={varName} alt="alt" />
    const replacement = `<Image src={${img.varName}} alt="${img.alt}" className="rounded-lg" />`;
    newContent = newContent.replace(img.full, replacement);
  }
  
  // frontmatter 뒤에 import 삽입
  const frontmatterMatch = newContent.match(/^---\n[\s\S]*?\n---\n/);
  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[0];
    const rest = newContent.slice(frontmatter.length);
    newContent = frontmatter + '\n' + imports + '\n' + rest;
  } else {
    // frontmatter 없으면 맨 앞에
    newContent = imports + '\n\n' + newContent;
  }
  
  // .mdx로 저장
  const mdxPath = mdPath.replace(/\.md$/, '.mdx');
  fs.writeFileSync(mdxPath, newContent);
  
  // 원본 .md 삭제
  fs.unlinkSync(mdPath);
  
  return { converted: true, images: images.length };
}

// 메인
function main() {
  console.log('🔄 Converting .md → .mdx...\n');
  
  const categories = ['projects', 'careers', 'skills'];
  let totalFiles = 0;
  let totalImages = 0;
  
  for (const category of categories) {
    const categoryDir = path.join(CONTENT_DIR, category);
    if (!fs.existsSync(categoryDir)) continue;
    
    const slugs = fs.readdirSync(categoryDir, { withFileTypes: true })
      .filter(d => d.isDirectory() && !d.name.startsWith('_'))
      .map(d => d.name);
    
    for (const slug of slugs) {
      const slugDir = path.join(categoryDir, slug);
      const mdFiles = ['index.md', 'content.md'];
      
      for (const mdFile of mdFiles) {
        const mdPath = path.join(slugDir, mdFile);
        if (!fs.existsSync(mdPath)) continue;
        
        const result = convertFile(mdPath);
        if (result.converted) {
          console.log(`  ✅ ${category}/${slug}/${mdFile} → .mdx (${result.images} images)`);
          totalFiles++;
          totalImages += result.images;
        }
      }
    }
  }
  
  console.log(`\n🎉 Converted ${totalFiles} files with ${totalImages} images`);
}

main();
