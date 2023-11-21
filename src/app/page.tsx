import TopBar from '@/components/TopBar';
import Image from 'next/image';
import TimeLineSection from './TimeLineSection';
import IntroduceSection from './IntroduceSection';

export default function Home() {
	return (
		<div>
			<IntroduceSection />
			<TimeLineSection />
		</div>
	);
}
