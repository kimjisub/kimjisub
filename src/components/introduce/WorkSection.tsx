'use client';

import Link from 'next/link';

import { RoughHighlight } from '@/components/RoughHighlight';
import { SectionReveal, SectionRevealItem } from '@/components/SectionReveal';

interface WorkItemProps {
  title: string;
  titleHref?: string;
  titleExternal?: boolean;
  titleHighlight?: boolean; // true면 box (링크+강조), false면 underline (링크만)
  period: string;
  role: string;
  description: React.ReactNode;
  details: React.ReactNode[];
  highlightDelay?: number;
}

const WorkItem = ({ 
  title, 
  titleHref, 
  titleExternal = false,
  titleHighlight = false,
  period, 
  role, 
  description, 
  details, 
  highlightDelay = 0 
}: WorkItemProps) => {
  const linkProps = titleExternal ? { target: '_blank' as const, rel: 'noopener noreferrer' } : {};
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 mb-4">
        <h3 className="text-xl font-medium text-foreground">
          {titleHref ? (
            <Link href={titleHref} className="hover:text-accent transition-colors" {...linkProps}>
              <RoughHighlight 
                type={titleHighlight ? 'box' : 'underline'} 
                delay={highlightDelay} 
                animationDuration={600}
                strokeWidth={titleHighlight ? 1.5 : undefined}
                padding={titleHighlight ? 3 : undefined}
              >
                {title}
              </RoughHighlight>
            </Link>
          ) : (
            title
          )}
        </h3>
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
};

// underline: 이동 가능한 링크
const UnderlineLink = ({ 
  href, 
  children, 
  delay = 0,
  external = false,
}: { 
  href: string; 
  children: React.ReactNode; 
  delay?: number;
  external?: boolean;
}) => {
  const linkProps = external ? { target: '_blank' as const, rel: 'noopener noreferrer' } : {};
  
  return (
    <Link href={href} className="hover:text-accent transition-colors" {...linkProps}>
      <RoughHighlight type="underline" delay={delay} animationDuration={500}>
        {children}
      </RoughHighlight>
    </Link>
  );
};

export const WorkSection = () => {
  return (
    <section className="py-12 md:py-24 border-t border-border bg-card/30">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <SectionReveal>
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-12 italic">
            Work
          </h2>
        </SectionReveal>

        <SectionReveal stagger staggerDelay={0.15} className="space-y-16">
          {/* Candid - 외부 링크 + 강조 → box */}
          <SectionRevealItem>
            <WorkItem
              title="Candid"
              titleHref="https://teamcandid.kr"
              titleExternal
              titleHighlight
              period="2024.8 — present"
              role="Product Engineer (sole engineer)"
              highlightDelay={0}
              description={
                <>
                  스타트업 채용 컨설팅 회사입니다. 19명 중 엔지니어는 저 혼자입니다.
                </>
              }
              details={[
                'Excel 기반 업무를 자체 Backoffice ERP로 전환.',
                '후보자 및 포지션 내부 자료 RAG 구축, 2-stage 추천 시스템 개발.',
                '컨설턴트들이 쓰는 AI agent 개발. 자체 LLM 서버 세팅.',
              ]}
            />
          </SectionRevealItem>

          {/* Alpaon - 외부 링크 + 강조 → box */}
          <SectionRevealItem>
            <WorkItem
              title="Alpaon"
              titleHref="https://alpaon.com"
              titleExternal
              titleHighlight
              period="2021.8 — present"
              role="CTO, Co-founder"
              highlightDelay={100}
              description={
                <>
                  산업용 IoT와 클라우드 인프라 회사입니다. 3명이서 시작했습니다.
                </>
              }
              details={[
                <>
                  <UnderlineLink href="/projects/alpaconnect" delay={200}>AlpaConnect</UnderlineLink>
                  {' '}— PLC 장비와 연동하는 자체 PCB 개발. 클라우드 기반 관리/모니터링/알림 SaaS.
                </>,
                <>
                  <UnderlineLink href="https://synap.us" external delay={300}>Synap.us</UnderlineLink>
                  {' '}— 200U+ 랙 공간, 전 구간 이중화. Managed K8s, VPC, 480Gbps transit, 99.99% SLA.
                </>,
                '펌웨어, 백엔드, 프론트엔드, 인프라 전부 담당. 회로 설계만 파트너가 담당.',
              ]}
            />
          </SectionRevealItem>

          {/* Silicon Bridge - 링크 없음 */}
          <SectionRevealItem>
            <WorkItem
              title="Silicon Bridge"
              period="2020.1 — 2024.7"
              role="Full Stack Engineer → Software Engineer"
              highlightDelay={200}
              description={
                <>
                  <UnderlineLink href="/projects/eyevacs4" delay={400}>eyevacs</UnderlineLink>
                  {' '}아파트 차량 관제·커뮤니티 플랫폼 개발. (중간 휴식기 1년 7개월 포함)
                </>
              }
              details={[
                'MSA 기반 플랫폼 구축. AWS ECS(Fargate), Terraform IaC로 멀티 환경 운영.',
                '시간당 30만 건(≈83 RPS) 요청 안정 처리. Redis 캐시, MongoDB 최적화.',
                '멀티테넌시 구조, 정책 기반 요금 정산 엔진, 장비(차단기·카메라·센서) 통신 고도화.',
              ]}
            />
          </SectionRevealItem>

          {/* VPLATE - 내부 링크 → underline */}
          <SectionRevealItem>
            <WorkItem
              title="VPLATE"
              titleHref="/projects/vplate"
              period="2019.2 — 2019.9"
              role="Software Engineer"
              highlightDelay={300}
              description={
                <>
                  영상·이미지·텍스트를 입력하면 고품질 홍보 영상을 자동 생성하는 플랫폼.
                </>
              }
              details={[
                '분산 렌더링 인프라 개발. 여러 렌더링 머신 스케줄러 설계/구현.',
                'Adobe AE/Media Encoder 기반 동적 리소스 주입 엔진 구현.',
                'Android 앱 개발. 모바일에서 리소스 업로드 → 영상 제작까지 End-to-End.',
              ]}
            />
          </SectionRevealItem>

          {/* UniPad - 내부 링크 + 강조 → box */}
          <SectionRevealItem>
            <WorkItem
              title="UniPad"
              titleHref="/projects/unipad"
              titleHighlight
              period="2016.2 — 2019.1"
              role="Founder"
              highlightDelay={400}
              description={
                <>
                  8x8 격자 버튼으로 음악을 연주하는 능동형 리듬게임. 중학교 때 만들었습니다.
                </>
              }
              details={[
                <>
                  누적{' '}
                  <RoughHighlight type="highlight" delay={500} animationDuration={600}>
                    930만 다운로드
                  </RoughHighlight>
                  . 음악게임 1위, 전체 게임 50위 달성.
                </>,
                '최대 MAU 80만. Novation Launchpad 연동 지원.',
                '축제/EDM 페스티벌에서 활용. 초등학교 교육 교구로도 사용.',
              ]}
            />
          </SectionRevealItem>
        </SectionReveal>
      </div>
    </section>
  );
};
