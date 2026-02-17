import React, { ReactNode } from 'react';

export interface TimeLineItemProps {
  year?: number | null;
  title: React.ReactNode;
  content: React.ReactNode;
}

export function TimeLineItem({ year, title, content }: TimeLineItemProps) {
  return (
    <li className="relative flex items-start z-10 group">
      {/* 연도 */}
      <div className="w-20 md:w-24 text-right pr-4 md:pr-6 flex-shrink-0 pt-1">
        {year !== null && year !== undefined && (
          <span className="text-sm md:text-base font-semibold text-muted-foreground font-heading group-hover:text-accent transition-colors duration-300">
            {year}
          </span>
        )}
      </div>
      
      {/* 타임라인 포인트 */}
      <div className="relative flex flex-col items-center w-4 flex-shrink-0 pt-1.5">
        <div className="w-3 h-3 rounded-full bg-accent ring-4 ring-background z-10 group-hover:scale-150 group-hover:ring-accent/30 transition-all duration-300" />
      </div>
      
      {/* 카드 */}
      <div className="ml-4 md:ml-8 flex-1 pb-10">
        <div className="glass-card px-5 py-4 hover:border-accent/50 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg group-hover:shadow-accent/5">
          <h3 className="font-heading font-semibold text-base md:text-lg text-foreground mb-2 group-hover:text-accent transition-colors duration-300">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            {content}
          </p>
        </div>
      </div>
    </li>
  );
}

export function TimeLine({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {/* 타임라인 세로선 */}
      <div className="absolute left-[5.5rem] md:left-[6.5rem] top-0 w-px h-full bg-gradient-to-b from-accent via-border to-transparent z-0" />
      <ul className="relative z-10">
        {children}
      </ul>
    </div>
  );
}
