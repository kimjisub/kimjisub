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

  // Sort by date (newest first)
  posts.sort((a, b) => {
    if (!a.meta.date) return 1;
    if (!b.meta.date) return -1;
    return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime();
  });

  return (
    <section className="py-24 px-6 max-w-4xl mx-auto">
      <header className="mb-16">
        <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4 italic">
          Blog
        </h1>
        <p className="text-muted-foreground leading-relaxed max-w-xl">
          가끔 글을 씁니다.
        </p>
      </header>
      
      <div className="space-y-4">
        {posts.map(({ slug, meta }, index) => (
          <Link 
            key={slug} 
            href={`/blog/${slug}`} 
            className="block group"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <article className="p-6 rounded-xl card-hover">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="font-heading text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors duration-300">
                    {meta.title}
                  </h2>
                  {meta.description && (
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                      {meta.description}
                    </p>
                  )}
                  {meta.tags && meta.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {meta.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs bg-accent/10 text-accent rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {meta.date && (
                  <time className="text-sm text-muted-foreground whitespace-nowrap">
                    {meta.date}
                  </time>
                )}
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
