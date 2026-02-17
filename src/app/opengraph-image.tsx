import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Jisub Kim | CTO & Product Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
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
        {/* Grid pattern overlay */}
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
            top: '-120px',
            left: '-80px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34,197,94,0.18) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Blue glow bottom-right */}
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            right: '-80px',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)',
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
            padding: '72px 80px',
            width: '100%',
          }}
        >
          {/* Top: Monogram */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#22c55e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                fontWeight: '700',
                color: '#09090b',
                letterSpacing: '-0.5px',
              }}
            >
              JK
            </div>
            <span
              style={{
                fontSize: '18px',
                color: '#a1a1aa',
                letterSpacing: '0.05em',
              }}
            >
              kimjisub.com
            </span>
          </div>

          {/* Center: Name + Title */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <div
              style={{
                fontSize: '80px',
                fontWeight: '700',
                color: '#fafafa',
                letterSpacing: '-3px',
                lineHeight: '1',
              }}
            >
              Jisub Kim
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
                  width: '40px',
                  height: '2px',
                  background: '#22c55e',
                  display: 'flex',
                }}
              />
              <span
                style={{
                  fontSize: '26px',
                  color: '#22c55e',
                  fontWeight: '500',
                  letterSpacing: '0.02em',
                }}
              >
                CTO &amp; Product Engineer
              </span>
            </div>
            <div
              style={{
                fontSize: '20px',
                color: '#71717a',
                maxWidth: '680px',
                lineHeight: '1.5',
              }}
            >
              Building software, firmware, and infrastructure. CTO at Alpaon.
            </div>
          </div>

          {/* Bottom: Tags */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
            }}
          >
            {['Next.js', 'TypeScript', 'React', 'Go', 'Embedded'].map((tag) => (
              <div
                key={tag}
                style={{
                  padding: '6px 16px',
                  borderRadius: '9999px',
                  border: '1px solid #27272a',
                  background: 'rgba(39,39,42,0.6)',
                  fontSize: '15px',
                  color: '#a1a1aa',
                  display: 'flex',
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
