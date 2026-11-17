import { AboutSection } from '@/components/introduce/AboutSection';
import { ActivitiesSection } from '@/components/introduce/ActivitiesSection';
import { BackgroundSection } from '@/components/introduce/BackgroundSection';
import BlogPreviewSection from '@/components/introduce/BlogPreviewSection';
import { FlowSection } from '@/components/introduce/FlowSection';
import { ContactSection } from '@/components/introduce/ContactSection';
import { HeroSection } from '@/components/introduce/HeroSection';
import ProjectSection from '@/components/introduce/ProjectSection';
import { TestimonialsSection } from '@/components/introduce/TestimonialsSection';
import { WorkSection } from '@/components/introduce/WorkSection';
import ScrollSpyNav from '@/components/ScrollSpyNav';

export const revalidate = 3600;

/**
 * 홈은 Hero -> Path(지나온 길) -> About -> Work -> Projects -> Background -> Activities -> Blog -> Contact 한 줄기로 둔다.
 * Ask(ChatSection), Stack(SkillSection), GitHub(GithubSection) 컴포넌트는 남겨 두고 홈에서만 뺐다.
 * 추천사는 하나라도 생기면 Contact 앞에 나타난다.
 */
export default function Home() {
  return (
    <>
      <ScrollSpyNav />
      <HeroSection />
      <FlowSection />
      <AboutSection />
      <WorkSection />
      <ProjectSection />
      <BackgroundSection />
      <ActivitiesSection />
      <BlogPreviewSection />
      <TestimonialsSection hideWhenEmpty />
      <ContactSection />
    </>
  )
}
