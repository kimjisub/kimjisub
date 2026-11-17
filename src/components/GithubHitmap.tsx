import { addDays, format, isAfter, startOfDay } from 'date-fns';

interface GitHubHitmapProps {
  data: (number | null)[];
  fromDate: Date;
}

const GitHubHitmap: React.FC<GitHubHitmapProps> = ({ data, fromDate }) => {
  // 기여 단계가 높을수록 배경과 대비가 커지도록, 밝은 테마와 어두운 테마의 색 순서를 반대로 둔다
  const getColor = (level: number | null): string => {
    if (level === null || level === undefined) return '';
    const colorMap: Record<number, string> = {
      0: 'bg-secondary',
      1: 'bg-[#9be9a8] dark:bg-[#0e4429]',
      2: 'bg-[#40c463] dark:bg-[#006d32]',
      3: 'bg-[#30a14e] dark:bg-[#26a641]',
      4: 'bg-[#216e39] dark:bg-[#39d353]',
    };
    return colorMap[level] ?? '';
  };

  const beforeMarginDates = fromDate.getDay();

  const dataAddedBeforeMargin = [
    ...Array<number | null>(beforeMarginDates).fill(null),
    ...data,
  ];

  // 각 타일을 7칸짜리 세로열로 배치
  const rows = Array.from({
    length: Math.ceil(dataAddedBeforeMargin.length / 7),
  });
  const tiles = rows.map((_, rowIndex) => {
    const weekData = dataAddedBeforeMargin.slice(
      rowIndex * 7,
      (rowIndex + 1) * 7,
    );

    return (
      <div key={rowIndex} className="flex flex-col">
        {weekData.map((level, index) => {
          const date = addDays(fromDate, rowIndex * 7 + index);
          const formattedDate = format(date, 'yyyy-MM-dd');
          const isFuture = isAfter(startOfDay(date), startOfDay(new Date()));
          return (
            <div
              key={formattedDate}
              title={`${formattedDate}`}
              className={`w-2.5 h-2.5 m-[1.5px] rounded-sm ${isFuture ? 'bg-transparent' : getColor(level)} text-[4px]`}
            />
          );
        })}
      </div>
    );
  });

  return <div className="flex">{tiles}</div>;
};

export default GitHubHitmap;
