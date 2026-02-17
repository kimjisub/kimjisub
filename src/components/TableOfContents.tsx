'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll('article h2, article h3, article h4')
    ).map((heading) => ({
      id: heading.id || heading.textContent?.toLowerCase().replace(/\s+/g, '-') || '',
      text: heading.textContent || '',
      level: parseInt(heading.tagName[1]),
    }));

    // ID가 없는 헤딩에 ID 추가
    headings.forEach((item, index) => {
      const heading = document.querySelectorAll('article h2, article h3, article h4')[index];
      if (!heading.id) {
        heading.id = item.id;
      }
    });

    setToc(headings);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0% -70% 0%',
      }
    );

    const headings = document.querySelectorAll('article h2, article h3, article h4');
    headings.forEach((heading) => observer.observe(heading));

    return () => {
      headings.forEach((heading) => observer.unobserve(heading));
    };
  }, [toc]);

  if (toc.length === 0) return null;

  return (
    <nav className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-auto">
      <h2 className="font-heading text-lg font-semibold text-foreground mb-4">목차</h2>
      <ul className="space-y-2 text-sm">
        {toc.map((item) => (
          <li
            key={item.id}
            style={{ paddingLeft: `${(item.level - 2) * 1}rem` }}
          >
            <Link
              href={`#${item.id}`}
              className={`block py-1 transition-colors hover:text-accent ${
                activeId === item.id
                  ? 'text-accent font-medium border-l-2 border-accent pl-2 -ml-2'
                  : 'text-muted-foreground'
              }`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                });
              }}
            >
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
