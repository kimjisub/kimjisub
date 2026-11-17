import { ReactNode } from 'react';
import Link from 'next/link';

import { Section } from './Section';

interface Entry {
  title: ReactNode;
  period?: string;
}

const groups: { heading: string; entries: Entry[] }[] = [
  {
    heading: 'Education',
    entries: [
      { title: '한국외국어대학교 컴퓨터전자시스템공학부 학사', period: '2020.03 - 2026.08 졸업' },
      { title: '한국디지털미디어고등학교 해킹방어과, 특기자 전형 수석 입학', period: '2017.03 - 2020.01' },
    ],
  },
  {
    heading: 'Awards',
    entries: [
      {
        title: (
          <Link href="/careers" className="link">
            대회 22회 입상, 1위 11회
          </Link>
        ),
      },
      { title: '한국정보올림피아드 공모 부문 금상', period: '2016.07' },
    ],
  },
];

export const BackgroundSection = () => {
  return (
    <Section id="background" title="Background">
      <div className="grid gap-10 sm:grid-cols-2">
        {groups.map(({ heading, entries }) => (
          <div key={heading}>
            <h3 className="text-xs font-medium uppercase tracking-[0.05em] text-muted-foreground">{heading}</h3>
            <ul className="mt-4 space-y-4">
              {entries.map(({ title, period }, i) => (
                <li key={i}>
                  <p className="text-foreground">{title}</p>
                  {period && <p className="mt-0.5 text-sm tabular-nums text-muted-foreground">{period}</p>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
};
