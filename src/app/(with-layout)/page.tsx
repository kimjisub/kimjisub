import { Text } from '@radix-ui/themes';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

import GithubSection from '@/components/introduce/GithubSection';
import SkillsSection from '@/components/introduce/SkillSection';
import { TimeLine, TimeLineItem } from '@/components/TimeLine';

// import { getGitHubContributions } from '@/api/github';

gsap.registerPlugin(ScrollTrigger);
export const revalidate = 3600;

export default function Home() {
  return (
    <main className="pt-16 flex flex-col min-h-screen py-4 snap-y snap-mandatory">
      <section className="w-full min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-[#f8fafc] via-[#e0e7ef] to-[#f1f5f9] py-16">
      <div className="bg-white/90 rounded-3xl shadow-2xl border border-slate-100 flex flex-col md:flex-row items-center md:items-start max-w-4xl w-full px-8 py-12 md:px-16 md:py-16 gap-0 md:gap-12">
        {/* 프로필 영역 */}
        <div className="flex flex-col items-center md:items-start mb-8 md:mb-0 md:w-1/3">
          <Image
            src="/logo192.png"
            className="rounded-full border-4 border-white shadow-lg w-36 h-36 object-cover mb-4"
            alt={''}
            width={144}
            height={144}
          />
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight mb-2">김지섭</h1>
          <span className="text-base md:text-lg text-slate-500 font-medium mb-1">Fullstack Engineer</span>
          <span className="text-xs text-slate-400">10년차 · 창업 · 프리랜서 · 수상 26회</span>
        </div>
        {/* 소개 텍스트 */}
        <div className="w-full md:w-2/3 text-center md:text-left flex flex-col justify-center">
          <Text className="break-keep text-slate-700 text-lg leading-relaxed space-y-5">
            <p>
              안녕하세요, 지난 10여년을 코드를 통해 세상의 문제를 풀어온 <span className="font-bold text-blue-600">풀스택 엔지니어</span> 김지섭입니다. 지금까지 <span className="font-bold text-violet-500">55개 이상의 프로젝트</span>를 직접 만들고 운영해봤고, 그 과정에서 <span className="font-bold text-teal-600">수백만 명</span>의 사용자를 끌어모은 경험도 있습니다.
            </p>
            <p>
              또한, IT 관련 대회에서 <span className="font-bold text-orange-500">26회의 수상</span> 경험이 있고, <span className="font-bold text-emerald-600">2번의 창업</span>, <span className="font-bold text-sky-600">6년의 프리랜서</span> 활동, 그리고 <span className="font-bold text-blue-600">3년간의 정규직</span> 경험을 통해 세상의 흐름을 읽어내고, 그 사이에 피어난 수요를 파고들어 제품을 개발해나가는 것에 강점이 있습니다.
            </p>
            <p>
              이 모든 경험은 <span className="font-bold text-violet-500">학사 과정</span>을 병행하며 얻은 것들입니다. <span className="font-bold text-blue-600">실무</span>에서의 통찰과 함께 <span className="font-bold text-teal-600">이론적인 기반</span>도 갖춘, <span className="font-bold text-rose-500">균형 잡힌 엔지니어</span>라고 자신있게 말씀드립니다.
            </p>
            <p>
              귀사와 함께 더 재미있고 의미 있는 문제들을 함께 풀어나가고 싶습니다. 저의 <span className="font-bold text-sky-600">직감과 기술</span>이 그 여정에 힘이 되길 바랍니다.
            </p>
          </Text>
        </div>
      </div>
    </section>
      {/* <EducationSection /> */}
      <div className="w-full max-w-4xl mx-auto px-4 md:px-8 my-12">
        <TimeLine>
          <TimeLineItem
            year={2023}
            title="Alpaon LLC."
            content={
              <>
                산업용 IoT 플랫폼의 설계, 개발, 배포, 운영까지 전 과정을 총괄하며 CTO로 참여하고 있습니다.
                <br />
                대규모 센서 데이터 수집 및 실시간 분석, 클라우드 인프라 구축, 산업 현장 맞춤형 솔루션 제공 등 다양한 프로젝트를 리딩하고 있습니다.
                <br />
                기술팀 리딩과 아키텍처 설계, 고객사와의 협업 경험을 통해 비즈니스와 기술의 균형을 추구하고 있습니다.
              </>
            }
          />
          <TimeLineItem
            year={2023}
            title="HUFS IDS Lab. 학부연구생"
            content={
              <>
                한국외국어대학교 IDS 연구실에서 학부연구생으로 활동하며, MySQL 등 DB 엔진을 SSD 컨트롤러 단계에서 직접 구현하는 연구에 참여했습니다.
                <br />
                스토리지 하드웨어와 소프트웨어의 경계를 넘나드는 실험을 통해 데이터베이스 성능 최적화와 시스템 구조에 대한 깊은 이해를 쌓았습니다.
                <br />
                논문 작성, 실험 설계, 연구 미팅 등 학술적 경험도 함께 쌓았습니다.
              </>
            }
          />
          <TimeLineItem
            year={2020}
            title="한국외국어대학교 20학번 컴퓨터공학부 입학"
            content={
              <>
                컴퓨터공학의 이론과 실제를 깊이 있게 배우기 위해 진학했습니다.
                <br />
                자료구조, 알고리즘, 운영체제, 네트워크 등 CS 전반을 학습하며, 다양한 팀 프로젝트와 공모전에 참여했습니다.
                <br />
                학업과 실무를 병행하며 균형 잡힌 엔지니어로 성장하고 있습니다.
              </>
            }
          />
          <TimeLineItem
            title="IT 창업 경진 대회 및 해커톤 18여 회 수상"
            content={
              <>
                전국 규모의 해커톤, 창업 경진대회 등에서 18회 이상 수상하며 아이디어 기획, 프로토타입 개발, 발표까지 전 과정을 경험했습니다.
                <br />
                다양한 팀과 협업하며 빠른 MVP 제작, 시장성 검증, 피칭 역량을 키웠습니다.
                <br />
                실제 서비스로 이어진 프로젝트도 다수 있습니다.
              </>
            }
          />
          <TimeLineItem
            year={2019}
            title={<><span style={{ color: '#DC4744' }}>The Vplanet</span> 입사</>}
            content={
              <>
                스타트업 The Vplanet에서 안드로이드 앱, API 서버, After Effect 기반 렌더링 엔진 등 다양한 제품을 개발했습니다.
                <br />
                소규모 팀에서 기획부터 배포, 유지보수까지 전 과정을 경험하며 실전 개발 역량을 쌓았습니다.
                <br />
                고객 요구사항 분석, UI/UX 개선, 신규 기능 설계 등 폭넓은 업무를 담당했습니다.
              </>
            }
          />
          <TimeLineItem
            year={2018}
            title={<><span style={{ color: '#D31877' }}>디미고라이프</span> 개발 및 운영</>}
            content={
              <>
                교내 인트라넷 서비스인 디미고라이프를 직접 기획, 개발, 운영하여 전교생의 기숙사 생활을 지원했습니다.
                <br />
                사용자 피드백을 반영한 지속적 개선, 서버 인프라 관리, 데이터베이스 설계 등 실무 경험을 쌓았습니다.
                <br />
                서비스의 성장과정에서 문제 해결력과 책임감을 키웠습니다.
              </>
            }
          />
          <TimeLineItem
            year={2017}
            title={<><span style={{ color: '#D31877' }}>한국디지털미디어고등학교</span> 16기 해킹방어과 입학</>}
            content={
              <>
                IT 특성화고에 입학하여 해킹방어, 네트워크, 프로그래밍 등 다양한 기술을 체계적으로 배웠습니다.
                <br />
                교내외 대회, 동아리 활동, 프로젝트 경험을 통해 실전 감각을 익혔습니다.
                <br />
                이 시기에 개발자로서의 진로를 확고히 다졌습니다.
              </>
            }
          />
          <TimeLineItem
            year={2016}
            title="UniPad 프로젝트 진행"
            content={
              <>
                안드로이드 기반 음악 게임 UniPad를 기획, 개발, 출시하여 플레이스토어 500만+ 다운로드를 달성했습니다.
                <br />
                전 세계 유저와 소통하며 지속적으로 업데이트, 커뮤니티 관리, 피드백 반영 등 서비스 운영 전반을 경험했습니다.
                <br />
                이 프로젝트를 통해 개발자로서의 첫 성공 경험을 얻었습니다.
              </>
            }
          />
        </TimeLine>
      </div>
      {/* <ProjectSection /> */}
      <GithubSection />
      <SkillsSection />
      {/* <ContactSection /> */}
    </main>
  );
}

/*
1. 자기소개
	 제너럴리스트

2. 기술
	 위에서 말한 제너럴리스트답게 다양한 기술

3. 프로젝트 및 업적 타임라인
	업적 (경력)
  Github 커밋 히트맵과 함께 

4. 연락처
   명함 3D 모델링 활용


*/
