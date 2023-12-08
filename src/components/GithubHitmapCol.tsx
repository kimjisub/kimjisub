import { addDays, format } from 'date-fns';

interface GitHubHitmapProps {
	data: number[];
	fromDate: Date;
}

const GithubHitmapCol: React.FC<GitHubHitmapProps> = ({ data, fromDate }) => {
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

	// fromDate를 기준으로 요일을 계산하여 데이터가 7의 배수가 아닐 경우 뒤에 0을 추가하여 주차별로 맞춤
	const dayOfWeek = fromDate.getDay();
	const paddingSize = (data.length + dayOfWeek) % 7;
	if (paddingSize !== 0) {
		const padding = new Array(7 - paddingSize).fill(-1);
		data = [...new Array(dayOfWeek).fill(-1), ...data, ...padding];
	}

	// 각 타일을 7칸짜리 세로열로 배치하고 최신순으로 정렬
	const rows = Array.from({ length: Math.ceil(data.length / 7) });
	const tiles = rows.map((_, rowIndex) => {
		const weekData = data.slice(rowIndex * 7, (rowIndex + 1) * 7);

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
			<div key={rowIndex} className="flex flex-row">
				<p className="w-10 text-left relative">
					<span className="h-5 text-sm inline-block absolute bottom-0 left-0">
						{yearLabel || monthLabel}
					</span>
				</p>
				{weekData.map((count, index) => {
					const date = addDays(fromDate, rowIndex * 7 + index);
					const formattedDate = format(date, 'yyyy-MM-dd');
					return (
						<div
							key={formattedDate}
							title={`${formattedDate}: ${count} commits`}
							className={`w-2.5 h-2.5 m-[2px] rounded-sm ${getColor(
								count,
							)} text-[4px]`}></div>
					);
				})}
			</div>
		);
	});

	return <div className="flex flex-col-reverse">{tiles}</div>;
};

export default GithubHitmapCol;
