'use client';

import { SectionReveal, SectionRevealItem } from '@/components/SectionReveal';

export const BackgroundSection = () => {
  return (
    <section className="py-12 md:py-24 border-t border-border">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <SectionReveal>
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-12 italic">
            Background
          </h2>
        </SectionReveal>

        <SectionReveal stagger staggerDelay={0.15} className="grid md:grid-cols-2 gap-12">
          <SectionRevealItem>
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
          </SectionRevealItem>

          <SectionRevealItem>
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
          </SectionRevealItem>
        </SectionReveal>
      </div>
    </section>
  );
};
