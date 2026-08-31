export interface Experiment {
	slug: string;
	title: string;
	summary: string;
	/** 만든 날짜 (ISO) */
	date: string;
}

export const EXPERIMENTS: Experiment[] = [
	{
		slug: 'piano',
		title: 'Keyboard Piano',
		summary:
			'QWERTY 자판을 그대로 피아노 건반으로 씁니다. 음원 파일 없이 브라우저에서 소리를 합성해 건반을 누른 시점과 소리가 나는 시점 사이에 네트워크와 디코드가 끼지 않습니다.',
		date: '2026-08-30',
	},
];
