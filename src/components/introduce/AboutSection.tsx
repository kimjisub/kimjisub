import { ExternalIcon } from './ExternalIcon';
import { Section } from './Section';

const external = { target: '_blank', rel: 'noopener noreferrer' } as const;

/**
 * 지금 하는 일. About 아래에 작게 두 줄만 둔다.
 */
const nowRoles = [
  { org: 'Alpaon', href: 'https://alpaon.com', role: '공동창업자, CTO', period: '2022 –' },
  { org: '댕로그', role: '기술 자문', period: '2026 –' },
];

export const AboutSection = () => {
  return (
    <Section id="about" title="About">
      <div className="prose-ko space-y-6 text-foreground">
        <p>
          한 제품에 필요한 기술을 끝까지 맡습니다. 설비에 붙는 장치의 회로와 펌웨어, 데이터를 모으는 서버와 클라우드,
          사람이 쓰는 앱과 웹, 일을 대신하는 AI 에이전트까지 직접 만들고 운영합니다.
        </p>
        <p>
          사용자 옆에서 문제를 고르고, 첫 버전을 빨리 내고, 실제로 쓰이는지 숫자로 확인합니다. Candid에서는 AI 후보자
          검색 도구를 교육과 함께 들여, 컨설턴트 17명 중 9명이 매주 썼습니다.
        </p>
        <p>
          지금은 공동창업한 Alpaon에서 CTO로 일하고, 반려견 유치원 서비스 댕로그의 사진 AI를 자문합니다.
          한국외국어대학교를 2026년 8월에 졸업했습니다.
        </p>
      </div>

      <div className="mt-14 border-t border-border pt-6">
        <p className="font-serif text-lg italic leading-none text-muted-foreground">Now</p>
        <dl className="mt-4 divide-y divide-border">
          {nowRoles.map(({ org, href, role, period }) => (
            <div key={org} className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-0.5 py-3 sm:grid-cols-[8rem_minmax(0,1fr)_auto]">
              <dt className="font-semibold tracking-[-0.01em] text-foreground">
                {href ? (
                  <a href={href} className="link" {...external}>
                    {org}
                    <ExternalIcon />
                  </a>
                ) : (
                  org
                )}
              </dt>
              <dd className="order-last col-span-2 text-[0.9375rem] text-muted-foreground sm:order-none sm:col-span-1">
                {role}
              </dd>
              <dd className="meta-num text-[0.9375rem] text-muted-foreground">{period}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
};
