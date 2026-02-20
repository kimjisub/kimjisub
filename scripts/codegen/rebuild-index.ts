/**
 * content들의 meta.tsx들을 묶어서 content/.../_index.ts로 만들어주는 스크립트
 */

import * as fs from 'fs';
import * as path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'src/content');

export function rebuildIndex(category: string): number {
  const categoryDir = path.join(CONTENT_DIR, category);
  
  const slugs = fs.readdirSync(categoryDir, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('_'))
    .map(d => d.name);
  
  const lines: string[] = [
    '// Auto-generated - DO NOT EDIT',
    '// Run `npx tsx scripts/codegen` to regenerate',
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
  return slugs.length;
}

export function rebuildAllIndexes(): void {
  console.log('📝 Rebuilding _index.ts files...');
  
  for (const cat of ['projects', 'careers', 'skills']) {
    const count = rebuildIndex(cat);
    console.log(`   ${cat}: ${count} items`);
  }
}

// Direct execution
if (require.main === module) {
  rebuildAllIndexes();
}
