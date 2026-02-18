/**
 * Notion → Local Files Migration Script
 * 
 * Usage: npx tsx scripts/migrate-notion.ts
 */

import { Client } from '@notionhq/client';
import { NotionAPI } from 'notion-client';
import * as fs from 'fs';
import * as path from 'path';
import { parseISO, format } from 'date-fns';

// ─── Configuration ───────────────────────────────────────────────────────────

const NOTION_SECRET = process.env.NOTION_SECRET;

if (!NOTION_SECRET) {
  console.error('❌ NOTION_SECRET 환경변수가 필요합니다.');
  process.exit(1);
}

const DATABASE_IDS = {
  projects: '1aef42d566f84045a94303d07ea12e95',
  careers: '89d24d36ad334e62a418d765d6ed4c0b',
  skills: 'f3f9bf321850465d9d193c39e2a06d3e',
};

const OUTPUT_DIR = path.join(process.cwd(), 'src/content');

// ─── Notion Clients ──────────────────────────────────────────────────────────

const notion = new Client({ auth: NOTION_SECRET });
const notionX = new NotionAPI();

// ─── Utilities ───────────────────────────────────────────────────────────────

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function downloadImage(url: string, outputPath: string): Promise<boolean> {
  try {
    if (!url) return false;
    
    const response = await fetch(url);
    if (!response.ok) return false;
    
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    console.log(`  ✓ Downloaded: ${path.basename(outputPath)}`);
    return true;
  } catch (error) {
    console.log(`  ✗ Failed to download: ${url}`);
    return false;
  }
}

function getFileExtension(url: string): string {
  const match = url.match(/\.(png|jpg|jpeg|gif|webp|svg)/i);
  return match ? match[1].toLowerCase() : 'png';
}

// ─── Extract Notion Page Content ─────────────────────────────────────────────

async function extractPageContent(pageId: string): Promise<string> {
  try {
    const recordMap = await notionX.getPage(pageId);
    const blocks = recordMap.block || {};
    
    let content = '';
    
    for (const blockId of Object.keys(blocks)) {
      const block = blocks[blockId]?.value;
      if (!block) continue;
      
      const type = block.type;
      
      if (type === 'text' || type === 'paragraph') {
        const text = block.properties?.title?.map((t: any) => t[0]).join('') || '';
        if (text) content += text + '\n\n';
      } else if (type === 'header' || type === 'sub_header' || type === 'sub_sub_header') {
        const text = block.properties?.title?.map((t: any) => t[0]).join('') || '';
        const level = type === 'header' ? '## ' : type === 'sub_header' ? '### ' : '#### ';
        if (text) content += level + text + '\n\n';
      } else if (type === 'bulleted_list' || type === 'numbered_list') {
        const text = block.properties?.title?.map((t: any) => t[0]).join('') || '';
        const prefix = type === 'bulleted_list' ? '- ' : '1. ';
        if (text) content += prefix + text + '\n';
      } else if (type === 'code') {
        const text = block.properties?.title?.map((t: any) => t[0]).join('') || '';
        const lang = block.properties?.language?.[0]?.[0] || '';
        if (text) content += '```' + lang + '\n' + text + '\n```\n\n';
      } else if (type === 'quote') {
        const text = block.properties?.title?.map((t: any) => t[0]).join('') || '';
        if (text) content += '> ' + text + '\n\n';
      } else if (type === 'callout') {
        const text = block.properties?.title?.map((t: any) => t[0]).join('') || '';
        const emoji = block.format?.page_icon || '💡';
        if (text) content += `> ${emoji} ${text}\n\n`;
      } else if (type === 'divider') {
        content += '---\n\n';
      } else if (type === 'image') {
        const src = block.properties?.source?.[0]?.[0] || block.format?.display_source;
        if (src) content += `![image](${src})\n\n`;
      }
    }
    
    return content.trim();
  } catch (error) {
    console.log(`  ⚠ Could not extract page content for ${pageId}`);
    return '';
  }
}

// ─── Migrate Skills ──────────────────────────────────────────────────────────

async function migrateSkills() {
  console.log('\n📚 Migrating Skills...');
  
  const skillsDir = path.join(OUTPUT_DIR, 'skills');
  ensureDir(skillsDir);
  
  const allResults: any[] = [];
  let nextCursor: string | undefined = undefined;
  
  do {
    const result = await notion.databases.query({
      database_id: DATABASE_IDS.skills,
      start_cursor: nextCursor,
    });
    allResults.push(...result.results);
    nextCursor = result.next_cursor || undefined;
  } while (nextCursor);
  
  console.log(`  Found ${allResults.length} skills`);
  
  const skillsIndex: any[] = [];
  const skillsMap: Record<string, any> = {};
  
  for (const skill of allResults) {
    const props = (skill as any).properties;
    const iconSlugSplit = props['iconSlug']?.rich_text?.[0]?.plain_text?.split('|') || [];
    
    const id = skill.id;
    const title = props['환경 및 기술']?.title?.[0]?.text?.content || 'Untitled';
    const slug = slugify(title) || id;
    
    const data = {
      id,
      slug,
      title,
      iconSlug: iconSlugSplit[0] || null,
      iconColor: iconSlugSplit[1] || null,
      description: props['설명']?.rich_text?.[0]?.plain_text || null,
      category: props['분류']?.multi_select?.map((s: any) => s.name) || [],
      proficiency: props['숙련도']?.select?.name || null,
      visible: props['visible']?.checkbox || false,
      parentSkills: props['상위 항목']?.relation?.map((r: any) => r.id) || [],
      childSkills: props['하위 항목']?.relation?.map((r: any) => r.id) || [],
      relatedSkills: props['관련 기술']?.relation?.map((r: any) => r.id) || [],
      usedInProjects: props['기술로써 사용된 프로젝트']?.relation?.map((r: any) => r.id) || [],
      usedAsLanguage: props['언어로써 사용된 프로젝트']?.relation?.map((r: any) => r.id) || [],
      usageCount: props['사용한 횟수']?.rollup?.number || 0,
      iconUrl: (skill as any).icon?.file?.url || null,
      iconEmoji: (skill as any).icon?.emoji || null,
      coverUrl: (skill as any).cover?.file?.url || null,
    };
    
    skillsIndex.push({
      id: data.id,
      slug: data.slug,
      title: data.title,
      category: data.category,
      proficiency: data.proficiency,
      visible: data.visible,
      usageCount: data.usageCount,
    });
    
    skillsMap[id] = data;
    
    // Create skill directory
    const skillDir = path.join(skillsDir, slug);
    ensureDir(skillDir);
    
    // Save meta.json
    fs.writeFileSync(
      path.join(skillDir, 'meta.json'),
      JSON.stringify(data, null, 2)
    );
    
    // Download icon
    if (data.iconUrl) {
      const ext = getFileExtension(data.iconUrl);
      await downloadImage(data.iconUrl, path.join(skillDir, `icon.${ext}`));
    }
    
    console.log(`  ✓ ${title}`);
  }
  
  // Save index
  fs.writeFileSync(
    path.join(skillsDir, '_index.json'),
    JSON.stringify(skillsIndex, null, 2)
  );
  
  // Save full map for relations
  fs.writeFileSync(
    path.join(skillsDir, '_map.json'),
    JSON.stringify(skillsMap, null, 2)
  );
  
  console.log(`  ✅ Migrated ${allResults.length} skills`);
  return skillsMap;
}

// ─── Migrate Careers ─────────────────────────────────────────────────────────

async function migrateCareers(skillsMap: Record<string, any>) {
  console.log('\n💼 Migrating Careers...');
  
  const careersDir = path.join(OUTPUT_DIR, 'careers');
  ensureDir(careersDir);
  
  const allResults: any[] = [];
  let nextCursor: string | undefined = undefined;
  
  do {
    const result = await notion.databases.query({
      database_id: DATABASE_IDS.careers,
      start_cursor: nextCursor,
      sorts: [{ property: '날짜', direction: 'descending' }],
    });
    allResults.push(...result.results);
    nextCursor = result.next_cursor || undefined;
  } while (nextCursor);
  
  console.log(`  Found ${allResults.length} careers`);
  
  const careersIndex: any[] = [];
  const careersMap: Record<string, any> = {};
  
  for (const career of allResults) {
    const props = (career as any).properties;
    
    const id = career.id;
    const title = props['이름']?.title?.[0]?.text?.content || 'Untitled';
    const slug = slugify(title) || id;
    
    const dateStart = props['날짜']?.date?.start;
    const dateEnd = props['날짜']?.date?.end;
    
    const data = {
      id,
      slug,
      title,
      description: props['설명']?.rich_text?.[0]?.plain_text || null,
      date: {
        start: dateStart || null,
        end: dateEnd || null,
      },
      institutions: props['기관']?.multi_select?.map((s: any) => ({ name: s.name, color: s.color })) || [],
      categories: props['분류']?.multi_select?.map((s: any) => ({ name: s.name, color: s.color })) || [],
      assignedTasks: props['맡은 업무']?.multi_select?.map((s: any) => ({ name: s.name, color: s.color })) || [],
      importance: props['중요도']?.select?.name || null,
      url: props['URL']?.url || null,
      awardsAndCertifications: props['수상 및 수료']?.rich_text?.[0]?.plain_text || null,
      relatedProjects: props['관련된 프로젝트']?.relation?.map((r: any) => r.id) || [],
      iconUrl: (career as any).icon?.file?.url || null,
      iconEmoji: (career as any).icon?.emoji || null,
      coverUrl: (career as any).cover?.file?.url || null,
    };
    
    careersIndex.push({
      id: data.id,
      slug: data.slug,
      title: data.title,
      description: data.description,
      date: data.date,
      categories: data.categories.map((c: any) => c.name),
      importance: data.importance,
    });
    
    careersMap[id] = data;
    
    // Create career directory
    const careerDir = path.join(careersDir, slug);
    ensureDir(careerDir);
    
    // Save meta.json
    fs.writeFileSync(
      path.join(careerDir, 'meta.json'),
      JSON.stringify(data, null, 2)
    );
    
    // Download images
    if (data.coverUrl) {
      const ext = getFileExtension(data.coverUrl);
      await downloadImage(data.coverUrl, path.join(careerDir, `cover.${ext}`));
    }
    if (data.iconUrl) {
      const ext = getFileExtension(data.iconUrl);
      await downloadImage(data.iconUrl, path.join(careerDir, `icon.${ext}`));
    }
    
    // Extract page content
    const content = await extractPageContent(id);
    if (content) {
      const dateStr = data.date.start ? format(parseISO(data.date.start), 'yyyy-MM') : '';
      const mdContent = `---
title: "${data.title}"
date: "${dateStr}"
---

# ${data.title}

${data.description || ''}

${content}
`;
      fs.writeFileSync(path.join(careerDir, 'index.md'), mdContent);
    }
    
    console.log(`  ✓ ${title}`);
  }
  
  // Save index
  fs.writeFileSync(
    path.join(careersDir, '_index.json'),
    JSON.stringify(careersIndex, null, 2)
  );
  
  fs.writeFileSync(
    path.join(careersDir, '_map.json'),
    JSON.stringify(careersMap, null, 2)
  );
  
  console.log(`  ✅ Migrated ${allResults.length} careers`);
  return careersMap;
}

// ─── Migrate Projects ────────────────────────────────────────────────────────

async function migrateProjects(skillsMap: Record<string, any>, careersMap: Record<string, any>) {
  console.log('\n🚀 Migrating Projects...');
  
  const projectsDir = path.join(OUTPUT_DIR, 'projects');
  ensureDir(projectsDir);
  
  const allResults: any[] = [];
  let nextCursor: string | undefined = undefined;
  
  do {
    const result = await notion.databases.query({
      database_id: DATABASE_IDS.projects,
      start_cursor: nextCursor,
      sorts: [{ property: '중요도', direction: 'ascending' }],
    });
    allResults.push(...result.results);
    nextCursor = result.next_cursor || undefined;
  } while (nextCursor);
  
  console.log(`  Found ${allResults.length} projects`);
  
  const projectsIndex: any[] = [];
  
  for (const project of allResults) {
    const props = (project as any).properties;
    
    const id = project.id;
    const title = props['이름']?.title?.[0]?.text?.content || 'Untitled';
    const slug = slugify(title) || id;
    
    const dateStart = props['날짜']?.date?.start;
    const dateEnd = props['날짜']?.date?.end;
    
    const techSkillIds = props['주요 기술']?.relation?.map((r: any) => r.id) || [];
    const langSkillIds = props['프로그래밍 언어']?.relation?.map((r: any) => r.id) || [];
    const careerIds = props['대회 및 수료']?.relation?.map((r: any) => r.id) || [];
    
    const data = {
      id,
      slug,
      title,
      description: props['설명']?.rich_text?.[0]?.plain_text || null,
      date: {
        start: dateStart || null,
        end: dateEnd || null,
      },
      github: props['Github']?.url || null,
      youtube: props['Youtube']?.url || null,
      url: props['URL']?.url || null,
      importance: props['중요도']?.select?.name || null,
      tags: props['태그']?.multi_select?.map((s: any) => ({ name: s.name, color: s.color })) || [],
      categories: props['분류']?.multi_select?.map((s: any) => ({ name: s.name, color: s.color })) || [],
      assignedTasks: props['맡은 업무']?.multi_select?.map((s: any) => ({ name: s.name, color: s.color })) || [],
      techSkills: techSkillIds.map((id: string) => skillsMap[id]?.slug || id),
      languages: langSkillIds.map((id: string) => skillsMap[id]?.slug || id),
      relatedCareers: careerIds.map((id: string) => careersMap[id]?.slug || id),
      iconUrl: (project as any).icon?.file?.url || null,
      iconEmoji: (project as any).icon?.emoji || null,
      coverUrl: (project as any).cover?.file?.url || null,
    };
    
    projectsIndex.push({
      id: data.id,
      slug: data.slug,
      title: data.title,
      description: data.description,
      date: data.date,
      categories: data.categories.map((c: any) => c.name),
      tags: data.tags.map((t: any) => t.name),
      importance: data.importance,
      github: data.github,
      url: data.url,
    });
    
    // Create project directory
    const projectDir = path.join(projectsDir, slug);
    ensureDir(projectDir);
    
    // Save meta.json
    fs.writeFileSync(
      path.join(projectDir, 'meta.json'),
      JSON.stringify(data, null, 2)
    );
    
    // Download images
    if (data.coverUrl) {
      const ext = getFileExtension(data.coverUrl);
      await downloadImage(data.coverUrl, path.join(projectDir, `cover.${ext}`));
    }
    if (data.iconUrl) {
      const ext = getFileExtension(data.iconUrl);
      await downloadImage(data.iconUrl, path.join(projectDir, `icon.${ext}`));
    }
    
    // Extract page content
    const content = await extractPageContent(id);
    if (content) {
      const dateStr = data.date.start ? format(parseISO(data.date.start), 'yyyy-MM') : '';
      const mdContent = `---
title: "${data.title}"
date: "${dateStr}"
github: "${data.github || ''}"
url: "${data.url || ''}"
---

# ${data.title}

${data.description || ''}

${content}
`;
      fs.writeFileSync(path.join(projectDir, 'index.md'), mdContent);
    }
    
    console.log(`  ✓ ${title}`);
  }
  
  // Save index
  fs.writeFileSync(
    path.join(projectsDir, '_index.json'),
    JSON.stringify(projectsIndex, null, 2)
  );
  
  console.log(`  ✅ Migrated ${allResults.length} projects`);
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 Starting Notion Migration...\n');
  console.log(`Output directory: ${OUTPUT_DIR}`);
  
  ensureDir(OUTPUT_DIR);
  
  try {
    const skillsMap = await migrateSkills();
    const careersMap = await migrateCareers(skillsMap);
    await migrateProjects(skillsMap, careersMap);
    
    console.log('\n✅ Migration complete!');
    console.log(`\nFiles saved to: ${OUTPUT_DIR}`);
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

main();
