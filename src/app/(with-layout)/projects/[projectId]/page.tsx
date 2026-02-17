import React from 'react';
import { Badge, DataList } from '@radix-ui/themes';
import { Text } from '@radix-ui/themes';
import { format } from 'date-fns';
import Image from 'next/image';

import { getProject, getProjectPage } from '@/api/notion/project';
import { getProjects } from '@/api/notion/projects';
import { CareerItem } from '@/components/CareerItem';
import DebugView from '@/components/DebugView';
import { JsonView } from '@/components/JsonView';
import { NotionClientRenderer } from '@/components/NotionPage';
import { SkillItem } from '@/components/SkillItem';

export async function generateStaticParams() {
	console.log('[generateStaticParams]', 'projects/[projectId]');
	const { projects } = await getProjects();
	return projects.map(project => ({
		projectId: project.id,
	}));
}

export const revalidate = 3600;

export const dynamicParams = true;

type Params = Promise<{ projectId: string }>;

export async function generateMetadata(props: { params: Params }) {
	const { projectId } = await props.params;

	const { project } = await getProject(projectId);
	return {
		title: project?.title || 'Not found',
	};
}

const ProjectPage = async (props: { params: Params }) => {
	const { projectId } = await props.params;
	console.log('[SSG] ProjectPage', { projectId });
	const [
		{ project, fetchedAt },
		{ extendedRecordMap, fetchedAt: pageFetchedAt },
	] = await Promise.all([getProject(projectId), getProjectPage(projectId)]);

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
		<div className="py-24 px-6 max-w-7xl mx-auto">
			<div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
				<section className="col-span-3">
					<div className="flex items-center space-x-3 mb-8">
						{icon}
						<h1 className="font-serif text-3xl md:text-4xl text-foreground italic">{project.title}</h1>
					</div>

					<NotionClientRenderer
						className="w-full"
						rootPageId={projectId}
						recordMap={extendedRecordMap}
						fullPage={false}
						darkMode={false}
						disableHeader
					/>

					<DebugView>
						<Text>{format(pageFetchedAt, 'yyyy-MM-dd HH:mm:ss')}</Text>
					</DebugView>
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
							<DataList.Value>
								<div className="space-x-2 " style={{ lineHeight: '3.2' }}>
									{project.relatedTechSkills.map(skill => (
										<SkillItem key={skill.id} skill={skill} variant="inline" />
									))}
								</div>
							</DataList.Value>
						</DataList.Item>
						<DataList.Item>
							<DataList.Label minWidth="88px">프로그래밍 언어</DataList.Label>
							<DataList.Value>
								<div className="space-x-2 " style={{ lineHeight: '3.2' }}>
									{project.relatedLanguageSkills.map(skill => (
										<SkillItem key={skill.id} skill={skill} variant="inline" />
									))}
								</div>
							</DataList.Value>
						</DataList.Item>
					</DataList.Root>

					<div className="space-y-8 mt-8">
						<div className="space-y-4">
							<h2 className="font-serif text-xl text-foreground italic">Related</h2>
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
						<DebugView>
							<Text>{format(fetchedAt, 'yyyy-MM-dd HH:mm:ss')}</Text>
							<JsonView src={project} collapsed />
						</DebugView>
					</div>
				</section>
			</div>
		</div>
	);
};

export default ProjectPage;
