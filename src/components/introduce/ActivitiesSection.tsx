'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ExternalLink, Linkedin, Newspaper, Play, UserRound } from 'lucide-react';

interface Activity {
  date: string;
  type: 'Video/Talk' | 'Interview' | 'Press' | 'Post';
  title: string;
  description: string;
  url: string;
  source: string;
  thumbnail: string;
}

const activities: Activity[] = [
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
    date: '2024',
    type: 'Post',
    title: 'LinkedIn Activity',
    description: 'Professional network post',
    url: 'https://www.linkedin.com/feed/update/urn:li:activity:7132029531871182848/',
    source: 'LinkedIn',
    thumbnail:
      'https://media.licdn.com/dms/image/v2/D5622AQEBMQ769zk-aA/feedshare-shrink_800/feedshare-shrink_800/0/1700408346046?e=2147483647&v=beta&t=bxAgXb4yOrro09Fi1Baa3pbW2H1GGKck7Biu6EEaKLc',
  },
  {
    date: '2019.12',
    type: 'Video/Talk',
    title: 'SW교육 이야기 — 학교, 미래를 품다',
    description: 'EBS 2TV 방영',
    url: 'https://www.ebs.co.kr/tv/show?prodId=132230&lectId=20200544',
    source: 'EBS',
    thumbnail:
      'https://static.ebs.co.kr/images/public/2019/12/16/13/15/11/290bd60d-3787-43e8-8896-3ac1d576e9f5.jpg',
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

const typeIcon: Record<Activity['type'], React.ReactNode> = {
  'Video/Talk': <Play className="w-3.5 h-3.5" />,
  Interview: <UserRound className="w-3.5 h-3.5" />,
  Press: <Newspaper className="w-3.5 h-3.5" />,
  Post: <Linkedin className="w-3.5 h-3.5" />,
};

const typeColor: Record<Activity['type'], string> = {
  'Video/Talk': 'bg-red-500/10 text-red-400 border-red-500/20',
  Interview: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Press: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Post: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
};

/* ─── Activity Card (unified design, all 4 same treatment) ─── */
function ActivityCard({ activity, index }: { activity: Activity; index: number }) {
  return (
    <motion.a
      href={activity.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block overflow-hidden rounded-2xl border border-border bg-card hover:border-border/80 transition-all duration-500 hover:shadow-xl hover:shadow-black/10"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={activity.thumbnail}
          alt={activity.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
          unoptimized
        />

        {/* Gradient overlay — bottom heavy for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5" />

        {/* Play button for video */}
        {activity.type === 'Video/Talk' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/25 shadow-2xl group-hover:bg-white/25 transition-colors duration-300"
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <Play className="w-6 h-6 text-white fill-white ml-0.5" />
            </motion.div>
          </div>
        )}

        {/* Type badge — top left */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border backdrop-blur-sm ${typeColor[activity.type]}`}
          >
            {typeIcon[activity.type]}
            {activity.source}
          </span>
        </div>

        {/* External link — top right, on hover */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-7 h-7 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <ExternalLink className="w-3 h-3 text-white" />
          </div>
        </div>

        {/* Text content — bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
          <p className="text-[11px] text-white/50 font-medium tracking-wider uppercase mb-1.5">
            {activity.date}
          </p>
          <h3 className="text-base md:text-lg font-semibold text-white leading-snug group-hover:text-white/90 transition-colors">
            {activity.title}
          </h3>
          <p className="text-sm text-white/50 mt-0.5">
            {activity.description}
          </p>
        </div>
      </div>
    </motion.a>
  );
}

/* ─── Main Section ─── */
export const ActivitiesSection = () => {
  return (
    <div className="py-12 md:py-24 border-t border-border">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-2 italic">
            Activities
          </h2>
          <p className="text-muted-foreground text-sm mb-10">
            미디어 출연 · 인터뷰 · 발표
          </p>
        </motion.div>

        {/* Bento Grid — last odd item spans full width */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activities.map((activity, i) => {
            const isLastOdd =
              activities.length % 2 === 1 && i === activities.length - 1;
            return (
              <div key={activity.url} className={isLastOdd ? 'md:col-span-2' : ''}>
                <ActivityCard activity={activity} index={i} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
