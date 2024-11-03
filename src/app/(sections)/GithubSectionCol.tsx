'use client';

import React, { useEffect } from 'react';
import { useAnimation } from 'framer-motion';

import GithubHitmapCol from '@/components/GithubHitmapCol';

export interface GithubSectionPropsCol {
	data: number[];
	fromDate: Date;
}

const GithubSectionCol: React.FC<GithubSectionPropsCol> = ({
	data,
	fromDate,
}) => {
	const controls = useAnimation();

	useEffect(() => {
		// GithubHitmap이 전체 크기에 맞게 스크롤되도록 framer-motion 애니메이션 설정
		const sequence = async () => {
			await controls.start({ x: 0 });
			await controls.start({ x: '-100%' });
		};

		sequence();
	}, [controls]);

	return (
		<section className="flex justify-center items-center">
			<div className="w-full max-w-5xl mx-auto px-4">
				<GithubHitmapCol data={data} fromDate={fromDate} />
			</div>
		</section>
	);
};

export default GithubSectionCol;
