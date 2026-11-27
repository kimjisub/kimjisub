import Link from 'next/link';

import { ArrowIcon, ExternalIcon } from '@/components/introduce/ExternalIcon';
import {
  candidIntro,
  candidProjects,
  type CaseDecision,
  type CaseMetric,
  type CaseProject,
} from '@/content/careers/candid/caseStudy';

/**
 * Candid 경력 상세. 홈과 같은 글자 체계(prose-ko, meta-num, 세리프 제목)를 쓰고,
 * 프로젝트 하나를 "결과 한 문장 제목, 기간, 문제, 한 일, 결정, 결과, 한계" 순서의 카드로 쌓는다.
 */

const Label = ({ children }: { children: string }) => (
  <h3 className="text-[0.8125rem] font-semibold tracking-[0.01em] text-muted-foreground">{children}</h3>
);

const Metric = ({ value, from, to, caption }: CaseMetric) => (
  <div className="min-w-0">
    <p className="meta-num text-[1.75rem] font-semibold leading-tight tracking-[-0.02em] text-foreground md:text-[2rem]">
      {from && to ? (
        <>
          <span className="text-muted-foreground">{from}</span>
          <ArrowIcon />
          {to}
        </>
      ) : (
        value
      )}
    </p>
    <p className="mt-1.5 text-[0.875rem] leading-[1.6] text-muted-foreground">{caption}</p>
  </div>
);

const Decision = ({ choice, judgment, givenUp }: CaseDecision) => (
  <dl className="grid grid-cols-1 gap-x-5 gap-y-1 sm:grid-cols-[6rem_minmax(0,1fr)] sm:gap-y-2">
    <dt className="text-sm font-medium text-muted-foreground sm:pt-[0.2em]">선택</dt>
    <dd className="mb-2 sm:mb-0">{choice}</dd>
    <dt className="text-sm font-medium text-muted-foreground sm:pt-[0.2em]">판단</dt>
    <dd className="mb-2 sm:mb-0">{judgment}</dd>
    <dt className="text-sm font-medium text-muted-foreground sm:pt-[0.2em]">내려놓은 것</dt>
    <dd>{givenUp}</dd>
  </dl>
);

const ProjectCard = ({ project, index }: { project: CaseProject; index: number }) => (
  <article aria-labelledby={`${project.id}-title`} className="rounded-xl border border-border p-5 md:p-8">
    <p className="meta-num text-sm text-muted-foreground">
      프로젝트 {index + 1}
      <span className="mx-2 text-border-strong">|</span>
      {project.period}
    </p>
    <h2
      id={`${project.id}-title`}
      className="mt-2 text-xl font-semibold leading-[1.45] tracking-[-0.02em] text-foreground md:text-[1.5rem]"
    >
      {project.title}
    </h2>

    <div className="prose-ko mt-8 space-y-8 text-foreground">
      <section className="space-y-2">
        <Label>문제</Label>
        <p>{project.problem}</p>
      </section>

      <section className="space-y-2">
        <Label>한 일</Label>
        <ul className="space-y-2">
          {project.work.map((item, i) => (
            <li
              key={i}
              className="relative pl-4 before:absolute before:left-0 before:top-[0.875em] before:h-px before:w-2 before:bg-border-strong"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <Label>결정</Label>
        <div className="space-y-5 divide-y divide-border">
          {project.decisions.map((d, i) => (
            <div key={i} className={i > 0 ? 'pt-5' : ''}>
              <Decision {...d} />
            </div>
          ))}
        </div>
      </section>
    </div>

    <section className="mt-8 border-t border-border pt-6">
      <Label>결과</Label>
      <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {project.metrics.map((m, i) => (
          <Metric key={i} {...m} />
        ))}
      </div>
      {project.outcomes && (
        <ul className="prose-ko mt-6 space-y-2 text-foreground/85">
          {project.outcomes.map((o, i) => (
            <li
              key={i}
              className="relative pl-4 before:absolute before:left-0 before:top-[0.875em] before:h-px before:w-2 before:bg-border-strong"
            >
              {o}
            </li>
          ))}
        </ul>
      )}
    </section>

    {project.limit && (
      <section className="prose-ko mt-6 space-y-1 border-l-2 border-border-strong pl-4">
        <Label>한계</Label>
        <p className="text-foreground/85">{project.limit}</p>
      </section>
    )}
  </article>
);

export const CandidCaseStudy = () => (
  <div className="mx-auto max-w-3xl px-5 py-12 md:px-6 md:py-24">
    <Link href="/careers" className="link text-sm text-muted-foreground">
      전체 경력
    </Link>
    <header className="mt-6">
      <h1 className="font-serif text-[2.5rem] font-normal leading-none tracking-[-0.01em] text-foreground md:text-[3rem]">
        <a href="https://teamcandid.kr" className="link" target="_blank" rel="noopener noreferrer">
          Candid
          <ExternalIcon />
        </a>
      </h1>
      <p className="mt-4 text-[0.9375rem] font-medium text-foreground/70">
        AX & Product Engineer
        <span className="meta-num ml-3 font-normal text-muted-foreground">2025.08 – 2026.10</span>
      </p>
      <p className="prose-ko mt-5 text-foreground">{candidIntro.company}</p>
      <p className="prose-ko mt-3 text-muted-foreground">{candidIntro.usage}</p>
    </header>

    <div className="mt-12 space-y-6 md:mt-16 md:space-y-8">
      {candidProjects.map((project, i) => (
        <ProjectCard key={project.id} project={project} index={i} />
      ))}
    </div>
  </div>
);
