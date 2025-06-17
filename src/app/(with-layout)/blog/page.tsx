import fs from 'fs';
import type { Metadata } from 'next';
import Link from 'next/link';
import path from 'path';

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
          const { meta } = await import(`@/blog/${slug}/index.mdx`) as { meta: BlogPostMeta };
          return {
            slug,
            meta: meta || { title: slug, date: '', description: '' } as BlogPostMeta
          };
        } catch {
          return {
            slug,
            meta: { title: slug, date: '', description: '' } as BlogPostMeta
          };
        }
      })
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">블로그</h1>
      <div className="space-y-6">
        {posts.map(({ slug, meta }) => (
          <article key={slug} className="border-b pb-6">
            <Link href={`/blog/${slug}`} className="block hover:opacity-80 transition-opacity">
              <h2 className="text-xl font-semibold mb-2">{meta.title}</h2>
              {meta.date && (
                <time className="text-sm text-gray-500">{meta.date}</time>
              )}
              {meta.description && (
                <p className="mt-2 text-gray-600">{meta.description}</p>
              )}
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}