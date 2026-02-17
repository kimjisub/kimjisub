import { AboutBentoSection } from '@/components/introduce/AboutBentoSection';
import { AboutSection } from '@/components/introduce/AboutSection';
import { BackgroundSection } from '@/components/introduce/BackgroundSection';
import BlogPreviewSection from '@/components/introduce/BlogPreviewSection';
import { ContactSectionAnimated } from '@/components/introduce/ContactSectionAnimated';
import GithubSection from '@/components/introduce/GithubSection';
import { HeroSection } from '@/components/introduce/HeroSection';
import SkillsSection from '@/components/introduce/SkillSection';
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
        <GithubSection />
      </section>

      <section id="skills">
        <SkillsSection />
      </section>

      <section id="blog">
        <BlogPreviewSection />
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
