import React from 'react';

import GitHubHitmap from '../GithubHitmap';
import {AnimatedSection, AnimatedTitle } from '../motion/AnimatedSection';

import { getYearlyGithubContributions } from '@/api/github';

export default async function GithubSection() {
  const startYear = 2018;
  const endYear = new Date().getFullYear();
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
  const contributions = await Promise.all(
    years.map((year) => getYearlyGithubContributions('kimjisub', year))
  );
  
  return (
    <section className="py-24 border-t border-border bg-card/30">
      <div className="max-w-4xl mx-auto px-6">
        <AnimatedTitle className="font-serif text-2xl md:text-3xl text-foreground mb-12 italic">
          Activity
        </AnimatedTitle>

        <AnimatedSection delay={0.1}>
          <div className="flex flex-col items-center gap-y-2">
            {contributions.map((contribution, index) => (
              <div key={contribution.from.toString()} className="flex flex-row items-center w-fit">
                <span className="text-xs text-muted-foreground w-12 text-right mr-3 tabular-nums">
                  {years[index]}
                </span>
                <GitHubHitmap
                  data={contribution.data}
                  fromDate={contribution.from}
                />
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
