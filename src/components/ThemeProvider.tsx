'use client';

import { Theme } from '@radix-ui/themes';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ReactNode, useEffect, useState } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent flash by not rendering until mounted
  if (!mounted) {
    return (
      <Theme appearance="dark">
        <div style={{ visibility: 'hidden' }}>{children}</div>
      </Theme>
    );
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      <ThemeWrapper>{children}</ThemeWrapper>
    </NextThemesProvider>
  );
}

function ThemeWrapper({ children }: { children: ReactNode }) {
  const [appearance, setAppearance] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Watch for theme changes via class on html element
    const updateAppearance = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setAppearance(isDark ? 'dark' : 'light');
    };

    updateAppearance();

    const observer = new MutationObserver(updateAppearance);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return <Theme appearance={appearance}>{children}</Theme>;
}
