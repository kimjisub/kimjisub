'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

import type { BlogPost } from '@/types/blog';

// ─── Icons ────────────────────────────────────────────────────────────────────

function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function ProjectsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function SkillsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function CareersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  );
}

function BlogIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  );
}

function UsesIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="8" x="5" y="2" rx="2" />
      <rect width="20" height="8" x="2" y="14" rx="2" />
      <line x1="6" x2="6.01" y1="6" y2="6" />
      <line x1="6" x2="6.01" y1="18" y2="18" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 23.2 24 22.222 24H.003z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" x2="21" y1="14" y2="3" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-muted-foreground flex-shrink-0"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

type ItemKind = 'navigate' | 'external' | 'action';

interface CommandItem {
  id: string;
  label: string;
  group: string;
  icon: React.ReactNode;
  kind: ItemKind;
  href?: string;
  action?: () => void;
  keywords?: string[];
  description?: string;
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const isDark = resolvedTheme === 'dark';

  // Fetch recent blog posts when palette opens
  useEffect(() => {
    if (!open) return;
    fetch('/api/blog-posts')
      .then((r) => r.json())
      .then((data: BlogPost[]) => setRecentPosts(data))
      .catch(() => setRecentPosts([]));
  }, [open]);

  const items: CommandItem[] = [
    // ── Pages ──────────────────────────────────────────────────────────────
    {
      id: 'home',
      label: 'Home',
      group: 'Pages',
      icon: <HomeIcon />,
      kind: 'navigate',
      href: '/',
      keywords: ['home', 'main', '홈', '메인'],
    },
    {
      id: 'projects',
      label: 'Projects',
      group: 'Pages',
      icon: <ProjectsIcon />,
      kind: 'navigate',
      href: '/projects',
      keywords: ['project', '프로젝트', 'work'],
    },
    {
      id: 'skills',
      label: 'Skills',
      group: 'Pages',
      icon: <SkillsIcon />,
      kind: 'navigate',
      href: '/skills',
      keywords: ['skill', '기술', '스킬', 'tech', 'stack'],
    },
    {
      id: 'careers',
      label: 'Careers',
      group: 'Pages',
      icon: <CareersIcon />,
      kind: 'navigate',
      href: '/careers',
      keywords: ['career', 'job', '커리어', '경력', 'experience', 'work'],
    },
    {
      id: 'blog',
      label: 'Blog',
      group: 'Pages',
      icon: <BlogIcon />,
      kind: 'navigate',
      href: '/blog',
      keywords: ['blog', '블로그', 'post', '글', 'article'],
    },
    {
      id: 'uses',
      label: 'Uses',
      group: 'Pages',
      icon: <UsesIcon />,
      kind: 'navigate',
      href: '/uses',
      keywords: ['uses', '사용', '도구', 'tool', 'setup', 'gear', 'equipment'],
    },

    // ── Recent Blog Posts ───────────────────────────────────────────────────
    ...recentPosts.map((post) => ({
      id: `blog-${post.slug}`,
      label: post.meta.title,
      group: 'Recent Posts',
      icon: <BlogIcon />,
      kind: 'navigate' as ItemKind,
      href: `/blog/${post.slug}`,
      description: post.meta.date,
      keywords: [
        ...(post.meta.tags ?? []),
        ...(post.meta.keywords ?? []),
        post.meta.category ?? '',
        'blog',
        '블로그',
      ].filter(Boolean),
    })),

    // ── Links ───────────────────────────────────────────────────────────────
    {
      id: 'github',
      label: 'GitHub',
      group: 'Links',
      icon: <GithubIcon />,
      kind: 'external',
      href: 'https://github.com/kimjisub',
      keywords: ['github', 'git', 'code', 'repo', 'repository'],
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      group: 'Links',
      icon: <LinkedinIcon />,
      kind: 'external',
      href: 'https://linkedin.com/in/kimjisub',
      keywords: ['linkedin', 'sns', 'social', 'connect'],
    },

    // ── Actions ─────────────────────────────────────────────────────────────
    {
      id: 'theme',
      label: isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      group: 'Actions',
      icon: isDark ? <SunIcon /> : <MoonIcon />,
      kind: 'action',
      action: () => setTheme(isDark ? 'light' : 'dark'),
      keywords: ['theme', 'dark', 'light', '다크', '라이트', '테마', 'mode', 'toggle'],
    },
  ];

  // Filter by query
  const filtered = query.trim()
    ? items.filter((item) => {
        const q = query.toLowerCase();
        return (
          item.label.toLowerCase().includes(q) ||
          item.group.toLowerCase().includes(q) ||
          item.keywords?.some((k) => k.toLowerCase().includes(q))
        );
      })
    : items;

  // Group filtered items
  const groups = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  // Clamp activeIndex when list changes
  useEffect(() => {
    setActiveIndex((prev) => Math.min(prev, Math.max(filtered.length - 1, 0)));
  }, [filtered.length]);

  // Reset on open
  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const runItem = useCallback(
    (item: CommandItem) => {
      onClose();
      if (item.kind === 'navigate' && item.href) {
        router.push(item.href);
      } else if (item.kind === 'external' && item.href) {
        window.open(item.href, '_blank', 'noopener,noreferrer');
      } else if (item.kind === 'action' && item.action) {
        item.action();
      }
    },
    [onClose, router],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % Math.max(filtered.length, 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const item = filtered[activeIndex];
        if (item) runItem(item);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    },
    [filtered, activeIndex, runItem, onClose],
  );

  // Scroll active item into view
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const active = list.querySelector<HTMLElement>('[data-active="true"]');
    active?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cp-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="cp-panel"
            initial={{ opacity: 0, scale: 0.96, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -16 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-[18vh] z-[101] mx-auto w-full max-w-lg px-4"
            role="dialog"
            aria-modal="true"
            aria-label="Command Palette"
          >
            <div
              className="rounded-xl border border-border bg-background/95 shadow-2xl overflow-hidden"
              style={{
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <SearchIcon />

                <input
                  ref={inputRef}
                  type="text"
                  role="combobox"
                  aria-expanded={filtered.length > 0}
                  aria-haspopup="listbox"
                  aria-controls="cmd-palette-listbox"
                  aria-autocomplete="list"
                  aria-label="페이지, 액션 검색"
                  placeholder="Search pages, actions..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                />

                <kbd className="hidden sm:inline-flex items-center rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground font-mono">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <ul
                ref={listRef}
                id="cmd-palette-listbox"
                className="max-h-[22rem] overflow-y-auto py-2"
                role="listbox"
                aria-label="검색 결과"
              >
                {filtered.length === 0 ? (
                  <li className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No results for &ldquo;{query}&rdquo;
                  </li>
                ) : (
                  Object.entries(groups).map(([groupName, groupItems]) => (
                    <li key={groupName} role="presentation">
                      {/* Group label */}
                      <span className="block px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60" aria-hidden="true">
                        {groupName}
                      </span>

                      {groupItems.map((item) => {
                        const globalIndex = filtered.indexOf(item);
                        const isActive = globalIndex === activeIndex;

                        return (
                          <button
                            key={item.id}
                            role="option"
                            aria-selected={isActive}
                            data-active={isActive}
                            onClick={() => runItem(item)}
                            onMouseEnter={() => setActiveIndex(globalIndex)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors duration-75 ${
                              isActive
                                ? 'bg-muted text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {/* Icon */}
                            <span
                              className={`flex-shrink-0 transition-colors ${
                                isActive ? 'text-foreground' : 'text-muted-foreground'
                              }`}
                            >
                              {item.icon}
                            </span>

                            {/* Label + description */}
                            <span className="flex-1 min-w-0">
                              <span className="block font-medium truncate">{item.label}</span>
                              {item.description && (
                                <span className="block text-[11px] text-muted-foreground/60 truncate mt-0.5">
                                  {item.description}
                                </span>
                              )}
                            </span>

                            {/* External link indicator */}
                            {item.kind === 'external' && <ExternalLinkIcon />}

                            {/* Enter hint when active */}
                            {isActive && (
                              <kbd className="hidden sm:inline-flex items-center rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground font-mono flex-shrink-0">
                                ↵
                              </kbd>
                            )}
                          </button>
                        );
                      })}
                    </li>
                  ))
                )}
              </ul>

              {/* Footer */}
              <div className="border-t border-border px-4 py-2 flex items-center gap-4 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-border px-1 py-0.5 font-mono">↑</kbd>
                  <kbd className="rounded border border-border px-1 py-0.5 font-mono">↓</kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-border px-1 py-0.5 font-mono">↵</kbd>
                  select
                </span>
                <span className="ml-auto flex items-center gap-1 opacity-60">
                  <kbd className="rounded border border-border px-1 py-0.5 font-mono">⌘K</kbd>
                  toggle
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    open,
    setOpen,
    onClose: () => setOpen(false),
  };
}
