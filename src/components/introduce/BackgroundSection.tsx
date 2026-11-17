import { ReactNode } from 'react';
import Link from 'next/link';

import { Section } from './Section';

interface Entry {
  title: ReactNode;
  period: string;
}

const groups: { heading: string; entries: Entry[] }[] = [
  {
    heading: 'Education',
    entries: [
      { title: '한국외국어대학교 컴퓨터공학과', period: '2020 – 2026 (졸업 예정)' },
      { title: '한국디지털미디어고등학교 해킹방어과', period: '2017 – 2019' },
    ],
  },
  {
    heading: 'Recognition',
    entries: [
      { title: '정보올림피아드 금상', period: '2017' },
      {
        title: (
          <Link href="/careers" className="link">
            해커톤 및 창업 대회 18회+ 수상
          </Link>
        ),
        period: '2017 – 2023',
      },
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
              {entries.map(({ title, period }) => (
                <li key={period}>
                  <p className="text-foreground">{title}</p>
                  <p className="mt-0.5 text-sm tabular-nums text-muted-foreground">{period}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
};
