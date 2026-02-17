import Image from 'next/image';
import Link from 'next/link';

import GithubSection from '@/components/introduce/GithubSection';
import SkillsSection from '@/components/introduce/SkillSection';

export const revalidate = 3600;

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="min-h-[85vh] flex items-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-24">
          <div className="flex flex-col md:flex-row items-start gap-12">
            <Image
              src="/logo192.png"
              className="rounded-2xl w-32 h-32 md:w-40 md:h-40 object-cover ring-1 ring-border"
              alt="김지섭"
              width={160}
              height={160}
              priority
            />

            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-medium text-foreground mb-4 tracking-tight">
                김지섭
              </h1>
              
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed max-w-xl">
                Alpaon CTO. Candid Product Engineer.<br />
                소프트웨어부터 펌웨어, 인프라까지 직접 만들고 운영합니다.
              </p>

              <div className="flex flex-wrap gap-3 text-sm">
                <a 
                  href="https://alpaon.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-card border border-border hover:border-foreground/30 transition-colors"
                >
                  Alpaon
                </a>
                <a 
                  href="https://teamcandid.kr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-card border border-border hover:border-foreground/30 transition-colors"
                >
                  Candid
                </a>
                <a 
                  href="https://github.com/kimjisub" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-card border border-border hover:border-foreground/30 transition-colors"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-24 border-t border-border">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-12 italic">
            About
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                2016년에 만든 앱이 500만 다운로드를 넘기면서 개발을 시작했습니다. 
                중학교 때였고, 그게 UniPad입니다.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                지금은 두 회사에서 일합니다. Alpaon에서는 공동창업자이자 CTO로 
                산업용 IoT 제품을 만들고, Candid에서는 유일한 엔지니어로 
                채용 시스템을 개발합니다.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                코드만 짜는 건 재미없습니다. 제품이 어떻게 쓰이는지, 
                비즈니스가 어떻게 돌아가는지 같이 고민하는 쪽을 선호합니다.
              </p>
            </div>
            
            <div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                한국외대 컴퓨터공학과 재학 중입니다. 2026년 2월에 졸업 예정.
                학교 다니면서 계속 일했습니다.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                한국디지털미디어고등학교 해킹방어과 출신입니다. 
                거기서 정보올림피아드 금상도 받고, 해커톤도 많이 나갔습니다.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                요즘은 LLM을 제품에 어떻게 넣을지 고민하고 있습니다. 
                Candid에서는 추천 시스템에, Alpaon에서는 산업 설비 제어에 쓰고 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Work */}
      <section className="py-24 border-t border-border bg-card/30">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-12 italic">
            Work
          </h2>

          <div className="space-y-16">
            {/* Alpaon */}
            <div>
              <div className="flex items-baseline gap-4 mb-4">
                <h3 className="text-xl font-medium text-foreground">Alpaon</h3>
                <span className="text-sm text-muted-foreground">2023 — present</span>
              </div>
              <p className="text-sm text-accent mb-4">CTO, Co-founder</p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                산업용 IoT와 클라우드 인프라 회사입니다. 3명이서 시작했습니다.
              </p>
              <ul className="text-muted-foreground text-sm space-y-2">
                <li>AlpaConnect — PLC를 클라우드에 연결해서 원격 모니터링/제어. LLM 기반 대화형 인터페이스 개발 중.</li>
                <li>Synap.us — Managed VPC, Kubernetes, VM 서비스. 480Gbps transit, 99.99% SLA.</li>
                <li>펌웨어, 백엔드, 프론트엔드, 인프라 전부 담당. 회로 설계만 다른 분이 합니다.</li>
              </ul>
            </div>

            {/* Candid */}
            <div>
              <div className="flex items-baseline gap-4 mb-4">
                <h3 className="text-xl font-medium text-foreground">Candid</h3>
                <span className="text-sm text-muted-foreground">2023 — present</span>
              </div>
              <p className="text-sm text-accent mb-4">Product Engineer (sole engineer)</p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                스타트업 채용 컨설팅 회사입니다. 19명 중 엔지니어는 저 혼자입니다.
              </p>
              <ul className="text-muted-foreground text-sm space-y-2">
                <li>Excel로 하던 업무를 자체 ERP로 전환했습니다.</li>
                <li>2-stage 후보자 추천 시스템 개발. 컨설턴트들이 쓰는 AI agent도 만들었습니다.</li>
                <li>자체 LLM 서버 세팅. RTX 4090으로 로컬 추론 돌립니다.</li>
              </ul>
            </div>

            {/* UniPad */}
            <div>
              <div className="flex items-baseline gap-4 mb-4">
                <h3 className="text-xl font-medium text-foreground">UniPad</h3>
                <span className="text-sm text-muted-foreground">2016 — 2020</span>
              </div>
              <p className="text-sm text-accent mb-4">Founder</p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Launchpad 시뮬레이터 앱입니다. 중학교 때 만들었습니다.
              </p>
              <ul className="text-muted-foreground text-sm space-y-2">
                <li>Google Play 500만+ 다운로드. 전 세계 유저들이 썼습니다.</li>
                <li>유저 커뮤니티가 만든 프로젝트 파일이 수만 개 공유됐습니다.</li>
                <li>지금은 오픈소스로 공개했습니다.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Education & Awards */}
      <section className="py-24 border-t border-border">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-12 italic">
            Background
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-6">Education</h3>
              <ul className="space-y-4 text-sm">
                <li>
                  <p className="text-foreground">한국외국어대학교 컴퓨터공학과</p>
                  <p className="text-muted-foreground">2020 — 2026 (졸업 예정)</p>
                </li>
                <li>
                  <p className="text-foreground">한국디지털미디어고등학교 해킹방어과</p>
                  <p className="text-muted-foreground">2017 — 2019</p>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-6">Recognition</h3>
              <ul className="space-y-4 text-sm">
                <li>
                  <p className="text-foreground">정보올림피아드 금상</p>
                  <p className="text-muted-foreground">2017</p>
                </li>
                <li>
                  <p className="text-foreground">해커톤 및 창업 대회 18회+ 수상</p>
                  <p className="text-muted-foreground">2017 — 2023</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* GitHub */}
      <GithubSection />
      
      {/* Skills */}
      <SkillsSection />

      {/* Contact */}
      <section className="py-24 border-t border-border">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-8 italic">
            Contact
          </h2>
          
          <div className="flex flex-wrap gap-4">
            <a 
              href="mailto:0226daniel@gmail.com"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              0226daniel@gmail.com
            </a>
            <span className="text-border">·</span>
            <a 
              href="https://www.linkedin.com/in/kimjisub"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              LinkedIn
            </a>
            <span className="text-border">·</span>
            <a 
              href="https://github.com/kimjisub"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
