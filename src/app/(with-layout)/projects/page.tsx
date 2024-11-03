import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { getProjects } from '@/api/notion/projects';
import { JsonView } from '@/components/JsonView';
import { format } from 'date-fns';
import { Title } from '@/components/Title';
import { ProjectItem } from '@/components/ProjectItem';

export const revalidate = false;

export default async function ProjectsPage() {
	console.log('[SSG] ProjectsPage');

	const projects = await getProjects();

	return (
		<div className="pt-16 mx-auto p-6 max-w-5xl">
			<Title title="프로젝트" subTitle="다양한 프로젝트를 하며, " />
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5 justify-center max-x-1xl">
				{projects.map(project => (
					<ProjectItem key={project.id} project={project} />
				))}
			</div>
		</div>
	);
}
