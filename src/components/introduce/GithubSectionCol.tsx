'use client';

import React from 'react';

import GithubHitmapCol from '@/components/GithubHitmapCol';

export interface GithubSectionPropsCol {
	data: number[];
	fromDate: Date;
}

const GithubSectionCol: React.FC<GithubSectionPropsCol> = ({
	data,
	fromDate,
}) => {
	return (
		<section className="flex justify-center items-center">
			<div className="w-full max-w-5xl mx-auto px-4">
				<GithubHitmapCol data={data} fromDate={fromDate} />
			</div>
		</section>
	);
};

export default GithubSectionCol;
