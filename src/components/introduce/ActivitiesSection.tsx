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
  featured?: boolean;
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
    featured: true,
  },
  {
    date: '2025.08',
    type: 'Video/Talk',
    title: '제가 요즘 제일 재미있게 하고 있는 일',
    description: '을 소개합니다',
    url: 'https://www.youtube.com/watch?v=kWjI-JJnI-4',
    source: 'YouTube',
    thumbnail: 'https://i.ytimg.com/vi/kWjI-JJnI-4/maxresdefault.jpg',
    featured: true,
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

/* ─── Featured Card (large, hero-style) ─── */
function FeaturedCard({ activity, index }: { activity: Activity; index: number }) {
  return (
    <motion.a
      href={activity.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block overflow-hidden rounded-2xl border border-border bg-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={activity.thumbnail}
          alt={activity.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
          unoptimized
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Play button overlay for video */}
        {activity.type === 'Video/Talk' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-2xl"
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <Play className="w-6 h-6 text-white fill-white ml-0.5" />
            </motion.div>
          </div>
        )}

        {/* Type badge */}
        <div className="absolute top-4 left-4">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${typeColor[activity.type]}`}
          >
            {typeIcon[activity.type]}
            {activity.source}
          </span>
        </div>

        {/* External link indicator */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <ExternalLink className="w-3.5 h-3.5 text-white" />
          </div>
        </div>

        {/* Bottom content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
          <p className="text-xs text-white/60 font-medium tracking-wider uppercase mb-2">
            {activity.date}
          </p>
          <h3 className="text-lg md:text-xl font-semibold text-white leading-snug mb-1 group-hover:text-white/90 transition-colors">
            {activity.title}
          </h3>
          <p className="text-sm text-white/60">
            {activity.description}
          </p>
        </div>
      </div>
    </motion.a>
  );
}

/* ─── Compact Card (smaller, side items) ─── */
function CompactCard({ activity, index }: { activity: Activity; index: number }) {
  return (
    <motion.a
      href={activity.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex gap-4 p-4 rounded-xl border border-border bg-card hover:bg-card/80 transition-all duration-300 hover:border-border/80 hover:shadow-lg hover:shadow-black/5"
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay: 0.2 + index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Thumbnail */}
      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
        <Image
          src={activity.thumbnail}
          alt={activity.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="80px"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${typeColor[activity.type]}`}
          >
            {typeIcon[activity.type]}
            {activity.source}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {activity.date}
          </span>
        </div>
        <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors leading-snug line-clamp-2">
          {activity.title}
        </p>
      </div>

      {/* Arrow */}
      <ExternalLink className="w-4 h-4 flex-shrink-0 text-muted-foreground/40 group-hover:text-accent self-center transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </motion.a>
  );
}

/* ─── Main Section ─── */
export const ActivitiesSection = () => {
  const featured = activities.filter((a) => a.featured);
  const compact = activities.filter((a) => !a.featured);

  return (
    <section className="py-12 md:py-24 border-t border-border">
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

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Featured items — large cards */}
          {featured.map((activity, i) => (
            <FeaturedCard key={activity.url} activity={activity} index={i} />
          ))}
        </div>

        {/* Compact items */}
        {compact.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            {compact.map((activity, i) => (
              <CompactCard key={activity.url} activity={activity} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
