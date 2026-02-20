'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { CommandPalette, useCommandPalette } from './CommandPalette';
import { MagneticLink, MagneticWrapper } from './MagneticButton';
import { MobileBottomSheet } from './MobileBottomSheet';
import { ThemeToggle } from './ThemeToggle';

const TopBar: React.FC = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { open: cmdOpen, onClose: cmdClose, setOpen: setCmdOpen } = useCommandPalette();
  const [navBarHidden, setNavBarHidden] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const lastScrollY = useRef(0);

  // Close mobile menu on Escape key
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    
    // Nav hide/show
    if (currentScrollY <= 0 || currentScrollY <= lastScrollY.current) {
      setNavBarHidden(false);
    } else {
      setNavBarHidden(true);
    }
    lastScrollY.current = currentScrollY;
    
    // Scroll progress for blur effect (0-100)
    const progress = Math.min(currentScrollY / 100, 1);
    setScrollProgress(progress);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { path: '/skills', label: 'Skills' },
    { path: '/projects', label: 'Projects' },
    { path: '/careers', label: 'Careers' },
    { path: '/blog', label: 'Blog' },
  ];

  // Dynamic blur based on scroll
  const blurValue = 4 + scrollProgress * 12; // 4px to 16px
  const bgOpacity = 0.8 + scrollProgress * 0.15; // 0.8 to 0.95

  return (
    <>
      <nav
      id="navigation"
      aria-label="메인 내비게이션"
      tabIndex={-1}
      className={`fixed top-0 w-full h-14 z-50 border-b border-border transition-transform duration-200 ${
        navBarHidden ? '-translate-y-full' : ''
      }`}
      style={{
        backdropFilter: `blur(${blurValue}px)`,
        WebkitBackdropFilter: `blur(${blurValue}px)`,
        backgroundColor: `hsl(var(--background) / ${bgOpacity})`,
      }}
    >
      <div className="h-14 max-w-4xl mx-auto px-6 flex items-center justify-between">
        <MagneticLink 
          href="/" 
          className="flex items-center gap-3 text-foreground hover:text-muted-foreground transition-colors"
          strength={0.25}
          radius={60}
        >
          <Image
            src="/logo192.png"
            alt="Jisub Kim 로고"
            width={28}
            height={28}
            className="rounded-md"
          />
          <span className="text-sm font-medium">Jisub Kim</span>
        </MagneticLink>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <MagneticLink
              key={link.path}
              href={link.path}
              aria-current={pathname?.startsWith(link.path) ? 'page' : undefined}
              className={`text-sm transition-colors ${
                pathname?.startsWith(link.path)
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              strength={0.3}
              radius={60}
            >
              {link.label}
            </MagneticLink>
          ))}

          {/* Command Palette trigger */}
          <MagneticWrapper strength={0.3} radius={60}>
            <button
              onClick={() => setCmdOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Open command palette"
              title="Open command palette (⌘K)"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <kbd className="font-mono">⌘K</kbd>
            </button>
          </MagneticWrapper>

          <MagneticWrapper strength={0.3} radius={50}>
            <ThemeToggle />
          </MagneticWrapper>
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center gap-2">
          {/* Command Palette trigger (mobile) */}
          <button
            onClick={() => setCmdOpen(true)}
            className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Open command palette"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
          <ThemeToggle />
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
            className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {isMenuOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="8" x2="20" y2="8" />
                <line x1="4" y1="16" x2="20" y2="16" />
              </svg>
            )}
          </button>
        </div>
      </div>
      </nav>

      {/* Mobile Bottom Sheet */}
      <MobileBottomSheet 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        links={links} 
      />

      {/* Command Palette (rendered outside nav to avoid stacking context issues) */}
      <CommandPalette open={cmdOpen} onClose={cmdClose} />
    </>
  );
};

export default TopBar;
