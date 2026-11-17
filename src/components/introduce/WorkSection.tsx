import { ReactNode } from 'react';
import Link from 'next/link';

import { Section } from './Section';

interface WorkItemData {
  title: string;
  href?: string;
  external?: boolean;
  period: string;
  role: string;
  description: ReactNode;
  details: ReactNode[];
}

const InlineLink = ({ href, external = false, children }: { href: string; external?: boolean; children: ReactNode }) => (
  <Link href={href} className="link text-foreground" {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
    {children}
  </Link>
);

const workItems: WorkItemData[] = [
  {
    title: 'Candid',
    href: 'https://teamcandid.kr',
    external: true,
    period: '2025.08 - 2026.10',
    role: 'AX & Product Engineer',
    description: '스타트업 채용 컨설팅 회사. 기획부터 백엔드, 프론트, 인프라, AI까지 담당.',
    details: [
      '엑셀과 Slack에 흩어진 운영을 ERP 하나로 모으고, 에이전트가 같은 데이터를 읽게 열어둠. 입사 석 달 만에 영업 운영을 이전.',
      '후보 서치 3~5시간 -> 70분. 이 도구로 진행한 포지션에서 첫 달 계약 2건. 추천 상위 10명 중 적합 후보 3명 -> 7명.',
      '서치 한 번 모델 비용 $3,148 -> $559. 에이전트 실행 79분 -> 40분.',
      '기존 입력 칸 안에 AI를 넣어 컨설턴트의 입력 흐름을 유지. 컨설턴트 20명 중 9명이 매주 사용.',
    ],
  },
  {
    title: 'Alpaon',
    href: 'https://alpaon.com',
    external: true,
    period: '2022.08 - present',
    role: '공동창업자, CTO (파트타임)',
    description: '산업 현장의 설비와 데이터를 클라우드와 AI에 연결하는 회사. AlpaConnect와 Synapus 합산 고객사 약 10곳.',
    details: [
      <>
        <InlineLink href="/projects/alpaconnect">AlpaConnect</InlineLink>: 회로 기판, 펌웨어, 서버, 모바일 앱까지 직접
        만들어 식당 주방, 주정 공장, 진공 챔버, 녹색건축, 자동차 승차감 측정 현장에 납품. 망이 끊겨도 기록이 남고, 서명
        검증 뒤 실패하면 이전 버전으로 돌아가는 원격 업데이트.
      </>,
      '서비스가 늘 함께 배포되고 CPU 사용률이 4.5%라, 마이크로서비스 9개와 Kafka, gRPC를 서비스 하나로 통합. 현장 컨테이너 31개 -> 7개. 같은 설치본을 폐쇄망 공장 서버에도 배포.',
      <>
        <InlineLink href="https://synap.us" external>
          Synapus
        </InlineLink>
        : 결제가 확인되면 가상 서버가 만들어지는 셀프서비스 클라우드. 랙 200U 이상 IDC. 2025년 1월 개별 계약, 11월
        플랫폼 오픈.
      </>,
    ],
  },
  {
    title: 'Silicon Bridge',
    period: '2020.01 - 2025.07',
    role: 'Software Engineer (프리랜서 상근, 2020.01 - 2024.03) -> Full Stack Engineer (정규직, 2024.04 - 2025.07)',
    description:
      '아파트 단지 차량 관제, 출입, 커뮤니티, 주차 전산. 군 복무를 빼면 4년. 2022.08부터 알파온 파트타임과 병행. 스톡옵션을 받고 2024년에 정규직으로 전환.',
    details: [
      <>
        <InlineLink href="/projects/eyevacs4">eyevacs4</InlineLink>: 약 300개 단지의 운영 플랫폼. 서비스 코드는 두고
        클라우드 부품만 오픈소스로 바꿔, 단지 서버 한 대의 설치형을 제작. 인터넷이 막힌 단지에도 같은 제품 판매.
      </>,
      'eyevacs parking: 요금 정책을 설정으로 바꿔 2020년 첫 버전부터 새 현장을 개발 없이 개설. 차단기, 카메라, 센서를 한 서버에서 시간당 30만 건 처리.',
    ],
  },
  {
    title: 'VPLATE (더브이플래닛)',
    href: '/projects/vplate',
    period: '2019.02 - 2019.09',
    role: 'Software Engineer, 정규직',
    description: '광고 영상 자동 제작 플랫폼. 고등학교 3학년 때 합류.',
    details: [
      '영상 편집 도구를 코드로 조종해, 템플릿의 영상, 이미지, 글자를 바꿔 렌더링하는 엔진과 모바일 제작 앱을 처음부터 개발. 백엔드 구조와 API는 설계 후 담당 개발자에게 인계.',
      '직원이 템플릿마다 한 시간씩 손으로 하던 제작을, 사용자가 휴대폰에서 끝내는 제품으로 변경.',
    ],
  },
  {
    title: 'UniPad',
    href: '/projects/unipad',
    period: '2016.02 - present',
    role: '개인 프로젝트',
    description: '8x8 패드를 눌러 곡을 연주하는 리듬게임. 2026년부터 다시 개발해 운영 중.',
    details: [
      '혼자서는 곡을 다 만들 수 없어 사용자가 곡(팩)을 만들게 함. 형식을 공개하고 예전 팩이 계속 열리게 호환을 유지.',
      '누적 1,000만 다운로드, 최대 월 사용자 80만, Google Play 음악 게임 인기 1위.',
      '실제 Launchpad 기기와 연결. EDM 공연과 초등학교 교구로 사용.',
    ],
  },
];

const WorkItem = ({ title, href, external, period, role, description, details }: WorkItemData) => (
  <li>
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <h3 className="text-lg font-medium text-foreground">
        {href ? (
          <InlineLink href={href} external={external}>
            {title}
          </InlineLink>
        ) : (
          title
        )}
      </h3>
      <p className="text-sm tabular-nums text-muted-foreground whitespace-nowrap">{period}</p>
    </div>
    <p className="mt-1 text-sm text-muted-foreground">{role}</p>
    <p className="mt-4 max-w-[40rem] leading-relaxed text-foreground">{description}</p>
    <ul className="mt-3 max-w-[40rem] list-disc space-y-1.5 pl-5 text-[0.9375rem] leading-relaxed text-muted-foreground marker:text-border-strong">
      {details.map((detail, i) => (
        <li key={i}>{detail}</li>
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
      <ol className="space-y-12">
        {workItems.map((item) => (
          <WorkItem key={item.title} {...item} />
        ))}
      </ol>
    </Section>
  );
};
