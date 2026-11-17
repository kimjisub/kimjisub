import { ReactNode } from 'react';

interface SectionProps {
  id: string;
  title: string;
  /** 제목 옆(모바일)·아래(데스크톱)에 놓는 보조 링크 */
  action?: ReactNode;
  children: ReactNode;
}

/**
 * 홈 화면 섹션의 공통 틀.
 * 데스크톱에서는 왼쪽 열에 제목, 오른쪽 열에 내용을 두어 모든 섹션이 같은 두 기준선에 맞는다.
 */
export function Section({ id, title, action, children }: SectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section id={id} aria-labelledby={headingId} className="border-t border-border py-14 md:py-20">
      <div className="home-grid">
        <div className="flex items-baseline justify-between gap-4 md:block md:sticky md:top-24 md:self-start">
          <h2 id={headingId} className="font-serif text-2xl leading-tight tracking-[-0.01em] text-foreground">
            {title}
          </h2>
          {action && <div className="text-sm md:mt-3">{action}</div>}
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}
