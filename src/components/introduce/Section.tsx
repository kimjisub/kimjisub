import { ReactNode } from 'react';

interface SectionProps {
  id: string;
  title: string;
  /** 제목 오른쪽에 놓는 보조 링크 */
  action?: ReactNode;
  children: ReactNode;
}

/**
 * 홈 화면 섹션의 공통 틀.
 * 한 칸짜리 본문 폭 안에서 제목을 위에, 내용을 아래에 둔다. 위계는 구분선, 여백, 제목 크기로만 준다.
 */
export function Section({ id, title, action, children }: SectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section id={id} aria-labelledby={headingId} className="scroll-mt-14 border-t border-border py-16 md:py-24">
      <div className="home-grid">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id={headingId} className="font-serif text-[2rem] font-normal leading-none tracking-[-0.01em] text-foreground md:text-[2.5rem]">
            {title}
          </h2>
          {action && <div className="text-sm">{action}</div>}
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}
