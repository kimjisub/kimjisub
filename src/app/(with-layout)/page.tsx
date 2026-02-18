import { Suspense } from 'react';

import { AboutBentoSection } from '@/components/introduce/AboutBentoSection';
import { AboutSection } from '@/components/introduce/AboutSection';
import { BackgroundSection } from '@/components/introduce/BackgroundSection';
import BlogPreviewSection from '@/components/introduce/BlogPreviewSection';
import { BlogPreviewSectionSkeleton } from '@/components/introduce/BlogPreviewSectionSkeleton';
import { ContactSectionAnimated } from '@/components/introduce/ContactSectionAnimated';
import GithubSection from '@/components/introduce/GithubSection';
import { GithubSectionSkeleton } from '@/components/introduce/GithubSectionSkeleton';
import { HeroSection } from '@/components/introduce/HeroSection';
import SkillsSection from '@/components/introduce/SkillSection';
import { SkillsSectionSkeleton } from '@/components/introduce/SkillsSectionSkeleton';
import { TerminalSection } from '@/components/introduce/TerminalSection';
import { TestimonialsSection } from '@/components/introduce/TestimonialsSection';
import { WorkSection } from '@/components/introduce/WorkSection';
import ScrollSpyNav from '@/components/ScrollSpyNav';

export const revalidate = 3600;

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <ScrollSpyNav />

      <section id="hero">
        <HeroSection />
      </section>

      <section id="about">
        <AboutBentoSection />
        <AboutSection />
      </section>

      <section id="terminal">
        <TerminalSection />
      </section>

      <section id="work">
        <WorkSection />
        <BackgroundSection />
        {/* GitHub 기여도 그래프: 데이터 fetch 중 skeleton 표시 */}
        <Suspense fallback={<GithubSectionSkeleton />}>
          <GithubSection />
        </Suspense>
      </section>

      <section id="skills">
        {/* Skills 섹션: Notion 데이터 fetch 중 skeleton 표시 */}
        <Suspense fallback={<SkillsSectionSkeleton />}>
          <SkillsSection />
        </Suspense>
      </section>

      <section id="blog">
        {/* 블로그 미리보기: 파일 시스템 로딩 중 skeleton 표시 */}
        <Suspense fallback={<BlogPreviewSectionSkeleton />}>
          <BlogPreviewSection />
        </Suspense>
      </section>

      <section id="testimonials">
        <TestimonialsSection />
      </section>

      <section id="contact">
        <ContactSectionAnimated />
      </section>
    </main>
  );
}
