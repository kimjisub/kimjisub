import Link from 'next/link';

import { Section } from './Section';

const external = { target: '_blank', rel: 'noopener noreferrer' } as const;

const facts: { label: string; items: string[] }[] = [
  {
    label: 'Current roles',
    items: [
      'Alpaon | 공동창업자, CTO (파트타임) | 산업 설비 IoT, 셀프서비스 클라우드',
      '댕로그 | 기술 자문 | 반려견 유치원 AI 알림장',
    ],
  },
  { label: 'Values', items: ['첫 버전부터 운영까지', '사람 없이 돌아가는 구조', '판단까지 넘기는 AI 전환'] },
  {
    label: 'Milestones',
    items: [
      'UniPad 1,000만+ 다운로드, Google Play 음악 게임 인기 1위',
      '대회 22회 입상, 1위 11회',
      'Alpaon 공동창업 (AlpaConnect, Synapus)',
      '코딩 12년+ (2013년 시작)',
    ],
  },
  {
    label: 'Core stack',
    items: ['TypeScript, React, Next.js, Python, Docker, Kubernetes, LLM / AI, Firmware'],
  },
  { label: 'Location', items: ['Seoul, Korea (KST, UTC+9)'] },
  { label: 'Interests', items: ['AI/LLM, DevTools, Startup, IoT, Infra, 투자'] },
];

export const AboutSection = () => {
  return (
    <Section id="about" title="About">
      <div className="max-w-[40rem] space-y-5 leading-[1.75] text-foreground">
        <p className="text-lg leading-relaxed">
          0 to 1은 첫 버전을 만드는 데서 멈추지 않고, 사람이 개입하지 않아도 운영되는 구조까지 만듭니다. 장비, 서버,
          화면, AI를 하나의 제품 관점으로 직접 개발합니다.
        </p>
        <p>
          리듬게임{' '}
          <Link href="/projects/unipad" className="link">
            UniPad
          </Link>
          는 혼자서는 곡을 다 만들 수 없어, 사용자가 곡을 만들어 나누는 커뮤니티로 키웠습니다. 누적 1,000만 다운로드,
          Google Play 음악 게임 인기 1위, 최대 월 사용자 80만을 기록했습니다.
        </p>
        <p>
          VPLATE에서는 직원이 템플릿마다 한 시간씩 만들던 광고 영상을, 사용자가 휴대폰에서 사진과 문구를 올려 끝내게
          했습니다. Silicon Bridge의 주차 요금은 2020년 첫 계산부터 설정으로 넣어, 새 현장은 개발 일정 없이 열었고 같은
          주차는 언제 계산해도 같은 요금이 나오게 했습니다.{' '}
          <Link href="https://alpaon.com" className="link" {...external}>
            알파온
          </Link>{' '}
          Synapus는 결제가 확인되면 가상 서버가 만들어집니다. 계약마다 사람이 처리하던 서버 임대가 팔리는 상품이
          됐습니다.
        </p>
        <p>
          Candid에서는 컨설턴트가 포지션마다 3~5시간씩 하던 후보 서치를 AI 에이전트에 맡겨 70분으로 줄였습니다.
          사람이 하던 실행을 제품에 넘기던 일이, 후보를 고르는 판단까지 넘기는 AI 전환으로 넓어지고 있습니다.
        </p>
        <p>
          AIoT 기반 HVAC 최적화 연구로{' '}
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
