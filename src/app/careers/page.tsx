import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { getCareers } from '@/api/notion/careers';

export const revalidate = 60;
export default async function CareerPage() {
	console.log('[SSG] CareerPage');

	const careers = await getCareers();
	return (
		<div className="pt-16 mx-auto p-6 max-w-5xl">
			<p>Career</p>
			<p>그동안 경험했던 것들이에요.</p>

			<div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-5 justify-center max-x-1xl">
				{careers.map(career => (
					<CareerItem
						key={career.id}
						careerId={career.id}
						title={career.title}
						description={career.description}
						iconUrl={career.iconUrl}
						iconEmoji={career.iconEmoji}
						coverImageUrl={career.coverImageUrl}
						raw={career.raw}
					/>
				))}
			</div>
		</div>
	);
}

interface CareerItemProps {
	className?: string;
	careerId: string;
	title: string;
	description?: string;
	iconUrl?: string;
	iconEmoji?: string;
	coverImageUrl?: string;
	raw?: any;
}

const CareerItem = ({
	className,
	careerId,
	title,
	description,
	iconUrl,
	iconEmoji,
	coverImageUrl,
	raw,
}: CareerItemProps) => {
	const icon = iconUrl ? (
		<Image
			className="mr-2 w-6 h-6"
			width={24}
			height={24}
			src={iconUrl}
			alt={`${title} 아이콘`}
		/>
	) : iconEmoji ? (
		<span className="mr-2">{iconEmoji}</span>
	) : (
		<></>
	);

	const coverImage = coverImageUrl ? (
		<Image
			className="rounded-t-lg w-full h-full object-cover"
			width={300}
			height={150}
			src={coverImageUrl}
			alt="" //{`${title} 커버 이미지`}
		/>
	) : (
		<></>
	);

	return (
		<Link href={`/careers/${careerId}`}>
			<article
				className={`cursor-pointer rounded-lg border-2 border-gray-200 ${className}`}>
				<div className="h-32">{coverImage}</div>
				<div className="p-2">
					<p className="text-md font-semibold flex">
						{icon}
						{title}
					</p>
					<p className="text-sm">{description}</p>
				</div>
			</article>
			{/* <JsonView name="raw" src={raw} /> */}
		</Link>
	);
};
