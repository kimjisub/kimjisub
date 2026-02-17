import fs from 'fs';
import type { Metadata } from 'next';
import path from 'path';

import BlogClient from '@/components/BlogClient';
import type { BlogPostMeta } from '@/types/blog';

export const metadata: Metadata = {
  title: '블로그',
  description: '개발 관련 글과 생각을 공유하는 블로그입니다.',
  openGraph: {
    title: '블로그',
    description: '개발 관련 글과 생각을 공유하는 블로그입니다.',
    type: 'website',
  },
};

export default async function BlogIndex() {
  const postsDir = path.join(process.cwd(), 'src/blog');
  const entries = fs.readdirSync(postsDir, { withFileTypes: true });

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
          };
        } catch {
          return {
            slug,
            meta: { title: slug, date: '', description: '' } as BlogPostMeta,
          };
        }
      })
  );

  // Default sort: newest first
  posts.sort((a, b) => {
    if (!a.meta.date) return 1;
    if (!b.meta.date) return -1;
    return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime();
  });

  return (
    <section className="py-24 px-6 max-w-4xl mx-auto">
      <header className="mb-16">
        <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4 italic">Blog</h1>
        <p className="text-muted-foreground leading-relaxed max-w-xl">가끔 글을 씁니다.</p>
      </header>

      <BlogClient posts={posts} />
    </section>
  );
}
