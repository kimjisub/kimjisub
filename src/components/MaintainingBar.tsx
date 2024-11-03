'use client';

import React, { useEffect, useState } from 'react';

export default function MaintainingBar() {
	const [intro, setIntro] = useState('배우는 것을 즐기는 개발자');

	useEffect(() => {
		const intros = ['T-shaped Developer', '세상에 호기심이 많은 제너럴리스트'];

		const interval = setInterval(() => {
			setIntro(intros[(intros.indexOf(intro) + 1) % intros.length]);
		}, 5000);

		return () => clearInterval(interval);
	}, [intro]);

	return (
		<section className="flex content-center items-center justify-center bg-orange-500 p-4 text-white bg-opacity-80 ">
			🚧 아직 개발이 진행중입니다. 일부 레이아웃이 정상적으로 표시되지 않을 수
			있습니다.
		</section>
	);
}
