import React from 'react';
import Link from 'next/link';

import { getSkills } from '@/api/notion/skills';
import { AnimatedSection } from '@/components/motion/AnimatedSection';
import { SkillsRadarChart } from '@/components/SkillsRadarChart';
import { SkillsStaggerGrid } from '@/components/SkillsStaggerGrid';
import { SectionReveal } from '@/components/SectionReveal';

export default async function SkillsSection() {
  const { skills } = await getSkills();

  return (
    <section className="py-24 border-t border-border">
      <div className="max-w-4xl mx-auto px-6">
        <SectionReveal>
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-12 italic">
            Stack
          </h2>
        </SectionReveal>

        {/* Radar chart */}
        <div className="mb-12 flex justify-center">
          <SkillsRadarChart skills={skills} size={300} />
        </div>

        {/* Icon grid — staggerChildren on viewport entry */}
        <SkillsStaggerGrid skills={skills.slice(0, 40)} />

        <AnimatedSection delay={0.4} className="mt-8">
          <Link
            href="/skills"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View all →
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
