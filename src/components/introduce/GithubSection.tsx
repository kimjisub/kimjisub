import React from 'react';
import { Separator } from '@radix-ui/themes';

import GitHubHitmap2 from '../GithubHitmap2';

import { getYearlyGithubContributions } from '@/api/github';
import { Title } from '@/components/Title';

export default async function GithubSection() {
  const contributions = await Promise.all([
    getYearlyGithubContributions('kimjisub', 2018),
    getYearlyGithubContributions('kimjisub', 2019),
    getYearlyGithubContributions('kimjisub', 2020),
    getYearlyGithubContributions('kimjisub', 2021),
    getYearlyGithubContributions('kimjisub', 2022),
    getYearlyGithubContributions('kimjisub', 2023),
    getYearlyGithubContributions('kimjisub', 2024),
  ]);
  return (
    <section className="justify-center items-center">
      <div className="w-full max-w-5xl mx-auto px-4 items-center">
        <Title title="Github" subTitle="개발자로 살아왔던 나날들입니다." />
        <div className="w-fit justify-self-center">
          {contributions.map((contribution, index) => (
            <>
              <div>
                <GitHubHitmap2
                  key={contribution.from.toString()}
                  data={contribution.data}
                  fromDate={contribution.from}
                />
              </div>
              {index < contributions.length - 1 && (
                <Separator my="3" size="4" />
              )}
            </>
          ))}
        </div>
      </div>
    </section>
  );
}
