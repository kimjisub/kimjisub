import React from 'react';

export interface TimeLine {
  year: number | null;
  title: React.ReactNode;
  content: React.ReactNode;
}
export interface TimeLineProps {
  list: TimeLine[];
}

export default function TimeLineView({ list }: TimeLineProps) {
  return (
    <div className="mx-auto p-20 max-w-4xl">
      <p>Career</p>
      <p>저는 이러한 길을 걸어왔어요.</p>
      <div className="mx-auto">
        {list.map((data, i) => (
          <div key={i.toString()} className="flex">
            <div className="min-w-15 w-15 text-right">
              <p>{data.year}</p>
            </div>
            <div className="relative mx-6">
              <div className="absolute w-0.5 bg-gray-300 h-full" />
              <div className="absolute w-3.5 h-3.5 bg-orange-400 rounded-full border-0 border-orange-400 opacity-25 -left-1.5 mt-1.5" />
              <div className="absolute w-1 h-1 bg-white rounded-full border-2 border-orange-400 -left-1.5 mt-2" />
            </div>
            <div className="pb-4">
              <p>{data.title}</p>
              <p>{data.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
