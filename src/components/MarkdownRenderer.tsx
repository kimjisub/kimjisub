'use client';

import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  /** 콘텐츠 기준 경로 (예: 'careers/my-career') - 상대 경로 이미지 변환용 */
  contentPath?: string;
}

export function MarkdownRenderer({ content, className = '', contentPath }: MarkdownRendererProps) {
  if (!content || content.trim() === '') {
    return null;
  }

  // 이미지 경로 변환: ./assets/... → /content/{contentPath}/assets/...
  const transformImageSrc = (src: string | undefined): string => {
    if (!src) return '';
    
    // 이미 절대 경로거나 외부 URL이면 그대로 반환
    if (src.startsWith('/') || src.startsWith('http://') || src.startsWith('https://')) {
      return src;
    }
    
    // 상대 경로 (./assets/... 또는 assets/...)를 절대 경로로 변환
    if (contentPath && (src.startsWith('./') || src.startsWith('assets/'))) {
      const cleanSrc = src.replace(/^\.\//, '');
      return `/content/${contentPath}/${cleanSrc}`;
    }
    
    return src;
  };

  return (
    <div className={`prose prose-neutral dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: ({ src, alt, ...props }) => {
            const transformedSrc = transformImageSrc(src);
            
            // 외부 이미지는 일반 img 태그 사용
            if (transformedSrc.startsWith('http')) {
              // eslint-disable-next-line @next/next/no-img-element
              return <img src={transformedSrc} alt={alt || ''} {...props} />;
            }
            
            // 내부 이미지는 Next.js Image 사용 (최적화)
            return (
              <Image
                src={transformedSrc}
                alt={alt || ''}
                width={800}
                height={600}
                className="rounded-lg"
                style={{ width: '100%', height: 'auto' }}
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
