'use client';

import React, { useEffect, useState } from 'react';
import { Text } from '@radix-ui/themes';
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
			<div className="content-center self-center bg-white transition-transform duration-200 hover:transform hover:scale-105 aspect-[3/2] w-[66vw] p-8 rounded-lg outline-1">
				<div className="flex content-center gap-16 h-full">
					<div className="flex flex-col flex-[3] content-center items-center self-center space-y-4">
						<Image
							src="/logo192.png"
							className="rounded-full w-32 h-32"
							alt={''}
							width={128}
							height={128}
						/>
						<h1 className="text-6xl font-extralight">김지섭</h1>
						<p className="text-2xl font-bold text-gray-700 mb-4">{intro}</p>
					</div>
					<div className="flex-[5] self-center">
						<div>
							<Text className="break-keep">
								안녕하세요, 10년이라는 긴 시간동안 코딩에 진심이였던 풀스택
								개발자 김지섭입니다. 55여개의 프로젝트를 진행해보았고, IT 관련
								대회에서 26회 수상한 경험이 있습니다. 앱 개발로 시작하여, 기획,
								UX 디자인, 프론트엔드, 임베디드 개발 등 다양한 경험을 해보았고,
								현재는 백엔드 및 DevOps, React Native 앱 개발을 주력으로 하고
								있습니다.
							</Text>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
