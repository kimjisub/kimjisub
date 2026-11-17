import React from 'react';

import GitHubHitmap from '../GithubHitmap';
import GitHubLanguageStats from '../GitHubLanguageStats';

import { Section } from './Section';

import { getGitHubLanguageStats, getGitHubStats, getYearlyGithubContributions } from '@/api/github';

const HEATMAP_START_YEAR = 2018;

export default async function GithubSection() {
  const endYear = new Date().getFullYear();
  const years = Array.from({ length: endYear - HEATMAP_START_YEAR + 1 }, (_, i) => endYear - i);

  const [contributions, stats, languages] = await Promise.all([
    Promise.all(years.map((year) => getYearlyGithubContributions('kimjisub', year))),
    getGitHubStats('kimjisub'),
    getGitHubLanguageStats('kimjisub'),
  ]);

  const statItems = [
    { label: 'Contributions', value: `${stats.totalContributions.toLocaleString()}+` },
    { label: 'Repositories', value: stats.repositories.toLocaleString() },
    { label: 'Followers', value: stats.followers.toLocaleString() },
    { label: 'Following', value: stats.following.toLocaleString() },
  ];

  return (
    <Section
      id="github"
      title="GitHub"
      action={
        <a href="https://github.com/kimjisub" target="_blank" rel="noopener noreferrer" className="link text-muted-foreground">
          @kimjisub<span aria-hidden="true"> ↗</span>
        </a>
      }
    >
      <dl className="flex flex-wrap gap-x-10 gap-y-4">
        {statItems.map(({ label, value }) => (
          <div key={label}>
            <dd className="text-2xl font-medium tabular-nums text-foreground">{value}</dd>
            <dt className="mt-0.5 text-sm text-muted-foreground">{label}</dt>
          </div>
        ))}
      </dl>

      {/* 연도별 기여 히트맵. 폭이 좁으면 잘리지 않고 가로로 밀어 볼 수 있다 */}
      <div className="mt-10 space-y-2 overflow-x-auto pb-2">
        {contributions.map((contribution, index) => (
          <div key={years[index]} className="flex w-fit items-center">
            <span className="mr-3 w-10 text-xs tabular-nums text-muted-foreground">{years[index]}</span>
            <GitHubHitmap data={contribution.data} fromDate={contribution.from} />
          </div>
        ))}
      </div>

      {languages.length > 0 && (
        <div className="mt-10">
          <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.05em] text-muted-foreground">
            Most used languages
          </h3>
          <GitHubLanguageStats languages={languages} />
        </div>
      )}
    </Section>
  );
}
