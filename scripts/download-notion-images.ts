/**
 * Download Notion images using official Notion API (with nested block support)
 * 
 * Usage: npx tsx scripts/download-notion-images.ts
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const CONTENT_DIR = path.join(process.cwd(), 'src/content');
const NOTION_S3_PATTERN = /!\[([^\]]*)\]\((https:\/\/prod-files-secure\.s3\.us-west-2\.amazonaws\.com\/[^)]+)\)/g;

const notion = new Client({ auth: process.env.NOTION_SECRET });

interface ImageToDownload {
  mdFile: string;
  originalUrl: string;
  altText: string;
  localPath: string;
  relativePath: string;
  filename: string;
}

interface ContentFolder {
  path: string;
  notionId: string;
  images: ImageToDownload[];
}

async function downloadFile(url: string, destPath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(destPath);
    
    const request = (url: string) => {
      https.get(url, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          const redirectUrl = response.headers.location;
          if (redirectUrl) {
            file.close();
            if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
            request(redirectUrl);
            return;
          }
        }
        
        if (response.statusCode !== 200) {
          console.error(`  ❌ HTTP ${response.statusCode}`);
          file.close();
          if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
          resolve(false);
          return;
        }
        
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          resolve(true);
        });
      }).on('error', (err) => {
        console.error(`  ❌ Error: ${err.message}`);
        file.close();
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        resolve(false);
      });
    };
    
    request(url);
  });
}

function getExtensionFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const ext = path.extname(decodeURIComponent(pathname)).toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.pdf', '.heic'].includes(ext)) {
      return ext;
    }
  } catch {}
  return '.jpg';
}

function sanitizeFilename(filename: string): string {
  try {
    filename = decodeURIComponent(filename);
  } catch {}
  
  return filename
    .replace(/[<>:"/\\|?*]/g, '_')
    .replace(/\s+/g, '_')
    .substring(0, 100);
}

function extractFilenameFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const parts = pathname.split('/');
    return decodeURIComponent(parts[parts.length - 1].split('?')[0]);
  } catch {
    return 'image.jpg';
  }
}

// Recursively get all images from a page, including nested blocks
async function getPageImagesRecursive(blockId: string, depth: number = 0): Promise<Map<string, string>> {
  const imageMap = new Map<string, string>();
  const maxDepth = 5; // Prevent infinite recursion
  
  if (depth > maxDepth) return imageMap;
  
  try {
    let cursor: string | undefined;
    
    do {
      const response = await notion.blocks.children.list({
        block_id: blockId,
        start_cursor: cursor,
        page_size: 100,
      });
      
      for (const block of response.results) {
        if (!('type' in block)) continue;
        
        // Handle image blocks
        if (block.type === 'image') {
          const imageBlock = block as { type: 'image'; image: { type: string; file?: { url: string }; external?: { url: string } } };
          
          if (imageBlock.image.type === 'file' && imageBlock.image.file) {
            const signedUrl = imageBlock.image.file.url;
            const s3Match = signedUrl.match(/https:\/\/prod-files-secure\.s3\.us-west-2\.amazonaws\.com\/[^?]+/);
            if (s3Match) {
              imageMap.set(s3Match[0], signedUrl);
            }
          }
        }
        
        // Check for blocks that can have children
        const blockWithChildren = block as { has_children?: boolean; id: string };
        if (blockWithChildren.has_children) {
          // Rate limit to avoid API throttling
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Recursively get children
          const childImages = await getPageImagesRecursive(block.id, depth + 1);
          for (const [key, value] of childImages) {
            imageMap.set(key, value);
          }
        }
      }
      
      cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
    } while (cursor);
    
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    if (err.code !== 'object_not_found') {
      console.error(`  ⚠️  Error at depth ${depth}:`, err.message || err);
    }
  }
  
  return imageMap;
}

async function findContentFolders(): Promise<ContentFolder[]> {
  const folders: ContentFolder[] = [];
  
  function scanDir(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && entry.name !== 'assets') {
        const metaPath = path.join(fullPath, 'meta.json');
        const mdPath = path.join(fullPath, 'index.md');
        
        if (fs.existsSync(metaPath) && fs.existsSync(mdPath)) {
          const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
          const mdContent = fs.readFileSync(mdPath, 'utf-8');
          
          const images: ImageToDownload[] = [];
          let match;
          const seenUrls = new Set<string>();
          
          while ((match = NOTION_S3_PATTERN.exec(mdContent)) !== null) {
            const altText = match[1];
            const originalUrl = match[2];
            
            const baseUrl = originalUrl.split('?')[0];
            if (seenUrls.has(baseUrl)) continue;
            seenUrls.add(baseUrl);
            
            const filename = extractFilenameFromUrl(originalUrl);
            const ext = getExtensionFromUrl(originalUrl);
            const sanitizedName = sanitizeFilename(filename);
            const finalFilename = sanitizedName.endsWith(ext) ? sanitizedName : `${sanitizedName}${ext}`;
            
            const assetsDir = path.join(fullPath, 'assets');
            const localPath = path.join(assetsDir, finalFilename);
            const relativePath = `./assets/${finalFilename}`;
            
            images.push({
              mdFile: mdPath,
              originalUrl,
              altText,
              localPath,
              relativePath,
              filename: finalFilename,
            });
          }
          
          if (images.length > 0 && meta.id) {
            folders.push({
              path: fullPath,
              notionId: meta.id,
              images,
            });
          }
        }
        
        scanDir(fullPath);
      }
    }
  }
  
  scanDir(CONTENT_DIR);
  return folders;
}

async function main() {
  console.log('🔍 Scanning for content with Notion S3 images...\n');
  
  const folders = await findContentFolders();
  const totalImages = folders.reduce((sum, f) => sum + f.images.length, 0);
  
  console.log(`Found ${totalImages} images in ${folders.length} folders\n`);
  
  if (folders.length === 0) {
    console.log('✅ No Notion S3 images found!');
    return;
  }
  
  let downloaded = 0;
  let failed = 0;
  let skipped = 0;
  
  for (const folder of folders) {
    const relPath = path.relative(CONTENT_DIR, folder.path);
    console.log(`📁 ${relPath} (${folder.images.length} images)`);
    
    // Fetch signed URLs from Notion API (recursively)
    console.log(`  🔐 Fetching signed URLs (with nested blocks)...`);
    const signedUrls = await getPageImagesRecursive(folder.notionId);
    console.log(`  Got ${signedUrls.size} signed URLs`);
    
    let mdContent = fs.readFileSync(folder.images[0].mdFile, 'utf-8');
    let modified = false;
    
    for (const img of folder.images) {
      const assetsDir = path.dirname(img.localPath);
      if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
      }
      
      // Check if already downloaded
      if (fs.existsSync(img.localPath)) {
        const stats = fs.statSync(img.localPath);
        if (stats.size > 0) {
          console.log(`  ⏭️  Exists: ${img.filename}`);
          skipped++;
          mdContent = mdContent.split(img.originalUrl).join(img.relativePath);
          modified = true;
          continue;
        }
      }
      
      // Find signed URL
      const baseUrl = img.originalUrl.split('?')[0];
      const signedUrl = signedUrls.get(baseUrl);
      
      if (!signedUrl) {
        console.log(`  ❌ No signed URL for: ${img.filename}`);
        failed++;
        continue;
      }
      
      console.log(`  ⬇️  Downloading: ${img.filename}`);
      const success = await downloadFile(signedUrl, img.localPath);
      
      if (success) {
        downloaded++;
        mdContent = mdContent.split(img.originalUrl).join(img.relativePath);
        modified = true;
      } else {
        failed++;
      }
    }
    
    if (modified) {
      fs.writeFileSync(folder.images[0].mdFile, mdContent, 'utf-8');
    }
    
    // Rate limit between folders
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Downloaded: ${downloaded}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`❌ Failed: ${failed}`);
  console.log('='.repeat(50));
}

main().catch(console.error);
