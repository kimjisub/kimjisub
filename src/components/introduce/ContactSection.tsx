import React from 'react';

import { Title } from '@/components/Title';

export default function ContactSection() {
	return (
		<section className="flex justify-center items-center">
			<div className="w-full max-w-5xl mx-auto px-4">
				<Title title="Contact" subTitle="" />

				<div
					className="my-8"
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fill, 50px)',
						gridGap: '16px',
					}}></div>
			</div>
		</section>
	);
}
