'use client';

import { MDXProvider } from '@mdx-js/react';
import Image from 'next/image';
import { ComponentType, ReactNode } from 'react';
import { ImageGrid, PhoneScreens, SideBySide } from './ImageGrid';

// MDX에서 사용할 커스텀 컴포넌트들
const components = {
  // 기본 이미지는 Next.js Image로 대체 (이미 import된 이미지는 자동 처리됨)
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} className="rounded-lg" alt={props.alt || ''} />
  ),
  // Image 컴포넌트 (MDX에서 직접 사용)
  Image: Image,
  // 이미지 그리드 컴포넌트들
  ImageGrid,
  PhoneScreens,
  SideBySide,
};

interface MDXContentProps {
  children: ReactNode;
}

export function MDXContent({ children }: MDXContentProps) {
  return (
    <MDXProvider components={components}>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {children}
      </div>
    </MDXProvider>
  );
}

// 동적 MDX 로더
export async function loadMDX(
  category: 'projects' | 'careers' | 'skills',
  slug: string
): Promise<ComponentType | null> {
  try {
    // 동적 import - 빌드 타임에 Webpack이 가능한 경로들을 분석
    const mdx = await import(`@/content/${category}/${slug}/index.mdx`);
    return mdx.default;
  } catch {
    return null;
  }
}
