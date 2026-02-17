import fs from 'fs';
import path from 'path';

import Link from 'next/link';

import { AnimatedGridItem, AnimatedSection, AnimatedTitle } from '@/components/motion/AnimatedSection';
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
    <section className="py-24 border-t border-border">
      <div className="max-w-4xl mx-auto px-6">
        {/* 헤더 */}
        <div className="flex items-end justify-between mb-12">
          <AnimatedTitle className="font-serif text-2xl md:text-3xl text-foreground italic">
            Blog
          </AnimatedTitle>
          <AnimatedSection delay={0.1}>
            <Link
              href="/blog"
              className="text-sm text-muted-foreground hover:text-accent transition-colors duration-200 flex items-center gap-1 group"
            >
              더 보기
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </AnimatedSection>
        </div>

        {/* 카드 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(({ slug, meta }, index) => (
            <AnimatedGridItem key={slug} index={index}>
              <Link href={`/blog/${slug}`} className="group block h-full">
                <article className="h-full flex flex-col rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 ease-out hover:scale-[1.03] hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/40 hover:border-accent/30">
                  {/* 썸네일 */}
                  {meta.image && (
                    <div className="relative w-full aspect-video overflow-hidden bg-muted">
                      {/* Next.js Image 대신 img 사용 (외부 URL 허용 범위 불확실) */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={meta.image}
                        alt={meta.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}

                  {/* 콘텐츠 */}
                  <div className="flex flex-col flex-1 p-5 gap-3">
                    {/* 태그 */}
                    {meta.tags && meta.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {meta.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs bg-accent/10 text-accent rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* 제목 */}
                    <h3 className="font-heading text-base font-semibold text-foreground line-clamp-2 group-hover:text-accent transition-colors duration-200 leading-snug">
                      {meta.title}
                    </h3>

                    {/* 발췌문 */}
                    {meta.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">
                        {meta.description}
                      </p>
                    )}

                    {/* 날짜 + 읽기 시간 */}
                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
                      {meta.date && (
                        <time className="text-xs text-muted-foreground tabular-nums">
                          {meta.date}
                        </time>
                      )}
                      {meta.readingTime && (
                        <span className="text-xs text-muted-foreground">
                          {meta.readingTime}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            </AnimatedGridItem>
          ))}
        </div>
      </div>
    </section>
  );
}
