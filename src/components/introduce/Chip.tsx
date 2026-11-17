import { ReactNode } from 'react';

/** 결과 숫자 한 조각. 작은 둥근 테두리, 숫자 폭 고정. */
export const Chip = ({ children }: { children: ReactNode }) => (
  <span className="meta-num inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-[0.8125rem] leading-[1.6] text-muted-foreground">
    {children}
  </span>
);

export const ChipList = ({ items, className = '' }: { items: ReactNode[]; className?: string }) => (
  <ul className={`flex flex-wrap gap-1.5 ${className}`}>
    {items.map((item, i) => (
      <li key={i}>
        <Chip>{item}</Chip>
      </li>
    ))}
  </ul>
);
