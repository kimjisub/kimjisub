import Link from 'next/link';
import React from 'react';

import { getSkills } from '@/api/notion/skills';
import { IconSlugView } from '@/components/IconSlugView';

export default async function SkillsSection() {
  const { skills } = await getSkills();

  return (
    <section className="py-24 border-t border-border">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-12 italic">
          Stack
        </h2>

        <div className="flex flex-wrap gap-2">
          {skills.slice(0, 40).map((skill) => (
            <Link 
              href={`/skills/${skill.id}`} 
              key={skill.id}
            >
              <div className="p-2.5 rounded-lg bg-card border border-border hover:border-foreground/30 transition-colors">
                <IconSlugView
                  className="w-8 h-8"
                  title={skill.title}
                  slug={skill.slug}
                  color={skill.iconColor}
                />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/skills"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View all →
          </Link>
        </div>
      </div>
    </section>
  );
}
