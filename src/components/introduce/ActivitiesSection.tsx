'use client';

import { ExternalLink, Linkedin, Newspaper, Play, UserRound } from 'lucide-react';

import { SectionReveal, SectionRevealItem } from '@/components/SectionReveal';

interface Activity {
  date: string;
  type: 'Video/Talk' | 'Interview' | 'Press' | 'Post';
  title: string;
  url: string;
  source: string;
}

const activities: Activity[] = [
  {
    date: '2025.12',
    type: 'Interview',
    title: '1,000만 다운로드 앱을 개발한 중학생 - 이제는 기술로 채용의 운을 줄입니다',
    url: 'https://teamcandid.kr/blog/student-developer-unipad',
    source: 'Candid Blog',
  },
  {
    date: '2025.08',
    type: 'Video/Talk',
    title: '제가 요즘 제일 재미있게 하고 있는 일을 소개합니다',
    url: 'https://www.youtube.com/watch?v=kWjI-JJnI-4',
    source: 'YouTube',
  },
  {
    date: '2024',
    type: 'Post',
    title: 'LinkedIn Activity',
    url: 'https://www.linkedin.com/feed/update/urn:li:activity:7132029531871182848/',
    source: 'LinkedIn',
  },
  {
    date: '2019.06',
    type: 'Press',
    title: '10대 소년의 유의미한 성공스토리 - 유니패드 김지섭 대표',
    url: 'https://www.issuemaker.kr/news/articleView.html?idxno=26080',
    source: '이슈메이커',
  },
];

const typeIcon: Record<Activity['type'], React.ReactNode> = {
  'Video/Talk': <Play className="w-4 h-4" />,
  Interview: <UserRound className="w-4 h-4" />,
  Press: <Newspaper className="w-4 h-4" />,
  Post: <Linkedin className="w-4 h-4" />,
};

export const ActivitiesSection = () => {
  return (
    <section className="py-12 md:py-24 border-t border-border">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <SectionReveal>
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-12 italic">
            Activities
          </h2>
        </SectionReveal>

        <SectionReveal stagger staggerDelay={0.12} className="space-y-6">
          {activities.map((activity) => (
            <SectionRevealItem key={activity.url}>
              <a
                href={activity.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 p-4 -mx-4 rounded-lg transition-colors hover:bg-card/60"
              >
                <span className="mt-1 flex-shrink-0 text-muted-foreground group-hover:text-accent transition-colors">
                  {typeIcon[activity.type]}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                    <p className="text-foreground group-hover:text-accent transition-colors leading-snug">
                      {activity.title}
                    </p>
                    <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                      {activity.date}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.source}
                  </p>
                </div>

                <ExternalLink className="w-3.5 h-3.5 mt-1.5 flex-shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </SectionRevealItem>
          ))}
        </SectionReveal>
      </div>
    </section>
  );
};
