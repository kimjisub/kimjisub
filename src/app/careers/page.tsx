import React from 'react';
import Image from 'next/image';

import { Career, fetchCareers } from '@/api/notion';
export default async function CareerPage() {
	const careers = await fetchCareers();
	return (
		<div className="pt-16 mx-auto p-6 max-w-5xl">
			<p>Career</p>
			<p>그동안 경험했던 것들이에요.</p>

			<div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-5 justify-center max-x-1xl">
				{careers.map(career => (
					<CareerItem key={career.id} career={career} />
				))}
			</div>
		</div>
	);
}

interface CareerItemProps {
	career: Career;
	className?: string;
}

const CareerItem = ({ career, className }: CareerItemProps) => {
	const name = career.properties.이름.title?.[0]?.text?.content;
	const description = career.properties.설명.rich_text[0]?.plain_text;
	const icon = {
		emoji: <span className="mr-2">{career.icon?.emoji}</span>,
		file: career.icon?.file?.url ? (
			<Image
				className="mr-2 w-6 h-6"
				width={24}
				height={24}
				src={career.icon?.file?.url}
				alt={`${name} 아이콘`}
				layout="fixed"
				objectFit="cover"
			/>
		) : (
			<></>
		),
	}[career.icon?.type ?? ''] ?? <></>;

	const coverImageUrl =
		{
			file: career?.cover?.file?.url,
			external: career?.cover?.external?.url,
		}[career?.cover?.type ?? ''] ?? '';

	const coverImage = coverImageUrl ? (
		<Image
			className="rounded-t-lg w-full h-full object-cover"
			width={300}
			height={150}
			src={coverImageUrl}
			alt="" //{`${name} 커버 이미지`}
			layout="fixed"
			objectFit="cover"
		/>
	) : (
		<></>
	);

	return (
		<article
			className={`cursor-pointer rounded-lg border-2 border-gray-200 ${className}`}>
			<div className="h-32">{coverImage}</div>
			<div className="p-2">
				<p className="text-md font-semibold flex">
					{icon}
					{name}
				</p>
				<p className="text-sm">{description}</p>
			</div>
		</article>
	);
};
