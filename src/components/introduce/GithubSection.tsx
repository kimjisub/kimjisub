'use client';

import React from 'react';

import GitHubHitmap from '@/components/GithubHitmap';
import { Title } from '@/components/Title';

export interface GithubSectionProps {
	data: number[];
	fromDate: Date;
}

export default function GithubSection({ data, fromDate }: GithubSectionProps) {
	return (
		<section>
			<div>
				<Title title="Github" subTitle="Github Hitmap" />
				<div
					className="overflow-x-auto whitespace-nowrap"
					style={{ overflowX: 'auto' }}
					ref={div => {
						if (div) {
							div.scrollLeft = div.scrollWidth;
						}
					}}>
					<div>
						<GitHubHitmap data={data} fromDate={fromDate} />
					</div>
				</div>
			</div>
		</section>
	);
}
