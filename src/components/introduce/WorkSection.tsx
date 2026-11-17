import { ReactNode } from 'react';
import Link from 'next/link';

import { ArrowIcon, ExternalIcon } from './ExternalIcon';
import { Section } from './Section';

interface WorkItemData {
  title: string;
  href?: string;
  external?: boolean;
  period: string;
  role: ReactNode;
  description: ReactNode;
  details: ReactNode[];
}

const InlineLink = ({ href, external = false, children }: { href: string; external?: boolean; children: ReactNode }) => (
  <Link href={href} className="link" {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
    {children}
    {external && <ExternalIcon />}
  </Link>
);

/**
 * 홈의 경력은 처음 읽는 사람 기준으로 쓴다.
 * 회사마다 "무슨 회사인지 한 줄, 내가 만든 것, 의미가 바로 보이는 숫자" 순서로 두고, 내부 지표와 기술 이름은 /careers 상세에만 남긴다.
 * 순서는 지금 하는 일(Alpaon)을 맨 위로, 나머지는 시간 역순.
 */
const workItems: WorkItemData[] = [
  {
    title: 'Alpaon',
    href: 'https://alpaon.com',
    external: true,
    period: '2022.08 – 현재',
    role: '공동창업자, CTO (파트타임)',
    description: '공장과 매장의 설비를 인터넷과 AI에 연결하는 회사입니다. 고객사는 두 제품을 합쳐 약 10곳입니다.',
    details: [
      <>
        <InlineLink href="/projects/alpaconnect">AlpaConnect</InlineLink>: 설비에 붙이는 장치의 회로 기판부터, 데이터를
        모으는 서버와 앱까지 만들었습니다. 식당 주방, 공장, 연구용 장비처럼 서로 다른 현장에 납품했고, 장비에 문제가
        생겨도 현장에 가지 않고 원격으로 고칩니다.
      </>,
      '구조를 단순하게 바꿔, 인터넷이 막힌 공장에도 같은 제품을 설치할 수 있게 했습니다.',
      <>
        <InlineLink href="https://synap.us" external>
          Synapus
        </InlineLink>
        : 결제하면 바로 서버가 만들어지는 클라우드 서비스입니다. 사람이 계약마다 처리하던 서버 임대를 자동으로 팔리는
        상품으로 바꿨습니다.
      </>,
    ],
  },
  {
    title: 'Candid',
    href: 'https://teamcandid.kr',
    external: true,
    period: '2025.08 – 2026.10',
    role: 'AX & Product Engineer',
    description: '스타트업의 채용을 도와주는 컨설팅 회사입니다. 기획부터 개발, 운영까지 제품 전체를 맡았습니다.',
    details: [
      '엑셀과 Slack에 흩어져 있던 업무를 사내 시스템 하나로 모았습니다.',
      '후보자를 찾아 평가하는 AI 에이전트를 만들어, 포지션마다 3~5시간 걸리던 서치를 70분으로 줄였습니다. 이 도구로 진행한 포지션에서 첫 달에 계약 2건이 나왔습니다.',
      '컨설턴트 20명 중 9명이 매주 썼습니다.',
    ],
  },
  {
    title: 'Silicon Bridge',
    period: '2020.01 – 2025.07',
    role: (
      <>
        Software Engineer
        <ArrowIcon />
        Full Stack Engineer
      </>
    ),
    description: '아파트 단지의 차량 출입, 주차, 커뮤니티를 관리하는 서비스 회사입니다. 약 300개 단지가 씁니다.',
    details: [
      '인터넷이 막힌 단지에도 설치할 수 있는 버전을 만들어, 같은 제품을 더 많은 단지에 팔 수 있게 했습니다.',
      '주차장마다 다른 요금 규칙을 설정만으로 적용하게 만들어, 새 주차장을 개발 없이 열었습니다.',
      '차단기, 카메라, 센서 신호를 시간당 30만 건 처리하는 서버를 운영했습니다.',
    ],
  },
  {
    title: 'VPLATE',
    href: '/projects/vplate',
    period: '2019.02 – 2019.09',
    role: 'Software Engineer',
    description: '광고 영상을 자동으로 만들어 주는 서비스입니다. 고등학교 3학년 때 합류했습니다.',
    details: [
      '영상 편집 프로그램을 코드로 움직이는 엔진과 모바일 앱을 만들어, 직원이 한 시간씩 손으로 만들던 광고 영상을 사용자가 휴대폰에서 직접 만들게 했습니다.',
    ],
  },
  {
    title: 'UniPad',
    href: '/projects/unipad',
    period: '2016.02 – 현재',
    role: '개인 프로젝트',
    description: '화면의 8x8 버튼을 눌러 곡을 연주하는 리듬게임입니다.',
    details: [
      '사용자가 직접 곡을 만들어 올리게 해, 누적 1,000만 다운로드, 최대 월 사용자 80만, Google Play 음악 게임 인기 1위를 기록했습니다.',
      '실제 런치패드 기기와 연결돼 EDM 공연과 초등학교 수업에도 쓰였습니다.',
    ],
  },
];

const WorkItem = ({ title, href, external, period, role, description, details }: WorkItemData) => (
  <li className="py-10 first:pt-0 last:pb-0">
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <h3 className="text-xl font-semibold tracking-[-0.02em] text-foreground md:text-[1.375rem]">
        {href ? (
          <InlineLink href={href} external={external}>
            {title}
          </InlineLink>
        ) : (
          title
        )}
      </h3>
      <p className="meta-num whitespace-nowrap text-sm text-muted-foreground">{period}</p>
    </div>
    <p className="mt-1 text-[0.9375rem] text-muted-foreground">{role}</p>
    <p className="prose-ko mt-5 text-foreground">{description}</p>
    <ul className="prose-ko mt-4 space-y-2.5 text-[0.9375rem] leading-[1.75] text-foreground/80 md:text-base">
      {details.map((detail, i) => (
        <li key={i} className="relative pl-4 before:absolute before:left-0 before:top-[0.85em] before:h-px before:w-2 before:bg-border-strong">
          {detail}
        </li>
      ))}
    </ul>
  </li>
);

export const WorkSection = () => {
  return (
    <Section
      id="work"
      title="Work"
      action={
        <Link href="/careers" className="link text-muted-foreground">
          전체 경력
        </Link>
      }
    >
      <ol className="divide-y divide-border">
        {workItems.map((item) => (
          <WorkItem key={item.title} {...item} />
        ))}
      </ol>
    </Section>
  );
};
