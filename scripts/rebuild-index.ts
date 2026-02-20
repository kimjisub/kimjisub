#!/usr/bin/env npx tsx
/**
 * _index.ts 재생성 스크립트
 */

import * as fs from 'fs';
import * as path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'src/content');

function rebuildIndex(category: string) {
  const categoryDir = path.join(CONTENT_DIR, category);
  
  const slugs = fs.readdirSync(categoryDir, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('_'))
    .map(d => d.name);
  
  const lines: string[] = [
    '// Auto-generated - DO NOT EDIT',
    '// Run `npx tsx scripts/notion-to-local.ts` to regenerate',
    '',
  ];
  
  // Import 문
  for (let i = 0; i < slugs.length; i++) {
    lines.push(`import { meta as meta_${i} } from './${slugs[i]}/meta';`);
  }
  
  lines.push('');
  lines.push(`export const ${category}Metas = {`);
  
  for (let i = 0; i < slugs.length; i++) {
    lines.push(`  '${slugs[i]}': meta_${i},`);
  }
  
  lines.push('};');
  lines.push('');
  lines.push(`export type ${category.charAt(0).toUpperCase() + category.slice(1)}Meta = typeof ${category}Metas[keyof typeof ${category}Metas];`);
  lines.push('');
  
  fs.writeFileSync(path.join(categoryDir, '_index.ts'), lines.join('\n'));
  console.log(`✅ ${category}/_index.ts (${slugs.length} items)`);
}

for (const cat of ['projects', 'careers', 'skills']) {
  rebuildIndex(cat);
}
