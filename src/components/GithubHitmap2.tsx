import { addDays, format } from 'date-fns';

interface GitHubHitmapProps {
	data: (number | null)[];
	fromDate: Date;
}

const GitHubHitmap2: React.FC<GitHubHitmapProps> = ({ data, fromDate }) => {
	// 커밋 수에 따라 색상의 밝기를 결정하는 함수
	const getColor = (count: number) => {
		return {
			0: 'bg-gray-200',
			1: 'bg-[#9be9a8]',
			2: 'bg-[#40c463]',
			3: 'bg-[#30a14e]',
			4: 'bg-[#216e39]',
		}[count];
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

		const weekStartDate = addDays(fromDate, rowIndex * 7);
		const prevWeekStartDate = addDays(weekStartDate, -7);

		const monthLabel =
			rowIndex === 0 ||
			prevWeekStartDate.getMonth() !== weekStartDate.getMonth()
				? format(weekStartDate, 'MMM')
				: '';

		const yearLabel =
			rowIndex === 0 ||
			prevWeekStartDate.getFullYear() !== weekStartDate.getFullYear()
				? format(weekStartDate, 'yyyy')
				: '';

		return (
			<div key={rowIndex} className="flex flex-col">
				{/* <p className="h-5 text-sm w-0">{monthLabel}</p> */}
				{weekData.map((count, index) => {
					const date = addDays(fromDate, rowIndex * 7 + index);
					const formattedDate = format(date, 'yyyy-MM-dd');
					return count !== null ? (
						<div
							key={formattedDate}
							title={`${formattedDate}: ${count} commits`}
							className={`w-2.5 h-2.5 m-[2px] rounded-sm ${getColor(
								count,
							)} text-[4px]`}>
							{/* {formattedDate}
						<br />
						{count} */}
						</div>
					) : (
						<div
							key={formattedDate}
							title={`${formattedDate}: ${count} commits`}
							className={`w-2.5 h-2.5 m-[2px] rounded-sm text-[4px]`}>
							{/* {formattedDate}
						<br />
						{count} */}
						</div>
					);
				})}
				{/* <p className="h-5 text-sm w-0">{yearLabel}</p> */}
			</div>
		);
	});

	return <div className="flex">{tiles}</div>;
};

export default GitHubHitmap2;
