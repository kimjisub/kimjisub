'use client';

import { ReactNode } from 'react';
import { Theme } from '@radix-ui/themes';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * next-themes 가 html 의 class 로 밝기를 정하고, Radix Theme 은 그 class 를 그대로 따른다.
 * 테마가 바뀌는 순간에는 색 transition 을 꺼서 화면 전체가 번지듯 바뀌지 않게 한다.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Theme hasBackground={false}>{children}</Theme>
    </NextThemesProvider>
  );
}
