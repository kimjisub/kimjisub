import React, { useEffect } from 'react';

import IntroduceSection from './IntroduceSection';
import TimeLineSection from './TimeLineSection';

export default function AboutPage() {
	useEffect(() => {
		// set title
		document.title = `김지섭을 소개합니다.`;
	}, []);

	/*

자기소개 ( 명함 )
기술
프로젝트
업적 (경력)
  Github

연락처


*/

	return (
		<div>
			<IntroduceSection />
			<TimeLineSection />
		</div>
	);
}

//const snapRoot = 'snap-y snap-mandatory h-screen overflow-scroll';
