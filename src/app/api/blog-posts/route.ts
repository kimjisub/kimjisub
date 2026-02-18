import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

import type { BlogPost, BlogPostMeta } from '@/types/blog';

export const dynamic = 'force-static';

export async function GET() {
  const postsDir = path.join(process.cwd(), 'src/blog');

  let entries: fs.Dirent[] = [];
  try {
    entries = fs.readdirSync(postsDir, { withFileTypes: true });
  } catch {
    return NextResponse.json([]);
  }

  const posts = await Promise.all(
    entries
      .filter((entry) => {
        if (!entry.isDirectory()) return false;
        const indexPath = path.join(postsDir, entry.name, 'index.mdx');
        return fs.existsSync(indexPath);
      })
      .map(async (entry) => {
        const slug = entry.name;
        try {
          const { meta } = (await import(`@/blog/${slug}/index.mdx`)) as {
            meta: BlogPostMeta;
          };
          return {
            slug,
            meta: meta || ({ title: slug, date: '', description: '' } as BlogPostMeta),
          } as BlogPost;
        } catch {
          return {
            slug,
            meta: { title: slug, date: '', description: '' } as BlogPostMeta,
          } as BlogPost;
        }
      }),
  );

  // Sort newest first, return top 5
  posts.sort((a, b) => {
    if (!a.meta.date) return 1;
    if (!b.meta.date) return -1;
    return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime();
  });

  const recent = posts.filter((p) => p.meta.published !== false).slice(0, 5);

  return NextResponse.json(recent);
}
