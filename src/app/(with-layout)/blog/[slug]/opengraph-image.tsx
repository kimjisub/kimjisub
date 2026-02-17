import { ImageResponse } from 'next/og';
import type { BlogPostMeta } from '@/types/blog';

// Node.js runtime — needed for dynamic MDX import
export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let meta: BlogPostMeta = {
    title: slug,
    date: new Date().toISOString(),
    description: '',
  };

  try {
    const mod = (await import(`@/blog/${slug}/index.mdx`)) as {
      meta: BlogPostMeta;
    };
    if (mod.meta) meta = mod.meta;
  } catch {
    // use slug-based defaults
  }

  const formattedDate = meta.date
    ? new Date(meta.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const tags = meta.tags?.slice(0, 4) ?? [];

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#09090b',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grid overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            display: 'flex',
          }}
        />

        {/* Green accent glow */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-60px',
            width: '480px',
            height: '480px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Left accent bar */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '5px',
            height: '100%',
            background:
              'linear-gradient(180deg, #22c55e 0%, rgba(34,197,94,0.2) 100%)',
            display: 'flex',
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '64px 80px',
            paddingLeft: '92px',
            width: '100%',
          }}
        >
          {/* Top: Blog label + date */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                padding: '5px 14px',
                borderRadius: '6px',
                background: 'rgba(34,197,94,0.15)',
                border: '1px solid rgba(34,197,94,0.3)',
                fontSize: '14px',
                color: '#22c55e',
                fontWeight: '600',
                letterSpacing: '0.08em',
                display: 'flex',
              }}
            >
              BLOG
            </div>
            {formattedDate && (
              <span
                style={{
                  fontSize: '15px',
                  color: '#71717a',
                }}
              >
                {formattedDate}
              </span>
            )}
          </div>

          {/* Center: Title + description */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                fontSize:
                  meta.title.length > 50
                    ? '44px'
                    : meta.title.length > 30
                      ? '56px'
                      : '64px',
                fontWeight: '700',
                color: '#fafafa',
                letterSpacing: '-1.5px',
                lineHeight: '1.1',
                maxWidth: '960px',
              }}
            >
              {meta.title}
            </div>
            {meta.description && (
              <div
                style={{
                  fontSize: '20px',
                  color: '#71717a',
                  maxWidth: '800px',
                  lineHeight: '1.5',
                }}
              >
                {meta.description.length > 120
                  ? meta.description.slice(0, 120) + '…'
                  : meta.description}
              </div>
            )}
          </div>

          {/* Bottom: Tags + author */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '10px',
              }}
            >
              {tags.map((tag) => (
                <div
                  key={tag}
                  style={{
                    padding: '5px 14px',
                    borderRadius: '9999px',
                    border: '1px solid #27272a',
                    background: 'rgba(39,39,42,0.6)',
                    fontSize: '14px',
                    color: '#a1a1aa',
                    display: 'flex',
                  }}
                >
                  #{tag}
                </div>
              ))}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '9999px',
                  background: '#22c55e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#09090b',
                }}
              >
                JK
              </div>
              <span
                style={{
                  fontSize: '16px',
                  color: '#a1a1aa',
                }}
              >
                {meta.author ?? 'Jisub Kim'}
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
