'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

export default function IntroduceSection() {
	const [intro, setIntro] = useState('배우는 것을 즐기는 개발자');

	useEffect(() => {
		const intros = ['T-shaped Developer', '세상에 호기심이 많은 제너럴리스트'];

		const interval = setInterval(() => {
			setIntro(intros[(intros.indexOf(intro) + 1) % intros.length]);
		}, 5000);

		return () => clearInterval(interval);
	}, [intro]);

	return (
		<section className="flex content-center items-center justify-center snap-start h-[600px]">
			<div className="content-center self-center">
				<div className="flex content-center gap-16">
					<Image
						src="/logo192.png"
						className="rounded-full w-48 h-48"
						alt={''}
						width={192}
						height={192}
					/>
					<div className="w-96">
						<p className="text-2xl font-bold text-gray-700 mb-4">{intro}</p>
						<h1 className="text-4xl md:text-8xl font-extrabold">김지섭</h1>
						<div>
							<p>서비스 기획, 구체화, 설계, 개발, 운영 및 배포, 사업까지</p>
							<p>다양한 경험을 해보았습니다</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
