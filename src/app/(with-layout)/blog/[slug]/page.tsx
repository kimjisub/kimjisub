import fs from "fs";
import type { MDXProps } from "mdx/types";
import type { Metadata } from "next";
import path from "path";

import BlogPostHeader from "@/components/BlogPostHeader";
import ReadingProgress from "@/components/ui/ReadingProgress";
import TableOfContents from "@/components/TableOfContents";
import type { BlogPostMeta } from "@/types/blog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const { meta } = await import(`@/blog/${slug}/index.mdx`) as { meta: BlogPostMeta };
    
    return {
      title: meta?.title || slug,
      description: meta?.description || `Read about ${slug}`,
      authors: meta?.author ? [{ name: meta.author }] : undefined,
      keywords: meta?.keywords,
      openGraph: {
        title: meta?.title || slug,
        description: meta?.description || `Read about ${slug}`,
        type: 'article',
        publishedTime: meta?.date,
        authors: meta?.author ? [meta.author] : undefined,
        images: meta?.image ? [{ url: meta.image }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: meta?.title || slug,
        description: meta?.description || `Read about ${slug}`,
        images: meta?.image ? [meta.image] : undefined,
      },
    };
  } catch {
    return {
      title: slug,
      description: `Read about ${slug}`,
    };
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { default: MDXContent, meta } = await import(`@/blog/${slug}/index.mdx`) as {
    default: React.ComponentType<MDXProps>;
    meta: BlogPostMeta;
  };

  return (
    <>
      <ReadingProgress />
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="flex gap-12">
        <div className="flex-1 max-w-4xl">
          <BlogPostHeader meta={meta} />
          <article className="prose prose-lg prose-invert max-w-none prose-headings:font-serif prose-headings:font-normal prose-a:text-accent prose-a:no-underline hover:prose-a:underline">
            <MDXContent />
          </article>
        </div>
        <aside className="hidden lg:block w-64 shrink-0">
          <TableOfContents />
        </aside>
      </div>
    </div>
    </>
  );
}

export function generateStaticParams() {
  const postsDir = path.join(process.cwd(), 'src/blog');
  const entries = fs.readdirSync(postsDir, { withFileTypes: true });
  
  return entries
    .filter((entry) => {
      if (!entry.isDirectory()) return false;
      const indexPath = path.join(postsDir, entry.name, 'index.mdx');
      return fs.existsSync(indexPath);
    })
    .map((entry) => ({ slug: entry.name }));
}

export const dynamicParams = false;
