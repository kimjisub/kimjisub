import Link from 'next/link';

import { Section } from './Section';

const external = { target: '_blank', rel: 'noopener noreferrer' } as const;

const facts: { label: string; items: string[] }[] = [
  { label: 'Location', items: ['Seoul, Korea · KST (UTC+9)'] },
  {
    label: 'Milestones',
    items: [
      'UniPad 500만+ 다운로드 (2016, 중학교 때 만든 앱)',
      '코딩 12년+ (2013년 시작)',
      '해커톤/경진대회 수상 15회+',
      '스타트업 창업 2회 (Alpaon, Synap.us)',
    ],
  },
  {
    label: 'Core stack',
    items: ['TypeScript, React, Next.js, Python, Docker, Kubernetes, LLM / AI, Firmware'],
  },
  { label: 'Values', items: ['문제의 본질을 파고드는 것', '코드보다 돌아가는 시스템', '자동화와 시스템화'] },
  { label: 'Interests', items: ['AI/LLM, DevTools, Startup, IoT, Infra, 투자'] },
];

export const AboutSection = () => {
  return (
    <Section id="about" title="About">
      <div className="max-w-[40rem] space-y-5 leading-[1.75] text-foreground">
        <p>
          2016년에 만든 앱이 500만 다운로드를 넘기면서 개발을 시작했습니다. 중학교 때였고, 그게{' '}
          <Link href="/projects/unipad" className="link">
            UniPad
          </Link>
          입니다.
        </p>
        <p>
          지금은 두 회사에서 일합니다.{' '}
          <Link href="https://alpaon.com" className="link" {...external}>
            Alpaon
          </Link>
          에서는 공동창업자이자 CTO로 산업용 IoT 제품을 만들고,{' '}
          <Link href="https://teamcandid.kr" className="link" {...external}>
            Candid
          </Link>
          에서는 유일한 엔지니어로 채용 시스템을 개발합니다.
        </p>
        <p>
          코드만 짜는 건 재미없습니다. 제품이 어떻게 쓰이는지, 비즈니스가 어떻게 돌아가는지 같이 고민하는 쪽을
          선호합니다.
        </p>
        <p>
          한국외대 컴퓨터공학과 재학 중입니다. 2026년 2월에 졸업 예정. 학교 다니면서 계속 일했습니다.
          한국디지털미디어고등학교 해킹방어과 출신입니다. 거기서 정보올림피아드 금상도 받고, 해커톤도 많이
          나갔습니다.
        </p>
        <p>
          요즘은 LLM을 제품에 어떻게 넣을지 고민하고 있습니다. Candid에서는 추천 시스템에, Alpaon에서는 산업 설비
          제어에 쓰고 있습니다. 최근에는 AIoT 기반 HVAC 최적화 연구로{' '}
          <Link href="https://ieeexplore.ieee.org/abstract/document/11416246" className="link" {...external}>
            IEEE 논문
          </Link>
          도 게재했습니다.
        </p>
      </div>

      <dl className="mt-12 grid max-w-[40rem] gap-x-10 gap-y-8 border-t border-border pt-8 sm:grid-cols-2">
        {facts.map(({ label, items }) => (
          <div key={label}>
            <dt className="text-xs font-medium uppercase tracking-[0.05em] text-muted-foreground">{label}</dt>
            {items.map((item) => (
              <dd key={item} className="mt-2 text-[0.9375rem] leading-relaxed text-foreground">
                {item}
              </dd>
            ))}
          </div>
        ))}
      </dl>
    </Section>
  );
};
