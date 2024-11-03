import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import { getProject, getProjectPage, getProjects } from '@/api/notion/projects';
import { JsonView } from '@/components/JsonView';
import { NotionClientRenderer } from '@/components/NotionPage';
import { CareerItem } from '@/components/CareerItem';
import { SkillItem } from '@/components/SkillItem';

export async function generateStaticParams() {
	console.log('[generateStaticParams]', 'projects/[projectId]');
	const projects = await getProjects();
	const projectIds = projects.map(project => ({
		params: {
			projectId: project.id,
		},
	}));
	console.log('[generateStaticParams]', 'projects/[projectId]', projectIds);
	return projectIds;
}

export const revalidate = false;

export const dynamicParams = true;

type Params = Promise<{ projectId: string }>;

const ProjectPage = async (props: { params: Params }) => {
	const { projectId } = await props.params;
	console.log('[SSG] ProjectPage', { projectId });
	const [project, recordMap] = await Promise.all([
		getProject(projectId),
		getProjectPage(projectId),
	]);

	if (!project) {
		return <div>Project not found</div>;
	}

	return (
		<div className="pt-16 mx-auto p-6 max-w-5xl">
			<Head>
				<meta name="description" content="React Notion X Minimal Demo" />

				<title>{project.title}</title>
			</Head>

			<h1>{project.title}</h1>

			<div>
				<p>관련된 커리어</p>
				<div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-5 justify-center max-x-1xl">
					{project.relatedCareers.map(career => (
						<Link key={career.id} href={`/careers/${career.id}`}>
							<CareerItem career={career} />
						</Link>
					))}
				</div>
			</div>

			<div>
				<p>관련된 스킬</p>
				<div className="grid grid-cols-[repeat(auto-fill,_50px)] gap-4">
					{project.relatedSkills.map(skill => (
						<Link key={skill.id} href={`/skills/${skill.id}`}>
							<SkillItem skill={skill} />
						</Link>
					))}
				</div>
			</div>

			{/* <JsonView name="project" src={project} collapsed /> */}
			{/* 
			{Object.entries(properties).map(([key, _value]) => {
				const schemaItem = schema[key];
				const title = schemaItem?.name;
				const type = schemaItem?.type;
				const value = _value as any;
				const valueText = value[0]?.[0];

				switch (schemaItem?.type) {
					case 'title': {
						return <></>;
					}
					case 'text': {
						return (
							<div
								key={key}
								className="border-2 border-gray-300 p-2 rounded-md">
								<h3>{title}</h3>
								<p>{valueText}</p>
							</div>
						);
					}
					case 'checkbox': {
						return (
							<div
								key={key}
								className="border-2 border-gray-300 p-2 rounded-md">
								<h3>{title}</h3>
								<p>{valueText}</p>
							</div>
						);
					}
					case 'url': {
						return (
							<div
								key={key}
								className="border-2 border-gray-300 p-2 rounded-md">
								<h3>{title}</h3>
								<p>
									<Link href={valueText}>{valueText}</Link>
								</p>
							</div>
						);
					}
					case 'multi_select': {
						const items = value[0]?.[0]?.split(',');
						return (
							<div
								key={key}
								className="border-2 border-gray-300 p-2 rounded-md">
								<h3>{title}</h3>
								<p>
									{items.map((item: any) => (
										<span key={item} className="mr-2">
											{item}
										</span>
									))}
								</p>
							</div>
						);
					}
					case 'select': {
						return (
							<div
								key={key}
								className="border-2 border-gray-300 p-2 rounded-md">
								<h3>{title}</h3>
								<p>{valueText}</p>
							</div>
						);
					}
				}

				return (
					<div key={key} className="border-2 border-gray-300 p-2 rounded-md">
						<h3>{title}</h3>
						<p>{valueText}</p>
						<JsonView name={key} src={value} />
						<JsonView name="schemaItem" src={schemaItem} />
					</div>
				);
			})} */}

			<NotionClientRenderer
				rootPageId={projectId}
				recordMap={recordMap}
				fullPage={false}
				darkMode={false}
				disableHeader
			/>
		</div>
	);
};

export default ProjectPage;
