import React from 'react';
import { Badge, DataList } from '@radix-ui/themes';
import { format } from 'date-fns';
import Image from 'next/image';

import { getProject, getProjectPage } from '@/api/notion/project';
import { getProjects } from '@/api/notion/projects';
import { CareerItem } from '@/components/CareerItem';
import { JsonView } from '@/components/JsonView';
import { NotionClientRenderer } from '@/components/NotionPage';
import { SkillItem } from '@/components/SkillItem';

export async function generateStaticParams() {
	console.log('[generateStaticParams]', 'projects/[projectId]');
	const projects = await getProjects();
	const projectIds = projects.map(project => ({
		projectId: project.id,
	}));
	return projectIds;
}

export const revalidate = 3600;

export const dynamicParams = true;

type Params = Promise<{ projectId: string }>;

export async function generateMetadata(props: { params: Params }) {
	const { projectId } = await props.params;

	const project = await getProject(projectId);
	return {
		title: project?.title,
	};
}

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

	const icon = project.iconUrl ? (
		<Image
			className="mr-2 w-8 h-8"
			width={32}
			height={32}
			src={project.iconUrl}
			alt={`${project.title} 아이콘`}
		/>
	) : project.iconEmoji ? (
		<span className="mr-2">{project.iconEmoji}</span>
	) : (
		<></>
	);

	return (
		<div className="pt-16 mx-auto p-6">
			<div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
				<section className="col-span-3 max-w-fit">
					<div className="flex items-center bg-center space-x-2">
						{icon}
						<h1 className="text-3xl font-bold">{project.title}</h1>
					</div>

					<NotionClientRenderer
						className="w-full"
						rootPageId={projectId}
						recordMap={recordMap}
						fullPage={false}
						darkMode={false}
						disableHeader
					/>
				</section>

				<section className="col-span-2">
					<DataList.Root>
						<DataList.Item>
							<DataList.Label minWidth="88px">날짜</DataList.Label>
							<DataList.Value>
								{project.date.start && project.date.end ? (
									<div>
										{`${format(project.date.start, 'yyyy-MM-dd')} ~ ${format(
											project.date.end,
											'yyyy-MM-dd',
										)}`}
									</div>
								) : project.date.start ? (
									<div>{format(project.date.start, 'yyyy-MM-dd')}</div>
								) : null}
							</DataList.Value>
						</DataList.Item>
						<DataList.Item>
							<DataList.Label minWidth="88px">태그</DataList.Label>
							<DataList.Value className="space-x-2">
								{project.태그.map(tag => (
									<Badge key={tag.name} color={tag.color}>
										{tag.name}
									</Badge>
								))}
							</DataList.Value>
						</DataList.Item>
						<DataList.Item>
							<DataList.Label minWidth="88px">분류</DataList.Label>
							<DataList.Value className="space-x-2">
								{project.분류.map(category => (
									<Badge key={category.name} color={category.color}>
										{category.name}
									</Badge>
								))}
							</DataList.Value>
						</DataList.Item>
						<DataList.Item>
							<DataList.Label minWidth="88px">맡은 업무</DataList.Label>
							<DataList.Value className="space-x-2">
								{project['맡은 업무'].map(role => (
									<Badge key={role.name} color={role.color}>
										{role.name}
									</Badge>
								))}
							</DataList.Value>
						</DataList.Item>
						<DataList.Item>
							<DataList.Label minWidth="88px">주요 기술</DataList.Label>
							<DataList.Value className="space-x-2">
								{project.relatedTechSkills.map(skill => (
									<SkillItem key={skill.id} skill={skill} />
								))}
							</DataList.Value>
						</DataList.Item>
						<DataList.Item>
							<DataList.Label minWidth="88px">프로그래밍 언어</DataList.Label>
							<DataList.Value className="space-x-2">
								{project.relatedLanguageSkills.map(skill => (
									<SkillItem key={skill.id} skill={skill} />
								))}
							</DataList.Value>
						</DataList.Item>
					</DataList.Root>

					<div className="space-y-4">
						<div className="space-y-4">
							<h2>관련된 Careers</h2>
							<div
								className="grid grid-cols-2 md:grid-cols-3 gap-6 justify-center max-x-1xl"
								style={{
									gridTemplateColumns: 'repeat(auto-fill, minmax(256px, 1fr))',
								}}>
								{project.relatedCareers.map(career => (
									<CareerItem key={career.id} career={career} />
								))}
							</div>
						</div>
						<JsonView src={project} collapsed />
					</div>
				</section>
			</div>
		</div>
	);
};

export default ProjectPage;
