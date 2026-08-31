import type { Metadata } from 'next';

import KeyboardPiano from '@/components/lab/piano/KeyboardPiano';

export const metadata: Metadata = {
	title: 'Keyboard Piano',
	description:
		'QWERTY 자판을 그대로 피아노 건반으로 쓰는 웹 피아노. 음원 파일 없이 브라우저에서 합성해 건반을 누른 시점과 소리가 나는 시점 사이에 네트워크와 디코드가 끼지 않습니다.',
	openGraph: {
		title: 'Keyboard Piano | Lab',
		description: 'QWERTY 자판으로 치는 저지연 웹 피아노. 톤 여섯 가지를 코드로 합성합니다.',
		type: 'website',
	},
	twitter: {
		card: 'summary',
		title: 'Keyboard Piano | Lab',
		description: 'QWERTY 자판으로 치는 저지연 웹 피아노.',
	},
};

export default function KeyboardPianoPage() {
	return <KeyboardPiano />;
}
