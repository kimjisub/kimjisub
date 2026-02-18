'use client';

import { useCallback, useState } from 'react';

interface SkipLink {
  id: string;
  label: string;
}

const skipLinks: SkipLink[] = [
  { id: 'main-content', label: '본문으로 건너뛰기' },
  { id: 'navigation', label: '내비게이션으로 이동' },
  { id: 'contact', label: '연락처로 이동' },
];

export function SkipToContent() {
  const [focused, setFocused] = useState(false);

  const handleClick = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div
      className={`
        fixed top-0 left-0 z-[9999] p-2
        transition-transform duration-200
        ${focused ? 'translate-y-0' : '-translate-y-full'}
      `}
    >
      <nav aria-label="건너뛰기 링크" className="flex flex-col gap-1">
        {skipLinks.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            onClick={(e) => {
              e.preventDefault();
              handleClick(link.id);
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="
              px-4 py-2 rounded-lg
              bg-accent text-accent-foreground
              font-medium text-sm
              focus:outline-none focus-visible:ring-2 focus-visible:ring-ring
              shadow-lg
            "
          >
            {link.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
