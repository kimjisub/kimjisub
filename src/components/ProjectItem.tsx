'use client';

import React, { useState } from 'react';
import { Badge, Text } from '@radix-ui/themes';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';

import { ProjectT } from '@/api/notion/projects';

const blur = 'bg-white bg-opacity-60 backdrop-filter backdrop-blur-sm';

export interface ProjectItemProps {
	className?: string;
	project: ProjectT;
}
export const ProjectItem = ({ className, project }: ProjectItemProps) => {
	const [isHovered, setIsHovered] = useState(false);

	const icon = project.iconUrl ? (
		<Image
			className="mr-2 w-6 h-6"
			width={24}
			height={24}
			src={project.iconUrl}
			alt={`${project.title} 아이콘`}
		/>
	) : project.iconEmoji ? (
		<span className="mr-2">{project.iconEmoji}</span>
	) : (
		<></>
	);

	const coverImage = project.coverImageUrl ? (
		<Image
			className="w-full h-full object-cover rounded-[26px] rounded-b-sm"
			width={300}
			height={150}
			src={project.coverImageUrl}
			alt="" //{`${project.name} 커버 이미지`}
		/>
	) : (
		<></>
	);

	return (
		<Link href={`/projects/${project.id}`} prefetch>
			<article
				className={`cursor-pointer rounded-[28px] border-2 border-gray-200 m-2 ${className}`}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}>
				<div className="relative ">
					<div className="aspect-video">{coverImage}</div>
					<div
						className={`absolute top-2 left-2 px-4 py-2 border rounded-full ${blur} `}>
						<p className="text-md font-semibold flex">
							{icon}
							{project.title}
						</p>
					</div>
					{/* <div
						className={`absolute bottom-2 left-2 px-4 py-2 border rounded-full ${blur} transition-opacity duration-300 ${
							isHovered ? 'opacity-100' : 'opacity-0'
						} `}>
						<p className="text-md font-semibold flex">
							<div className="p-2">
								<p className="text-sm">{project.description}</p>
								{project.date.start && (
									<p className="text-sm">
										{format(project.date.start, 'yyyy-MM-dd')}
									</p>
								)}
							</div>
						</p>
					</div> */}
				</div>
				<div className="p-4">
					<div className="space-x-2">
						{project.태그.map(tag => (
							<Badge key={tag.name} color={tag.color}>
								{tag.name}
							</Badge>
						))}
						{project.분류.map(category => (
							<Badge key={category.name} color={category.color}>
								{category.name}
							</Badge>
						))}
						{project['맡은 업무'].map(role => (
							<Badge key={role.name} color={role.color}>
								{role.name}
							</Badge>
						))}
					</div>
					<Text className="text-sm" as="p">
						{project.description}
					</Text>
					{project.date.start && (
						<Text className="text-sm" as="p">
							{format(project.date.start, 'yyyy-MM-dd')}
						</Text>
					)}
				</div>
			</article>
			{/* <JsonView name="raw" src={raw} /> */}
		</Link>
	);
};
