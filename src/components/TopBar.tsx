'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { CommandPalette, useCommandPalette } from './CommandPalette';
import { MobileBottomSheet } from './MobileBottomSheet';
import { ThemeToggle } from './ThemeToggle';

const links = [
  { path: '/projects', label: 'Projects' },
  { path: '/careers', label: 'Careers' },
  { path: '/skills', label: 'Skills' },
  { path: '/blog', label: 'Blog' },
];

const iconButtonClass =
  'w-9 h-9 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors';

const SearchIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const TopBar: React.FC = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { open: cmdOpen, onClose: cmdClose, setOpen: setCmdOpen } = useCommandPalette();

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  return (
    <>
      <nav
        id="navigation"
        aria-label="메인 내비게이션"
        tabIndex={-1}
        className="fixed top-0 w-full h-14 z-50 border-b border-border bg-[color-mix(in_srgb,var(--background)_85%,transparent)] backdrop-blur-md"
      >
        <div className="h-14 max-w-5xl mx-auto px-5 md:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-foreground">
            <Image src="/logo192.png" alt="" width={24} height={24} className="rounded-[5px]" />
            <span className="text-sm font-medium">Jisub Kim</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const isCurrent = pathname?.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                    isCurrent ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <button
              type="button"
              onClick={() => setCmdOpen(true)}
              className="ml-2 flex items-center gap-2 h-8 pl-2.5 pr-2 rounded-md border border-border text-xs text-muted-foreground hover:text-foreground hover:border-border-strong transition-colors"
              aria-label="검색 열기"
            >
              <SearchIcon size={13} />
              <span>검색</span>
              <kbd className="font-sans text-[11px] text-muted-foreground">⌘K</kbd>
            </button>

            <ThemeToggle />
          </div>

          <div className="md:hidden flex items-center gap-1">
            <button type="button" onClick={() => setCmdOpen(true)} className={iconButtonClass} aria-label="검색 열기">
              <SearchIcon size={16} />
            </button>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
              className={iconButtonClass}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {isMenuOpen ? (
                  <>
                    <path d="M18 6L6 18" />
                    <path d="M6 6l12 12" />
                  </>
                ) : (
                  <>
                    <line x1="4" y1="8" x2="20" y2="8" />
                    <line x1="4" y1="16" x2="20" y2="16" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <MobileBottomSheet isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} links={links} />

      {/* nav 안에 두면 backdrop-filter 가 만든 쌓임 맥락에 갇히므로 밖에서 렌더한다 */}
      <CommandPalette open={cmdOpen} onClose={cmdClose} />
    </>
  );
};

export default TopBar;
