import { AboutSection } from '@/components/introduce/AboutSection';
import { BackgroundSection } from '@/components/introduce/BackgroundSection';
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
      <AboutSection />
      <WorkSection />
      <BackgroundSection />
      <GithubSection />
      <SkillsSection />
      <ContactSectionAnimated />
    </main>
  );
}
