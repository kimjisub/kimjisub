import Image from 'next/image';

import { Section } from './Section';

interface Activity {
  date: string;
  type: 'Video/Talk' | 'Interview' | 'Press' | 'Post' | 'Publication';
  title: string;
  description: string;
  url: string;
  source: string;
  thumbnail: string;
}

const activities: Activity[] = [
  {
    date: '2026',
    type: 'Publication',
    title: 'An AIoT Framework for Real-Time HVAC Optimization Using Multimodal Sensing and Vision-Based Clothing-Skin Analysis',
    description: 'AIoT 기반 실시간 HVAC 최적화 프레임워크 논문',
    url: 'https://ieeexplore.ieee.org/abstract/document/11416246',
    source: 'IEEE Xplore',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
  },
  {
    date: '2025.12',
    type: 'Interview',
    title: '1,000만 다운로드 앱을 개발한 중학생',
    description: '이제는 기술로 채용의 운을 줄입니다',
    url: 'https://teamcandid.kr/blog/student-developer-unipad',
    source: 'Candid Blog',
    thumbnail:
      'https://source.inblog.dev/featured_image/2025-12-15T09:17:36.135Z-68222d71-4903-4512-accc-6b4463a8b2e0',
  },
  {
    date: '2025.08',
    type: 'Video/Talk',
    title: '제가 요즘 제일 재미있게 하고 있는 일',
    description: '을 소개합니다',
    url: 'https://www.youtube.com/watch?v=kWjI-JJnI-4',
    source: 'YouTube',
    thumbnail: 'https://i.ytimg.com/vi/kWjI-JJnI-4/maxresdefault.jpg',
  },
  {
    date: '2019.12',
    type: 'Video/Talk',
    title: 'SW교육 이야기 — 학교, 미래를 품다',
    description: 'EBS 2TV 방영 · 0:42부터 출연',
    url: 'https://www.ebs.co.kr/tv/show?prodId=132230&lectId=20200544',
    source: 'EBS',
    thumbnail:
      'https://static.ebs.co.kr/images/public/2019/12/16/13/15/11/290bd60d-3787-43e8-8896-3ac1d576e9f5.jpg',
  },
  {
    date: '2019.10',
    type: 'Video/Talk',
    title: '청소년 CEO에 도전하다',
    description: 'KTV 국민방송 · 4:50부터 출연',
    url: 'https://www.ktv.go.kr/program/home/PG2180041D/content/565035',
    source: 'KTV',
    thumbnail: 'https://www.ktv.go.kr/media/unit/unit/fixed_image/zk3FyQhryD.jpg',
  },
  {
    date: '2019.06',
    type: 'Press',
    title: '10대 소년의 유의미한 성공스토리',
    description: '유니패드 김지섭 대표',
    url: 'https://www.issuemaker.kr/news/articleView.html?idxno=26080',
    source: '이슈메이커',
    thumbnail:
      'http://www.issuemaker.kr/news/thumbnail/201906/26080_17291_4421_v150.jpg',
  },
];

const typeLabel: Record<Activity['type'], string> = {
  'Video/Talk': '발표',
  Interview: '인터뷰',
  Press: '기사',
  Post: '게시글',
  Publication: '논문',
};

export const ActivitiesSection = () => {
  return (
    <Section id="activities" title="Activities">
      <ul className="divide-y divide-border border-y border-border">
        {activities.map((activity) => (
          <li key={activity.url}>
            <a
              href={activity.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid gap-x-6 gap-y-2 py-4 sm:grid-cols-[9rem_minmax(0,1fr)_auto]"
            >
              <div className="relative aspect-[16/10] w-36 overflow-hidden rounded-lg bg-muted outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10">
                <Image src={activity.thumbnail} alt="" fill sizes="144px" className="object-cover" unoptimized />
              </div>
              <div className="min-w-0">
                <p className="mb-1 text-sm tabular-nums text-muted-foreground">{activity.date}</p>
                <h3 className="font-medium leading-snug text-foreground underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-150 group-hover:decoration-border-strong">
                  {activity.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{activity.description}</p>
              </div>
              <p className="text-sm text-muted-foreground whitespace-nowrap sm:pt-0.5 sm:text-right">
                {typeLabel[activity.type]} · {activity.source}
                <span aria-hidden="true"> ↗</span>
              </p>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
};
