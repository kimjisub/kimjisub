import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { CareerT } from '@/api/notion/careers';

export interface CareerItemProps {
	className?: string;
	career: CareerT;
}

export const CareerItem = ({ className, career }: CareerItemProps) => {
	const icon = career.iconUrl ? (
		<Image
			className="mr-2 w-6 h-6"
			width={24}
			height={24}
			src={career.iconUrl}
			alt={`${career.title} 아이콘`}
		/>
	) : career.iconEmoji ? (
		<span className="mr-2">{career.iconEmoji}</span>
	) : (
		<></>
	);

	const coverImage = career.coverImageUrl ? (
		<Image
			className="rounded-t-lg w-full h-full object-cover"
			width={300}
			height={150}
			src={career.coverImageUrl}
			alt="" //{`${career.title} 커버 이미지`}
		/>
	) : (
		<></>
	);

	return (
		<Link href={`/careers/${career.id}`} prefetch>
			<article
				className={`cursor-pointer rounded-lg border-2 border-gray-200 ${className}`}>
				<div className="h-32">{coverImage}</div>
				<div className="p-2">
					<p className="text-md font-semibold flex">
						{icon}
						{career.title}
					</p>
					<p className="text-sm">{career.description}</p>
				</div>
			</article>
			{/* <JsonView name="raw" src={raw} /> */}
		</Link>
	);
};
