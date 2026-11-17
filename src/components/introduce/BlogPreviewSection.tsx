import fs from 'fs';
import Link from 'next/link';
import path from 'path';

import { Section } from '@/components/introduce/Section';
import type { BlogPostMeta } from '@/types/blog';

async function getLatestPosts(count = 3) {
  const postsDir = path.join(process.cwd(), 'src/blog');

  if (!fs.existsSync(postsDir)) return [];

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

  return posts
    .filter((p) => p.meta.published !== false)
    .sort((a, b) => {
      if (!a.meta.date) return 1;
      if (!b.meta.date) return -1;
      return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime();
    })
    .slice(0, count);
}

export default async function BlogPreviewSection() {
  const posts = await getLatestPosts(3);

  if (posts.length === 0) return null;

  return (
    <Section
      id="blog"
      title="Blog"
      action={
        <Link href="/blog" className="link text-muted-foreground">
          전체 글
        </Link>
      }
    >
      <ul className="divide-y divide-border border-y border-border">
        {posts.map(({ slug, meta }) => (
          <li key={slug}>
            <Link href={`/blog/${slug}`} className="group grid gap-x-6 gap-y-1 py-5 sm:grid-cols-[5.5rem_minmax(0,1fr)]">
              {meta.date && (
                <time dateTime={meta.date} className="text-sm tabular-nums text-muted-foreground sm:pt-0.5">
                  {meta.date.slice(0, 7).replace('-', '.')}
                </time>
              )}
              <div className="min-w-0">
                <h3 className="font-medium leading-snug text-foreground underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-150 group-hover:decoration-border-strong">
                  {meta.title}
                </h3>
                {meta.description && (
                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {meta.description}
                  </p>
                )}
                {(meta.tags?.length || meta.readingTime) && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {[...(meta.tags ?? []).slice(0, 2).map((tag) => `#${tag}`), meta.readingTime].filter(Boolean).join(' · ')}
                  </p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
