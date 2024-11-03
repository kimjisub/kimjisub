import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { getProjects } from '@/api/notion/projects';
import { JsonView } from '@/components/JsonView';
export const revalidate = 60;

export default async function ProjectsPage() {
	console.log('[SSG] ProjectsPage');

	const projects = await getProjects();

	return (
		<div className="pt-16 mx-auto p-6 max-w-5xl">
			<p>Projects</p>
			<p>그동안 진행해왔던 프로젝트들이에요.</p>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5 justify-center max-x-1xl">
				{projects.map(project => (
					<ProjectItem
						key={project.id}
						projectId={project.id}
						title={project.title}
						description={project.description}
						iconUrl={project.iconUrl}
						iconEmoji={project.iconEmoji}
						coverImageUrl={project.coverImageUrl}
						raw={project.raw}
					/>
				))}
			</div>
		</div>
	);
}

interface ProjectItemProps {
	className?: string;
	projectId: string;
	title: string;
	description?: string;
	iconUrl?: string;
	iconEmoji?: string;
	coverImageUrl?: string;
	raw?: any;
}
const ProjectItem = ({
	className,
	projectId,
	title,
	description,
	iconUrl,
	iconEmoji,
	coverImageUrl,
	raw,
}: ProjectItemProps) => {
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
			alt="" //{`${name} 커버 이미지`}
		/>
	) : (
		<></>
	);

	return (
		<Link href={`/projects/${projectId}`}>
			<article
				className={`cursor-pointer rounded-lg border-2 border-gray-200 m-2 ${className}`}>
				<div className="h-48">{coverImage}</div>
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
