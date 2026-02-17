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
	) : null;

	const coverImage = career.coverImageUrl ? (
		<Image
			className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
			width={300}
			height={150}
			src={career.coverImageUrl}
			alt={`${career.title} 커버 이미지`}
		/>
	) : (
		<div className="w-full h-full bg-gradient-to-br from-secondary to-primary" aria-label={`${career.title}`} />
	);

	return (
		<Link href={`/careers/${career.id}`} prefetch className="group">
			<article
				className={`cursor-pointer rounded-xl border border-border bg-card overflow-hidden card-hover ${className}`}
			>
				<div className="relative overflow-hidden">
					<div className="aspect-video">{coverImage}</div>
					<div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-colors duration-300" />
				</div>
				<div className="p-4">
					<p className="text-sm font-medium text-foreground flex items-center mb-1 group-hover:text-accent transition-colors">
						{icon}
						{career.title}
					</p>
					{career.description && (
						<p className="text-sm text-muted-foreground line-clamp-2">
							{career.description}
						</p>
					)}
				</div>
			</article>
		</Link>
	);
};
