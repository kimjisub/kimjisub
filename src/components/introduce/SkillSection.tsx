import React from 'react';
import Link from 'next/link';

import { SkillIconWrapper } from './SkillIconWrapper';

import { getSkills } from '@/api/notion/skills';
import { IconSlugView } from '@/components/IconSlugView';
import { AnimatedGridItem, AnimatedSection,AnimatedTitle } from '@/components/motion/AnimatedSection';

export default async function SkillsSection() {
  const { skills } = await getSkills();

  return (
    <section className="py-24 border-t border-border">
      <div className="max-w-4xl mx-auto px-6">
        <AnimatedTitle className="font-serif text-2xl md:text-3xl text-foreground mb-12 italic">
          Stack
        </AnimatedTitle>

        <div className="flex flex-wrap gap-2">
          {skills.slice(0, 40).map((skill, index) => (
            <AnimatedGridItem key={skill.id} index={index}>
              <Link href={`/skills/${skill.id}`}>
                <SkillIconWrapper>
                  <IconSlugView
                    className="w-8 h-8"
                    title={skill.title}
                    slug={skill.slug}
                    color={skill.iconColor}
                  />
                </SkillIconWrapper>
              </Link>
            </AnimatedGridItem>
          ))}
        </div>

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
