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
    period: '2024.8 – present',
    role: 'Product Engineer (sole engineer)',
    description: '스타트업 채용 컨설팅 회사입니다. 19명 중 엔지니어는 저 혼자입니다.',
    details: [
      'Excel 기반 업무를 자체 Backoffice ERP로 전환.',
      '후보자 및 포지션 내부 자료 RAG 구축, 2-stage 추천 시스템 개발.',
      '컨설턴트들이 쓰는 AI agent 개발. 자체 LLM 서버 세팅.',
    ],
  },
  {
    title: 'Alpaon',
    href: 'https://alpaon.com',
    external: true,
    period: '2021.8 – present',
    role: 'CTO, Co-founder',
    description: '산업용 IoT와 클라우드 인프라 회사입니다. 3명이서 시작했습니다.',
    details: [
      <>
        <InlineLink href="/projects/alpaconnect">AlpaConnect</InlineLink> — PLC 장비와 연동하는 자체 PCB 개발. 클라우드
        기반 관리/모니터링/알림 SaaS.
      </>,
      <>
        <InlineLink href="https://synap.us" external>
          Synap.us
        </InlineLink>{' '}
        — 200U+ 랙 공간, 전 구간 이중화. Managed K8s, VPC, 480Gbps transit, 99.99% SLA.
      </>,
      '펌웨어, 백엔드, 프론트엔드, 인프라 전부 담당. 회로 설계만 파트너가 담당.',
    ],
  },
  {
    title: 'Silicon Bridge',
    period: '2020.1 – 2024.7',
    role: 'Full Stack Engineer → Software Engineer',
    description: (
      <>
        <InlineLink href="/projects/eyevacs4">eyevacs</InlineLink> 아파트 차량 관제·커뮤니티 플랫폼 개발. (중간 휴식기
        1년 7개월 포함)
      </>
    ),
    details: [
      'MSA 기반 플랫폼 구축. AWS ECS(Fargate), Terraform IaC로 멀티 환경 운영.',
      '시간당 30만 건(≈83 RPS) 요청 안정 처리. Redis 캐시, MongoDB 최적화.',
      '멀티테넌시 구조, 정책 기반 요금 정산 엔진, 장비(차단기·카메라·센서) 통신 고도화.',
    ],
  },
  {
    title: 'VPLATE',
    href: '/projects/vplate',
    period: '2019.2 – 2019.9',
    role: 'Software Engineer',
    description: '영상·이미지·텍스트를 입력하면 고품질 홍보 영상을 자동 생성하는 플랫폼.',
    details: [
      '분산 렌더링 인프라 개발. 여러 렌더링 머신 스케줄러 설계/구현.',
      'Adobe AE/Media Encoder 기반 동적 리소스 주입 엔진 구현.',
      'Android 앱 개발. 모바일에서 리소스 업로드 → 영상 제작까지 End-to-End.',
    ],
  },
  {
    title: 'UniPad',
    href: '/projects/unipad',
    period: '2016.2 – 2019.1',
    role: 'Founder',
    description: '8x8 격자 버튼으로 음악을 연주하는 능동형 리듬게임. 중학교 때 만들었습니다.',
    details: [
      '누적 930만 다운로드. 음악게임 1위, 전체 게임 50위 달성.',
      '최대 MAU 80만. Novation Launchpad 연동 지원.',
      '축제/EDM 페스티벌에서 활용. 초등학교 교육 교구로도 사용.',
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
