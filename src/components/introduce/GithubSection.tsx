import React from 'react';

import GitHubHitmap from '../GithubHitmap';

import { getYearlyGithubContributions } from '@/api/github';
import { Title } from '@/components/Title';

export default async function GithubSection() {
  const startYear = 2018;
  const endYear = new Date().getFullYear();
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
  const contributions = await Promise.all(
    years.map((year) => getYearlyGithubContributions('kimjisub', year))
  );
  return (
    <section className="w-full bg-white py-12">
      <div className="w-full max-w-5xl mx-auto px-2 items-center">
        <Title title="Github" subTitle="개발자로 살아왔던 나날들입니다." />

        <div className="flex flex-col items-center justify-center gap-y-2 mt-6">
          {contributions.map((contribution, index) => (
            <div key={contribution.from.toString()} className="flex flex-row items-center w-fit">
              <span className="font-semibold text-xs text-slate-500 w-12 text-right mr-2 md:w-16 md:text-sm md:mr-4 select-none">
                {years[index]}
              </span>
              <GitHubHitmap
                data={contribution.data}
                fromDate={contribution.from}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <a
            href="https://github.com/kimjisub"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2 rounded-lg bg-slate-900 text-white font-semibold shadow hover:bg-slate-700 transition-colors duration-150"
          >
            GitHub 프로필 바로가기
          </a>
        </div>
      </div>
    </section>
  );
}
