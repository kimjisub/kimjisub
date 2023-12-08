'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

import GitHubHitmap from '@/components/GithubHitmap';

export interface GithubSectionProps {
	data: number[];
	fromDate: Date;
}

export default function GithubSection({ data, fromDate }: GithubSectionProps) {
	const hitmapRef = useRef<HTMLDivElement>(null);
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
		<div>
			<motion.div
				ref={hitmapRef}
				className="w-full h-screen"
				animate={controls}
				initial={{ x: 0 }}>
				<GitHubHitmap data={data} fromDate={fromDate} />
			</motion.div>
		</div>
	);
}
