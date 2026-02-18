import React from 'react';

import GitHubHitmap from '../GithubHitmap';
import GitHubLanguageStats from '../GitHubLanguageStats';
import { AnimatedNumber } from '../motion/AnimatedNumber';
import { AnimatedSection, AnimatedTitle } from '../motion/AnimatedSection';

import { getGitHubLanguageStats,getGitHubStats, getYearlyGithubContributions } from '@/api/github';

interface StatCardProps {
  value: number;
  label: string;
  suffix?: string;
}

function StatCard({ value, label, suffix = '' }: StatCardProps) {
  return (
    <div className="flex flex-col items-center p-4 bg-card rounded-lg border border-border">
      <AnimatedNumber
        value={value}
        suffix={suffix}
        className="text-3xl md:text-4xl font-bold text-foreground tabular-nums"
        duration={2.5}
      />
      <span className="text-sm text-muted-foreground mt-1">{label}</span>
    </div>
  );
}

export default async function GithubSection() {
  const startYear = 2018;
  const endYear = new Date().getFullYear();
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
  
  const [contributions, stats, languages] = await Promise.all([
    Promise.all(years.map((year) => getYearlyGithubContributions('kimjisub', year))),
    getGitHubStats('kimjisub'),
    getGitHubLanguageStats('kimjisub'),
  ]);
  
  return (
    <section className="py-12 md:py-24 border-t border-border bg-card/30">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <AnimatedTitle className="font-serif text-2xl md:text-3xl text-foreground mb-12 italic">
          Activity
        </AnimatedTitle>

        {/* GitHub Stats */}
        <AnimatedSection delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <StatCard value={stats.totalContributions} label="Contributions" suffix="+" />
            <StatCard value={stats.repositories} label="Repositories" />
            <StatCard value={stats.followers} label="Followers" />
            <StatCard value={stats.following} label="Following" />
          </div>
        </AnimatedSection>

        {/* Contribution Heatmap - 최신 년도가 위로 */}
        <AnimatedSection delay={0.2}>
          <div className="flex flex-col items-center gap-y-2">
            {[...contributions].reverse().map((contribution, index) => (
              <div key={contribution.from.toString()} className="flex flex-row items-center w-fit">
                <span className="text-xs text-muted-foreground w-12 text-right mr-3 tabular-nums">
                  {years[years.length - 1 - index]}
                </span>
                <GitHubHitmap
                  data={contribution.data}
                  fromDate={contribution.from}
                />
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Language Stats */}
        {languages.length > 0 && (
          <AnimatedSection delay={0.3}>
            <div className="mt-12">
              <p className="text-sm text-muted-foreground mb-4 font-medium tracking-wide uppercase">
                Most Used Languages
              </p>
              <GitHubLanguageStats languages={languages} />
            </div>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
}
