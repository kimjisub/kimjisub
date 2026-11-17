import Link from 'next/link';

import { ExternalIcon } from './ExternalIcon';
import { Section } from './Section';

const external = { target: '_blank', rel: 'noopener noreferrer' } as const;

/**
 * 지금 하는 일. 홈의 사이드 정보는 이 두 줄만 둔다.
 * Values, Interests, Core stack, Milestones, Location 은 About 본문과 겹치거나 처음 읽는 사람에게 필요 없어 홈에서 뺐다.
 */
const nowRoles = [
  { org: 'Alpaon', href: 'https://alpaon.com', role: '공동창업자, CTO (파트타임)', period: '2022 –' },
  { org: '댕로그', role: '기술 자문', period: '2026 –' },
];

export const AboutSection = () => {
  return (
    <Section id="about" title="About">
      <div className="prose-ko space-y-6 text-foreground">
        <p>
          리듬게임{' '}
          <Link href="/projects/unipad" className="link">
            UniPad
          </Link>
          는 1,000만 번 넘게 다운로드됐습니다. 곡을 혼자 다 만들 수 없어서, 사용자가 직접 곡을 만들어 올리게 바꾼
          덕분입니다.
        </p>
        <p>
          그 뒤로도 비슷한 일을 해 왔습니다. 직원이 한 시간씩 만들던 광고 영상을 사용자가 휴대폰에서 직접 만들게
          했고(VPLATE), 주차장마다 개발이 필요하던 요금 계산을 설정만 바꾸면 되게 했고(Silicon Bridge), 사람이
          계약마다 처리하던 서버 임대를 결제하면 바로 서버가 생기는 서비스로 바꿨습니다(Alpaon).
        </p>
        <p>
          최근에는 채용 컨설팅 회사 Candid에서, 컨설턴트가 3~5시간씩 하던 후보자 찾기를 AI 에이전트에게 맡겨 70분으로
          줄였습니다. 반복 작업을 넘어 사람이 판단하던 일까지 AI에게 맡기는 쪽으로 일하고 있습니다.
        </p>
        <p>
          지금은 공동창업한 Alpaon에서 공장과 매장의 설비를 인터넷과 AI에 연결하는 제품을 파트타임으로 만들고, 반려견
          유치원 서비스 댕로그의 사진 AI를 자문하고 있습니다.
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
