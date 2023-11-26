'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import GitHubHitmap from '@/components/GithubHitmap';

gsap.registerPlugin(ScrollTrigger);

export interface GithubSectionProps {
	data: number[];
	fromDate: Date;
}

export default function GithubSection({ data, fromDate }: GithubSectionProps) {
	const hitmapRef = useRef<HTMLDivElement>(null);
	const [hitmapWidth, setHitmapWidth] = useState(0);

	useEffect(() => {
		const resizeListener = () => {
			if (hitmapRef.current) {
				setHitmapWidth(hitmapRef.current.offsetWidth);
			}
		};

		window.addEventListener('resize', resizeListener);
		resizeListener();

		return () => {
			window.removeEventListener('resize', resizeListener);
		};
	}, []);

	useEffect(() => {
		const hitmapElement = hitmapRef.current;
		if (!hitmapElement) {
			console.log('hitmapElement is null');
			return;
		}

		// const tl = gsap.timeline({
		// 	scrollTrigger: {
		// 		trigger: hitmapElement,
		// 		start: 'top center',
		// 		end: 'bottom center',
		// 		scrub: 1,
		// 		pin: true,
		// 		pinSpacing: true,
		// 		markers: true,
		// 	},
		// 	delay: 3,
		// });

		// tl.to(hitmapElement, {
		// 	xPercent: -100,
		// 	ease: 'none',
		// });
	}, []);

	return (
		<div>
			<div ref={hitmapRef} className="w-fit ml-[50vw] h-screen">
				<GitHubHitmap data={data} fromDate={fromDate} />
			</div>
		</div>
	);
}
