'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { MagneticLink, MagneticWrapper } from './MagneticButton';
import { ThemeToggle } from './ThemeToggle';

const TopBar: React.FC = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navBarHidden, setNavBarHidden] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const lastScrollY = useRef(0);

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
    <nav
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
          <MagneticWrapper strength={0.3} radius={50}>
            <ThemeToggle />
          </MagneticWrapper>
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-sm text-muted-foreground"
          >
            {isMenuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          {links.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setIsMenuOpen(false)}
              className={`block px-6 py-3 text-sm border-b border-border last:border-0 ${
                pathname?.startsWith(link.path)
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default TopBar;
