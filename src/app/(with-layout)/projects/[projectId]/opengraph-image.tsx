import { ImageResponse } from 'next/og';
import { format } from 'date-fns';

import { getProject } from '@/api/notion/project';

// Node.js runtime — needed for Notion API
export const runtime = 'nodejs';
export const revalidate = 3600;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  let title = 'Project';
  let description = '';
  let dateStr = '';
  let tags: string[] = [];
  let categories: string[] = [];

  try {
    const { project } = await getProject(projectId);
    if (project) {
      title = project.title ?? 'Project';
      description = project.description ?? '';
      tags = project.태그.map((t) => t.name).slice(0, 4);
      categories = project.분류.map((c) => c.name).slice(0, 2);
      if (project.date.start) {
        dateStr = format(project.date.start, 'yyyy');
        if (project.date.end) {
          dateStr += ' – ' + format(project.date.end, 'yyyy');
        }
      }
    }
  } catch {
    // use defaults
  }

  const allTags = [...categories, ...tags].slice(0, 5);

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

        {/* Green glow top-left */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            left: '-80px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Purple glow bottom-right */}
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            right: '-60px',
            width: '420px',
            height: '420px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Bottom accent bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '4px',
            background:
              'linear-gradient(90deg, #22c55e 0%, rgba(37,99,235,0.5) 50%, transparent 100%)',
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
            width: '100%',
          }}
        >
          {/* Top: Project label + date */}
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
                background: 'rgba(124,58,237,0.15)',
                border: '1px solid rgba(124,58,237,0.3)',
                fontSize: '14px',
                color: '#a78bfa',
                fontWeight: '600',
                letterSpacing: '0.08em',
                display: 'flex',
              }}
            >
              PROJECT
            </div>
            {dateStr && (
              <span
                style={{
                  fontSize: '15px',
                  color: '#71717a',
                }}
              >
                {dateStr}
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
                  title.length > 50
                    ? '44px'
                    : title.length > 30
                      ? '56px'
                      : '68px',
                fontWeight: '700',
                color: '#fafafa',
                letterSpacing: '-2px',
                lineHeight: '1.05',
                maxWidth: '900px',
              }}
            >
              {title}
            </div>
            {description && (
              <div
                style={{
                  fontSize: '20px',
                  color: '#71717a',
                  maxWidth: '760px',
                  lineHeight: '1.5',
                }}
              >
                {description.length > 100
                  ? description.slice(0, 100) + '…'
                  : description}
              </div>
            )}
          </div>

          {/* Bottom: Tags + site */}
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
                flexWrap: 'wrap',
              }}
            >
              {allTags.map((tag) => (
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
                  {tag}
                </div>
              ))}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#22c55e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#09090b',
                }}
              >
                JK
              </div>
              <span
                style={{
                  fontSize: '15px',
                  color: '#71717a',
                }}
              >
                kimjisub.com
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
