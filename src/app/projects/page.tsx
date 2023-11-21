import React from 'react';
import Image from 'next/image';

import { fetchProject, Project } from '@/api/notion';

export default async function ProjectsPage() {
	const projects = await fetchProject();

	return (
		<div className="pt-16 mx-auto p-6 max-w-5xl">
			<p>Projects</p>
			<p>그동안 진행해왔던 프로젝트들이에요.</p>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5 justify-center max-x-1xl">
				{projects.map(project => (
					<ProjectItem key={project.id} project={project} />
				))}
			</div>
		</div>
	);
}

interface ProjectItemProps {
	project: Project;
	className?: string;
}
const ProjectItem = ({ project, className }: ProjectItemProps) => {
	const name = project.properties.이름.title?.[0]?.text?.content;
	const description = project.properties.설명.rich_text[0]?.plain_text;
	const icon = {
		emoji: <span className="mr-2">{project.icon?.emoji}</span>,
		file: project.icon?.file?.url ? (
			<Image
				className="mr-2"
				style={{
					width: '24px',
					height: '24px',
				}}
				width={24}
				height={24}
				src={project.icon?.file?.url}
				alt={`${name} 아이콘`}
			/>
		) : (
			<></>
		),
	}[project.icon?.type ?? ''] ?? <></>;

	const imageUrl =
		{
			file: project?.cover?.file?.url,
			external: project?.cover?.external?.url,
		}[project?.cover?.type ?? ''] ?? '';

	return (
		<article
			className={`cursor-pointer rounded-lg border-2 border-gray-200 m-2 ${className}`}>
			<div className="h-48">
				<Image
					className="rounded-t-lg w-full h-full object-cover"
					width={300}
					height={150}
					src={imageUrl}
					alt="" //{`${name} 커버 이미지`}
				/>
			</div>
			<div className="p-2">
				<p className="text-md font-semibold flex">
					{icon}
					{name}
				</p>
				<p className="text-sm">{description}</p>
			</div>
			{/* <pre className="text-xs">{JSON.stringify(project, null, 2)}</pre> */}
		</article>
	);
};
