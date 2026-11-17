'use client';

import { ReactNode } from 'react';
import { Theme } from '@radix-ui/themes';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * 사이트는 라이트 모드 하나로만 보인다.
 * forcedTheme 은 시스템 설정(prefers-color-scheme)과 localStorage 에 남은 예전 선택('dark')을 모두 무시하고
 * html 에 항상 light class 를 붙인다. Radix Theme 도 light 로 고정한다.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      forcedTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <Theme appearance="light" hasBackground={false}>
        {children}
      </Theme>
    </NextThemesProvider>
  );
}
