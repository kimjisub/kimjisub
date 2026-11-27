import { ReactNode } from 'react';
import Link from 'next/link';

import { ChipList } from './Chip';
import { ExternalIcon } from './ExternalIcon';
import { Section } from './Section';

interface WorkItemData {
  title: string;
  href?: string;
  external?: boolean;
  /** 사이트 안의 경력 상세 페이지. 있으면 칩 아래에 '자세히' 링크를 단다 */
  detailHref?: string;
  period: string;
  role: ReactNode;
  description: ReactNode;
  details: ReactNode[];
  results: ReactNode[];
}

const InlineLink = ({ href, external = false, children }: { href: string; external?: boolean; children: ReactNode }) => (
  <Link href={href} className="link" {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
    {children}
    {external && <ExternalIcon />}
  </Link>
);

/**
 * 홈의 경력은 처음 읽는 사람 기준으로 쓴다.
 * 회사마다 "무슨 회사인지 한 줄, 한 일 2~5 문장, 결과 숫자 칩" 순서. 문안 원본은 resume/_context/web-copy-v2.md.
 * 순서는 지금 하는 일(Alpaon)을 맨 위로, 나머지는 시간 역순, 자문(댕로그)은 맨 끝.
 */
const workItems: WorkItemData[] = [
  {
    title: 'Alpaon',
    href: 'https://alpaon.com',
    external: true,
    period: '2022.08 – 현재',
    role: '공동창업자, CTO',
    description:
      '공장 설비를 인터넷과 AI에 연결하는 IoT(AlpaConnect)와, 클라우드 서버 임대(Synapus) 두 사업을 하는 회사입니다. 고객사는 두 사업을 합쳐 약 10곳입니다.',
    details: [
      <>
        <InlineLink href="/projects/alpaconnect">AlpaConnect</InlineLink>: 설비에 붙이는 장치의 회로 기판과 펌웨어, 데이터를
        모으는 서버, 현장 관리자가 보는 앱까지 한 플랫폼으로 만들었습니다. 식당 주방 장비, 주정 공장, 진공 챔버, 자동차
        승차감 측정 현장에 납품했습니다.
      </>,
      '인터넷이 끊겨도 기록이 사라지지 않게 장비에 쌓아 두었다가 보내고, 업데이트가 실패하면 스스로 이전 버전으로 돌아가게 했습니다. 그래서 장비 문제를 현장에 가지 않고 고칩니다.',
      '서버 구성을 단순하게 합쳐, 인터넷이 막힌 공장은 공장 안 서버에 같은 제품을 설치할 수 있게 했습니다. 클라우드를 쓸 수 없는 고객도 받게 됐습니다.',
      <>
        <InlineLink href="https://synap.us" external>
          Synapus
        </InlineLink>
        : 공동창업자와 함께 데이터센터 서버실을 꾸리고, 결제하면 가상 서버가 바로 만들어지는 셀프서비스 클라우드를
        만들었습니다. 계약마다 사람이 처리하던 서버 임대가 사람 없이 팔리는 상품이 됐습니다. 결제가 동시에 들어와도
        카드가 두 번 결제되거나 서버가 두 번 만들어지지 않게 했습니다.
      </>,
    ],
    results: ['고객사 약 10곳', '장비 화면 반응 3.5~5초에서 0.15초로', '2025년 11월 클라우드 플랫폼 오픈'],
  },
  {
    title: 'Candid',
    href: 'https://teamcandid.kr',
    external: true,
    period: '2025.08 – 2026.10',
    role: 'AX & Product Engineer',
    detailHref: '/careers/candid',
    description:
      '스타트업 채용을 돕는 헤드헌팅 회사입니다(20인 내외). 컨설턴트가 10명에서 17명으로 늘던 시기에 업무 시스템과 AI 기능을 기획부터 개발, 운영까지 맡았습니다.',
    details: [
      '공유 엑셀과 임시 시스템으로 관리하던 포지션, 후보자, 고객사, 매출을 사내 ERP로 옮겼습니다. 매일 하는 일부터 범위를 잘라, 착수 약 2개월 만에 전사에 열었습니다.',
      '결과가 아쉽던 AI 후보자 추천을 해체하고, 검증된 채점 기준만 살려 가벼운 검색 도구로 다시 만들었습니다. 포지션마다 3~5시간 걸리던 서치가 70분이 됐습니다.',
      '미팅 원문과 이력서를 읽어 기존 입력 칸을 채우는 기능을 만들어, 미팅록 작성이 30분에서 5분으로 줄었습니다.',
      '사람마다 달랐던 미팅록 품질은 입력 규칙으로 고쳤습니다. 값을 넣거나 못 넣은 이유를 골라야 저장되게 해, 무엇을 왜 놓치는지가 쌓이게 했습니다.',
    ],
    results: [
      '서치 3~5시간에서 70분으로',
      '미팅록 작성 30분에서 5분으로',
      '상위 10명 중 최종 합격자 2명에서 4명으로',
      '첫 달 계약 2건',
    ],
  },
  {
    title: 'Silicon Bridge',
    period: '2020.01 – 2025.07',
    role: 'Software Engineer, Full Stack Engineer',
    description:
      '아파트 단지의 차량 출입, 주차, 입주민 커뮤니티를 관리하는 서비스입니다. 약 300개 단지가 씁니다. 프리랜서로 시작해 스톡옵션을 받고 2024년에 정규직으로 전환했습니다.',
    details: [
      '주차장마다 시간제, 정기권, 할인권 규칙이 달라 현장마다 개발이 필요했습니다. 2020년 첫 버전부터 요금 규칙을 설정으로 바꾸는 계산 방식을 만들어, 새 주차장을 개발 일정 없이 열었습니다.',
      '클라우드에서만 돌던 서비스를 단지 서버 한 대에서도 돌게 만들어, 인터넷이 막힌 단지에도 같은 제품을 팔았습니다.',
      '결제(토스)와 번호판 인식을 붙이고 언어와 시간대를 나눠, 미국 현장에도 납품했습니다.',
    ],
    results: ['약 300개 단지', '시간당 30만 건 처리', '미국 현장 납품'],
  },
  {
    title: 'VPLATE',
    href: '/projects/vplate',
    period: '2019.02 – 2019.09',
    role: 'Software Engineer',
    description: '사진과 문구만 넣으면 광고 영상을 만들어 주는 서비스입니다. 고등학교 3학년 때 합류했습니다.',
    details: [
      '영상 편집 프로그램을 자동으로 조작하는 렌더링 엔진과 모바일 앱을 처음부터 만들어, 직원이 템플릿마다 한 시간씩 손으로 만들던 광고 영상을 고객이 휴대폰에서 직접 만들게 했습니다.',
    ],
    results: ['제작 1시간 수작업에서 고객 셀프 제작으로'],
  },
  {
    title: 'UniPad',
    href: '/projects/unipad',
    period: '2016.02 – 현재',
    role: '개인 프로젝트',
    description: '화면의 8x8 버튼을 눌러 곡을 연주하는 리듬게임입니다.',
    details: [
      '곡을 혼자 다 만들 수 없어, 곡 파일 형식을 공개하고 사용자가 직접 만들어 올리게 했습니다. 예전에 만든 곡도 계속 열리게 호환을 지켰습니다.',
      '음악 연주용 버튼 기기인 런치패드와 연결해, EDM 공연과 초등학교 수업에도 쓰였습니다.',
      '2026년부터 다시 운영합니다. 오류와 스토어 리뷰를 15분마다 점검하고 에이전트가 원인을 찾아 고치며, 사람은 배포만 승인합니다.',
    ],
    results: ['누적 1,000만 다운로드', '최대 월 사용자 80만', 'Google Play 음악 게임 인기 1위', '비정상 종료율 3.05%에서 2.1~2.4%로'],
  },
  {
    title: '댕로그',
    period: '2026.06 – 현재',
    role: '기술 자문',
    description: '반려견 유치원이 보호자에게 보내는 AI 알림장 서비스입니다.',
    details: [
      '원장님이 올린 단체 사진에서 개마다 사진을 골라 주는 AI의 구조를 함께 설계했습니다. 확신이 낮은 사진은 원장님에게 넘겨, 잘못 배정된 채 나간 사진이 없게 했습니다.',
    ],
    results: ['개 식별 정확도 80.8%에서 96.7%로', '사진 100장 처리 비용 42원에서 29원으로'],
  },
];

const WorkItem = ({ title, href, external, detailHref, period, role, description, details, results }: WorkItemData) => (
  <li className="py-12 first:pt-0 last:pb-0">
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
    <p className="mt-1 text-[0.9375rem] font-medium text-foreground/70">{role}</p>
    <p className="prose-ko mt-4 text-[0.9375rem] text-muted-foreground md:text-base">{description}</p>
    <ul className="prose-ko mt-5 space-y-3 text-foreground">
      {details.map((detail, i) => (
        <li key={i} className="relative pl-4 before:absolute before:left-0 before:top-[0.875em] before:h-px before:w-2 before:bg-border-strong">
          {detail}
        </li>
      ))}
    </ul>
    <ChipList items={results} className="mt-6" />
    {detailHref && (
      <p className="mt-5 text-sm">
        <Link href={detailHref} className="link text-muted-foreground">
          자세히
        </Link>
      </p>
    )}
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
