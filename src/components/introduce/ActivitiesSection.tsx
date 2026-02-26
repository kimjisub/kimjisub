'use client';

import Image from 'next/image';
import { ExternalLink, Linkedin, Newspaper, Play, UserRound } from 'lucide-react';

import { SectionReveal, SectionRevealItem } from '@/components/SectionReveal';

interface Activity {
  date: string;
  type: 'Video/Talk' | 'Interview' | 'Press' | 'Post';
  title: string;
  url: string;
  source: string;
  thumbnail: string;
}

const activities: Activity[] = [
  {
    date: '2025.12',
    type: 'Interview',
    title: '1,000만 다운로드 앱을 개발한 중학생 - 이제는 기술로 채용의 운을 줄입니다',
    url: 'https://teamcandid.kr/blog/student-developer-unipad',
    source: 'Candid Blog',
    thumbnail:
      'https://source.inblog.dev/featured_image/2025-12-15T09:17:36.135Z-68222d71-4903-4512-accc-6b4463a8b2e0',
  },
  {
    date: '2025.08',
    type: 'Video/Talk',
    title: '제가 요즘 제일 재미있게 하고 있는 일을 소개합니다',
    url: 'https://www.youtube.com/watch?v=kWjI-JJnI-4',
    source: 'YouTube',
    thumbnail: 'https://i.ytimg.com/vi/kWjI-JJnI-4/maxresdefault.jpg',
  },
  {
    date: '2024',
    type: 'Post',
    title: 'LinkedIn Activity',
    url: 'https://www.linkedin.com/feed/update/urn:li:activity:7132029531871182848/',
    source: 'LinkedIn',
    thumbnail:
      'https://media.licdn.com/dms/image/v2/D5622AQEBMQ769zk-aA/feedshare-shrink_800/feedshare-shrink_800/0/1700408346046?e=2147483647&v=beta&t=bxAgXb4yOrro09Fi1Baa3pbW2H1GGKck7Biu6EEaKLc',
  },
  {
    date: '2019.06',
    type: 'Press',
    title: '10대 소년의 유의미한 성공스토리 - 유니패드 김지섭 대표',
    url: 'https://www.issuemaker.kr/news/articleView.html?idxno=26080',
    source: '이슈메이커',
    thumbnail:
      'http://www.issuemaker.kr/news/thumbnail/201906/26080_17291_4421_v150.jpg',
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

        <SectionReveal stagger staggerDelay={0.12} className="space-y-4">
          {activities.map((activity) => (
            <SectionRevealItem key={activity.url}>
              <a
                href={activity.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex gap-4 md:gap-6 p-3 md:p-4 -mx-3 md:-mx-4 rounded-xl transition-all hover:bg-card/60 hover:shadow-sm"
              >
                {/* Thumbnail */}
                <div className="relative w-24 h-16 md:w-40 md:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={activity.thumbnail}
                    alt={activity.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 96px, 160px"
                    unoptimized
                  />
                  {/* Play overlay for video */}
                  {activity.type === 'Video/Talk' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                        <Play className="w-4 h-4 text-foreground fill-foreground ml-0.5" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-muted-foreground group-hover:text-accent transition-colors">
                      {typeIcon[activity.type]}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {activity.source}
                    </span>
                    <span className="text-xs text-muted-foreground/60">
                      {activity.date}
                    </span>
                  </div>

                  <p className="text-sm md:text-base text-foreground group-hover:text-accent transition-colors leading-snug line-clamp-2">
                    {activity.title}
                  </p>
                </div>

                {/* External link icon */}
                <ExternalLink className="w-4 h-4 mt-1 flex-shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hidden md:block" />
              </a>
            </SectionRevealItem>
          ))}
        </SectionReveal>
      </div>
    </section>
  );
};
