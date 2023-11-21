import TopBar from '@/components/TopBar';
import Image from 'next/image';
import TimeLineSection from './sections/TimeLineSection';
import IntroduceSection from './sections/IntroduceSection';

export default function Home() {
	return (
		<div>
			<IntroduceSection />
			<TimeLineSection />
		</div>
	);
}
