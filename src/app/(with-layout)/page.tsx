import { Suspense } from 'react';

import { AboutSection } from '@/components/introduce/AboutSection';
import { ActivitiesSection } from '@/components/introduce/ActivitiesSection';
import { BackgroundSection } from '@/components/introduce/BackgroundSection';
import BlogPreviewSection from '@/components/introduce/BlogPreviewSection';
import { ChatSection } from '@/components/introduce/ChatSection';
import { ContactSection } from '@/components/introduce/ContactSection';
import GithubSection from '@/components/introduce/GithubSection';
import { HeroSection } from '@/components/introduce/HeroSection';
import { TestimonialsSection } from '@/components/introduce/TestimonialsSection';
import ProjectSection from '@/components/introduce/ProjectSection';
import SkillsSection from '@/components/introduce/SkillSection';
import { WorkSection } from '@/components/introduce/WorkSection';
import ScrollSpyNav from '@/components/ScrollSpyNav';

export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <ScrollSpyNav />
      <HeroSection />
      <AboutSection />
      <ChatSection />
      <WorkSection />
      <ProjectSection />
      <BackgroundSection />
      <ActivitiesSection />
      <BlogPreviewSection />
      <TestimonialsSection />
      <SkillsSection />
      {/* GitHub API 응답을 기다리는 동안 나머지 페이지가 먼저 보이도록 한다 */}
      <Suspense fallback={null}>
        <GithubSection />
      </Suspense>
      <ContactSection />
    </>
  );
}
