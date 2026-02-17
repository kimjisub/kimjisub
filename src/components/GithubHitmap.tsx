import { addDays, format, isAfter, startOfDay } from 'date-fns';

interface GitHubHitmapProps {
  data: (number | null)[];
  fromDate: Date;
}

const GitHubHitmap: React.FC<GitHubHitmapProps> = ({ data, fromDate }) => {
  // 커밋 수에 따라 색상의 밝기를 결정하는 함수
  const getColor = (level: number | null): string => {
    if (level === null || level === undefined) return '';
    const colorMap: Record<number, string> = {
      0: 'bg-secondary',
      1: 'bg-[#9be9a8]',
      2: 'bg-[#40c463]',
      3: 'bg-[#30a14e]',
      4: 'bg-[#216e39]',
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
              className={`w-2.5 h-2.5 m-[2px] rounded-sm ${isFuture ? 'bg-transparent' : getColor(level)} text-[4px]`}
            />
          );
        })}
      </div>
    );
  });

  return <div className="flex">{tiles}</div>;
};

export default GitHubHitmap;
