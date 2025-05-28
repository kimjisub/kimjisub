import React, { ReactNode } from 'react';

export interface TimeLineItemProps {
  year?: number | null;
  title: React.ReactNode;
  content: React.ReactNode;
}

export function TimeLineItem({ year, title, content }: TimeLineItemProps) {
  return (
    <li className="relative flex items-center z-10">
      {/* 연도/텍스트 */}
      <div className="w-24 text-right pr-6 flex-shrink-0 flex items-center justify-end h-full min-h-[60px]">
        {year !== null && year !== undefined && (
          <span className="text-base md:text-lg font-semibold text-slate-600 select-none">
            {year}
          </span>
        )}
      </div>
      {/* 타임라인 포인트 */}
      <div className="relative flex flex-col items-center w-6 flex-shrink-0">
        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 border-4 border-white shadow-lg z-10 mt-0.5 mb-0.5" />
      </div>
      {/* 카드 */}
      <div className="ml-8 md:ml-12 flex-1">
        <div className="bg-white/90 rounded-xl shadow-md border border-slate-100 px-6 py-5">
          <div className="font-semibold text-lg text-blue-700 mb-1">{title}</div>
          <div className="text-slate-700 text-base leading-relaxed">{content}</div>
        </div>
      </div>
    </li>
  );
}

export function TimeLine({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {/* 전체 타임라인 세로선 */}
      <div className="absolute left-[6.5rem] top-0 w-1 h-full bg-gradient-to-b from-blue-200 via-violet-200 to-slate-200 rounded-full z-0" />
      <ul className="space-y-10 relative z-10">
        {children}
      </ul>
    </div>
  );
}
