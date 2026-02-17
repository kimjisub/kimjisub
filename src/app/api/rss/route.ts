import fs from 'fs';
import path from 'path';

import type { BlogPostMeta } from '@/types/blog';

export const dynamic = 'force-static';

const siteUrl = 'https://kimjisub.com';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const postsDir = path.join(process.cwd(), 'src/blog');

  let entries: fs.Dirent[] = [];
  try {
    entries = fs.readdirSync(postsDir, { withFileTypes: true });
  } catch {
    entries = [];
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
            meta: meta ?? ({ title: slug, date: '', description: '' } as BlogPostMeta),
          };
        } catch {
          return {
            slug,
            meta: { title: slug, date: '', description: '' } as BlogPostMeta,
          };
        }
      }),
  );

  // Sort newest first, show only published posts
  posts.sort((a, b) => {
    if (!a.meta.date) return 1;
    if (!b.meta.date) return -1;
    return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime();
  });

  const publishedPosts = posts.filter((p) => p.meta.published !== false);

  const rssItems = publishedPosts
    .map((post) => {
      const url = `${siteUrl}/blog/${post.slug}`;
      const pubDate = post.meta.date
        ? new Date(post.meta.date).toUTCString()
        : '';
      const title = escapeXml(post.meta.title);
      const description = escapeXml(post.meta.description ?? '');
      const tags = [...(post.meta.tags ?? []), ...(post.meta.keywords ?? [])];
      const uniqueTags = Array.from(new Set(tags));
      const categories = uniqueTags
        .map((tag) => `      <category>${escapeXml(tag)}</category>`)
        .join('\n');

      return [
        '    <item>',
        `      <title>${title}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <description>${description}</description>`,
        pubDate ? `      <pubDate>${pubDate}</pubDate>` : '',
        post.meta.author ? `      <author>${escapeXml(post.meta.author)}</author>` : '',
        categories,
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');

  const lastBuildDate = new Date().toUTCString();

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Jisub Kim | Blog</title>
    <link>${siteUrl}/blog</link>
    <description>개발 관련 글과 생각을 공유하는 블로그입니다.</description>
    <language>ko-KR</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${siteUrl}/api/rss" rel="self" type="application/rss+xml"/>
    <image>
      <url>${siteUrl}/logo512.png</url>
      <title>Jisub Kim | Blog</title>
      <link>${siteUrl}/blog</link>
    </image>
${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
