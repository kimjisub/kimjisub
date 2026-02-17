import { AboutSection } from '@/components/introduce/AboutSection';
import { AboutBentoSection } from '@/components/introduce/AboutBentoSection';
import { BackgroundSection } from '@/components/introduce/BackgroundSection';
import BlogPreviewSection from '@/components/introduce/BlogPreviewSection';
import { ContactSectionAnimated } from '@/components/introduce/ContactSectionAnimated';
import GithubSection from '@/components/introduce/GithubSection';
import { HeroSection } from '@/components/introduce/HeroSection';
import SkillsSection from '@/components/introduce/SkillSection';
import { WorkSection } from '@/components/introduce/WorkSection';

export const revalidate = 3600;

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <HeroSection />
      <AboutBentoSection />
      <AboutSection />
      <WorkSection />
      <BackgroundSection />
      <GithubSection />
      <SkillsSection />
      <BlogPreviewSection />
      <ContactSectionAnimated />
    </main>
  );
}
