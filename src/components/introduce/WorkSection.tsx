'use client';

import { SectionReveal, SectionRevealItem } from '@/components/SectionReveal';

interface WorkItemProps {
  title: string;
  period: string;
  role: string;
  description: string;
  details: string[];
}

const WorkItem = ({ title, period, role, description, details }: WorkItemProps) => (
  <div>
    <div className="flex items-baseline gap-4 mb-4">
      <h3 className="text-xl font-medium text-foreground">{title}</h3>
      <span className="text-sm text-muted-foreground">{period}</span>
    </div>
    <p className="text-sm text-accent mb-4">{role}</p>
    <p className="text-muted-foreground leading-relaxed mb-4">{description}</p>
    <ul className="text-muted-foreground text-sm space-y-2">
      {details.map((detail, i) => (
        <li key={i}>{detail}</li>
      ))}
    </ul>
  </div>
);

export const WorkSection = () => {
  const works = [
    {
      title: 'Alpaon',
      period: '2023 — present',
      role: 'CTO, Co-founder',
      description: '산업용 IoT와 클라우드 인프라 회사입니다. 3명이서 시작했습니다.',
      details: [
        'AlpaConnect — PLC를 클라우드에 연결해서 원격 모니터링/제어. LLM 기반 대화형 인터페이스 개발 중.',
        'Synap.us — Managed VPC, Kubernetes, VM 서비스. 480Gbps transit, 99.99% SLA.',
        '펌웨어, 백엔드, 프론트엔드, 인프라 전부 담당. 회로 설계만 다른 분이 합니다.',
      ],
    },
    {
      title: 'Candid',
      period: '2023 — present',
      role: 'Product Engineer (sole engineer)',
      description: '스타트업 채용 컨설팅 회사입니다. 19명 중 엔지니어는 저 혼자입니다.',
      details: [
        'Excel로 하던 업무를 자체 ERP로 전환했습니다.',
        '2-stage 후보자 추천 시스템 개발. 컨설턴트들이 쓰는 AI agent도 만들었습니다.',
        '자체 LLM 서버 세팅. RTX 4090으로 로컬 추론 돌립니다.',
      ],
    },
    {
      title: 'SiliconBridge',
      period: '2022 — 2023',
      role: 'Software Engineer',
      description: '반도체 설계 자동화 솔루션 회사입니다.',
      details: [
        'EDA 도구 개발 및 반도체 설계 워크플로우 자동화.',
        'Python/C++ 기반 설계 검증 툴 개발.',
      ],
    },
    {
      title: 'VPlate',
      period: '2021 — 2022',
      role: 'Software Engineer',
      description: 'AI 기반 영상 편집 플랫폼입니다.',
      details: [
        'AI 영상 분석 및 자동 편집 기능 개발.',
        '대용량 미디어 처리 파이프라인 구축.',
      ],
    },
    {
      title: 'UniPad',
      period: '2016 — 2020',
      role: 'Founder',
      description: 'Launchpad 시뮬레이터 앱입니다. 중학교 때 만들었습니다.',
      details: [
        'Google Play 500만+ 다운로드. 전 세계 유저들이 썼습니다.',
        '유저 커뮤니티가 만든 프로젝트 파일이 수만 개 공유됐습니다.',
        '지금은 오픈소스로 공개했습니다.',
      ],
    },
  ];

  return (
    <section className="py-24 border-t border-border bg-card/30">
      <div className="max-w-4xl mx-auto px-6">
        <SectionReveal>
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-12 italic">
            Work
          </h2>
        </SectionReveal>

        <SectionReveal stagger staggerDelay={0.15} className="space-y-16">
          {works.map((work) => (
            <SectionRevealItem key={work.title}>
              <WorkItem {...work} />
            </SectionRevealItem>
          ))}
        </SectionReveal>
      </div>
    </section>
  );
};
