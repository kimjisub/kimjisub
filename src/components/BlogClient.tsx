'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import type { BlogPost } from '@/types/blog';

type SortOption = 'latest' | 'title';

interface BlogClientProps {
  posts: BlogPost[];
}

function useDebounce(value: string, delay: number): string {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function BlogClient({ posts }: BlogClientProps) {
  const [inputValue, setInputValue] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('latest');

  const debouncedSearch = useDebounce(inputValue, 300);

  const clearSearch = useCallback(() => setInputValue(''), []);
  const resetAll = useCallback(() => {
    setInputValue('');
    setSelectedTag(null);
  }, []);

  // Collect all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((p) => p.meta.tags?.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [posts]);

  // Filter & sort
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (p) =>
          p.meta.title.toLowerCase().includes(q) ||
          (p.meta.description?.toLowerCase().includes(q) ?? false) ||
          (p.meta.tags?.some((t) => t.toLowerCase().includes(q)) ?? false)
      );
    }

    if (selectedTag) {
      result = result.filter((p) => p.meta.tags?.includes(selectedTag));
    }

    if (sortOption === 'latest') {
      result.sort((a, b) => {
        if (!a.meta.date) return 1;
        if (!b.meta.date) return -1;
        return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime();
      });
    } else {
      result.sort((a, b) => a.meta.title.localeCompare(b.meta.title, 'ko'));
    }

    return result;
  }, [posts, debouncedSearch, selectedTag, sortOption]);

  const hasActiveFilter = debouncedSearch.trim() || selectedTag;

  return (
    <div>
      {/* ── Search bar ── */}
      <div className="mb-6">
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-background focus-within:border-accent/60 focus-within:ring-2 focus-within:ring-accent/20 transition-all duration-200">
          <svg
            className="w-4 h-4 text-muted-foreground shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="제목, 설명, 태그로 검색..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          {inputValue && (
            <button
              onClick={clearSearch}
              aria-label="검색어 지우기"
              className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-muted hover:bg-muted-foreground/20 transition-colors"
            >
              <svg
                className="w-3 h-3 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* ── Tags + Sort ── */}
      <div className="mb-8 flex flex-wrap items-center gap-3">
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 flex-1">
            <button
              onClick={() => setSelectedTag(null)}
              aria-pressed={!selectedTag}
              className={`px-3 py-1 text-xs rounded-full border transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-none ${
                !selectedTag
                  ? 'bg-accent text-accent-foreground border-accent'
                  : 'bg-background text-muted-foreground border-border hover:border-accent/50 hover:text-foreground'
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                aria-pressed={selectedTag === tag}
                className={`px-3 py-1 text-xs rounded-full border transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-none ${
                  selectedTag === tag
                    ? 'bg-accent text-accent-foreground border-accent'
                    : 'bg-background text-muted-foreground border-border hover:border-accent/50 hover:text-foreground'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Sort */}
        <div className="flex items-center gap-1 ml-auto shrink-0">
          <span className="text-xs text-muted-foreground mr-1">정렬:</span>
          {(
            [
              { value: 'latest', label: '최신순' },
              { value: 'title', label: '제목순' },
            ] as { value: SortOption; label: string }[]
          ).map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setSortOption(value)}
              aria-pressed={sortOption === value}
              className={`px-2.5 py-1 text-xs rounded-lg transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-none ${
                sortOption === value
                  ? 'bg-accent/15 text-accent font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Results count ── */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground">
          {filteredPosts.length}개의 글
          {hasActiveFilter ? ` / 전체 ${posts.length}개` : ''}
        </p>
      </div>

      {/* ── Post list ── */}
      <AnimatePresence mode="popLayout">
        {filteredPosts.length > 0 ? (
          <motion.div key="list" className="space-y-4" layout>
            {filteredPosts.map(({ slug, meta }) => (
              <motion.div
                key={slug}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <Link href={`/blog/${slug}`} className="block group">
                  <article className="rounded-xl card-hover overflow-hidden">
                    {/* Cover Image */}
                    {meta.image && (
                      <div className="relative aspect-[1200/630] overflow-hidden">
                        <Image
                          src={meta.image}
                          alt={meta.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 800px"
                        />
                      </div>
                    )}
                    <div className="p-6">
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
                                role="button"
                                tabIndex={0}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setSelectedTag(selectedTag === tag ? null : tag);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    setSelectedTag(selectedTag === tag ? null : tag);
                                  }
                                }}
                                className={`px-2 py-0.5 text-xs rounded-full cursor-pointer transition-all duration-200 ${
                                  selectedTag === tag
                                    ? 'bg-accent text-accent-foreground'
                                    : 'bg-accent/10 text-accent hover:bg-accent/20'
                                }`}
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
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-16 h-16 mb-6 rounded-full bg-muted flex items-center justify-center">
              <svg
                className="w-7 h-7 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
              검색 결과가 없어요
            </h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs leading-relaxed">
              {debouncedSearch
                ? `"${debouncedSearch}"에 대한 글을 찾지 못했어요.`
                : '선택한 태그의 글이 아직 없어요.'}
              <br />
              다른 검색어나 태그를 시도해 보세요.
            </p>
            <button
              onClick={resetAll}
              className="px-4 py-2 text-sm rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors duration-200"
            >
              전체 글 보기
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
