'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface UseItem {
  name: string;
  description?: string;
  icon: string;
  link?: string;
}

interface UseCategory {
  title: string;
  subtitle: string;
  emoji: string;
  items: UseItem[];
}

const categories: UseCategory[] = [
  {
    title: '개발 환경',
    subtitle: 'Development Environment',
    emoji: '🖥️',
    items: [
      {
        name: 'Cursor',
        description: 'AI 페어프로그래밍 기본 에디터',
        icon: '✦',
        link: 'https://cursor.sh',
      },
      {
        name: 'VS Code',
        description: '범용 코드 에디터',
        icon: '◈',
        link: 'https://code.visualstudio.com',
      },
      {
        name: 'Zed',
        description: '빠르고 가벼운 Rust 기반 에디터',
        icon: '⬡',
        link: 'https://zed.dev',
      },
      {
        name: 'iTerm2',
        description: 'macOS 터미널',
        icon: '>_',
        link: 'https://iterm2.com',
      },
      {
        name: 'Claude Code',
        description: 'Anthropic AI 코딩 CLI',
        icon: '◆',
        link: 'https://docs.anthropic.com/claude-code',
      },
    ],
  },
  {
    title: '언어 / 프레임워크',
    subtitle: 'Languages & Frameworks',
    emoji: '⚡',
    items: [
      {
        name: 'TypeScript',
        description: '타입 안전한 JavaScript',
        icon: 'TS',
        link: 'https://www.typescriptlang.org',
      },
      {
        name: 'React',
        description: 'UI 컴포넌트 라이브러리',
        icon: '⚛',
        link: 'https://react.dev',
      },
      {
        name: 'Next.js',
        description: 'React 풀스택 프레임워크',
        icon: '▲',
        link: 'https://nextjs.org',
      },
      {
        name: 'Python',
        description: 'AI/ML, 스크립트, 백엔드',
        icon: '🐍',
        link: 'https://www.python.org',
      },
    ],
  },
  {
    title: '인프라',
    subtitle: 'Infrastructure',
    emoji: '🏗️',
    items: [
      {
        name: 'Docker',
        description: '컨테이너 기반 개발 환경',
        icon: '🐳',
        link: 'https://www.docker.com',
      },
      {
        name: 'Kubernetes',
        description: '컨테이너 오케스트레이션',
        icon: '☸',
        link: 'https://kubernetes.io',
      },
      {
        name: 'Tailscale',
        description: 'Zero-config VPN 메시 네트워크',
        icon: '🔒',
        link: 'https://tailscale.com',
      },
      {
        name: 'PM2',
        description: 'Node.js 프로세스 매니저',
        icon: '⚙',
        link: 'https://pm2.keymetrics.io',
      },
    ],
  },
  {
    title: '하드웨어',
    subtitle: 'Hardware',
    emoji: '🖱️',
    items: [
      {
        name: 'MacBook Pro M3 Pro',
        description: '메인 개발 머신. 빠르고 조용하다.',
        icon: '💻',
      },
      {
        name: 'Ubuntu Desktop',
        description: 'RTX 5090으로 로컬 LLM 서빙 전용',
        icon: '🖥️',
      },
    ],
  },
  {
    title: '서비스',
    subtitle: 'Services',
    emoji: '☁️',
    items: [
      {
        name: 'GitHub',
        description: '소스 코드 호스팅 & 협업',
        icon: '🐙',
        link: 'https://github.com/kimjisub',
      },
      {
        name: 'Vercel',
        description: '프론트엔드 배포 & 호스팅',
        icon: '▲',
        link: 'https://vercel.com',
      },
      {
        name: 'Cloudflare',
        description: 'DNS, CDN, 터널링',
        icon: '🌩',
        link: 'https://cloudflare.com',
      },
      {
        name: 'Notion',
        description: '노트, 데이터베이스, CMS',
        icon: '📝',
        link: 'https://notion.so',
      },
    ],
  },
];

// ─── sub-components ──────────────────────────────────────────────────────────

function ItemCard({ item, index }: { item: UseItem; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  const inner = (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{
        duration: 0.4,
        delay: Math.min(index * 0.06, 0.36),
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors duration-200 cursor-default"
    >
      {/* Icon badge */}
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-base font-mono font-bold text-foreground group-hover:bg-accent/10 group-hover:text-accent transition-colors duration-200">
        {item.icon}
      </div>

      {/* Text */}
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-foreground">{item.name}</span>
          {item.link && (
            <svg
              className="w-3 h-3 text-muted-foreground/50 group-hover:text-accent transition-colors duration-200"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          )}
        </div>
        {item.description && (
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            {item.description}
          </p>
        )}
      </div>
    </motion.div>
  );

  if (item.link) {
    return (
      <a href={item.link} target="_blank" rel="noopener noreferrer" className="block">
        {inner}
      </a>
    );
  }
  return inner;
}

function CategorySection({
  category,
  categoryIndex,
}: {
  category: UseCategory;
  categoryIndex: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{
        duration: 0.5,
        delay: categoryIndex * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="mb-14"
    >
      {/* Category header */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl" role="img" aria-label={category.title}>
          {category.emoji}
        </span>
        <div>
          <h2 className="text-base font-bold text-foreground">{category.title}</h2>
          <p className="text-xs text-muted-foreground">{category.subtitle}</p>
        </div>
      </div>

      {/* Item grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {category.items.map((item, i) => (
          <ItemCard key={item.name} item={item} index={i} />
        ))}
      </div>
    </motion.section>
  );
}

// ─── page ────────────────────────────────────────────────────────────────────

export default function UsesPage() {
  return (
    <section className="py-24 px-6 max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-16">
        <motion.h1
          className="font-serif text-3xl md:text-4xl text-foreground mb-4 italic"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Uses
        </motion.h1>
        <motion.p
          className="text-muted-foreground leading-relaxed max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          평소에 즐겨 쓰는 도구와 장비들입니다.{' '}
          <a
            href="https://uses.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            uses.tech
          </a>{' '}
          에서 영감을 받았습니다.
        </motion.p>
      </header>

      {/* Categories */}
      <div>
        {categories.map((cat, i) => (
          <CategorySection key={cat.title} category={cat} categoryIndex={i} />
        ))}
      </div>
    </section>
  );
}
