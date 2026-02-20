#!/usr/bin/env npx tsx
/**
 * Codegen entrypoint
 * 
 * src/content 하위 파일들이 변경되면 자동으로 재생성
 * 
 * Usage:
 *   npx tsx scripts/codegen           # 한 번 실행
 *   npx tsx scripts/codegen --watch   # 변경 감지 모드
 */

import chokidar from 'chokidar';
import * as path from 'path';
import { rebuildAllIndexes } from './rebuild-index';
import { buildAndSaveRelations } from './build-relations';

const CONTENT_DIR = path.join(process.cwd(), 'src/content');

function runCodegen(): void {
  console.log('\n🔧 Running codegen...\n');
  
  rebuildAllIndexes();
  buildAndSaveRelations();
  
  console.log('\n✅ Codegen complete!\n');
}

function watchMode(): void {
  console.log('👀 Watching src/content for changes...\n');
  
  // 초기 실행
  runCodegen();
  
  // meta.tsx 변경 감지
  const watcher = chokidar.watch([
    path.join(CONTENT_DIR, '*/*/meta.tsx'),
    path.join(CONTENT_DIR, '*/*/meta.json'),
  ], {
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 100,
      pollInterval: 50,
    },
  });
  
  let debounceTimer: NodeJS.Timeout | null = null;
  
  const handleChange = (filePath: string) => {
    console.log(`📝 Changed: ${path.relative(process.cwd(), filePath)}`);
    
    // Debounce - 여러 파일 동시 변경 시 한 번만 실행
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => {
      runCodegen();
      debounceTimer = null;
    }, 300);
  };
  
  watcher.on('add', handleChange);
  watcher.on('change', handleChange);
  watcher.on('unlink', handleChange);
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n👋 Stopping watcher...');
    watcher.close();
    process.exit(0);
  });
}

// Main
const args = process.argv.slice(2);

if (args.includes('--watch') || args.includes('-w')) {
  watchMode();
} else {
  runCodegen();
}
