import React from 'react';
import { Badge, DataList } from '@radix-ui/themes';
import { Text } from '@radix-ui/themes';
import { format } from 'date-fns';
import Image from 'next/image';
import { getProject, getProjectPage } from '@/api/notion/project';
import { getProjects } from '@/api/notion/projects';
import { CareerItem } from '@/components/CareerItem';
import { ContentEngagement } from '@/components/ContentEngagement';
import DebugView from '@/components/DebugView';
import { JsonView } from '@/components/JsonView';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { SkillItem } from '@/components/SkillItem';

// Projects with known Notion formula issues that cause build failures
const EXCLUDED_PROJECT_IDS = [
	'86bf901d-caa9-424a-90f0-02da3d8f1bea', // Build error
	'cdee7253-d5de-4cdc-930a-3255d57a0c4c', // Build error
	'd041a673-7348-4dd0-aa72-2e56065036f1', // Element type invalid error during prerender
	'f0499ae1-e215-4aaf-8066-fcd9428be8c8', // Element type invalid error during prerender
	'9f2e48ba-d4b3-40e6-8a22-61ddbcd1b590', // Element type invalid error during prerender
	'07b08690-a37c-421f-8a80-b13d3824549a', // replaceAll undefined error
	'4921b020-aaf8-4482-bfef-4976499dde2e', // replaceAll undefined error
	'0371c463-7d0e-4c0b-8b61-f546160c9982', // Element type invalid error during prerender
	'f8eaf004-c9ef-40d0-8512-fb0e49f06a88', // Element type invalid error during prerender
	'276499ec-3d2a-4016-8de8-d353e21f51c1', // Element type invalid error during prerender
	'8fda43a6-b6cb-495f-8256-898cd2e66b03', // Element type invalid error during prerender
];

export async function generateStaticParams() {
	console.log('[generateStaticParams]', 'projects/[projectId]');
	const { projects } = await getProjects();
	return projects
		.filter(project => !EXCLUDED_PROJECT_IDS.includes(project.id))
		.map(project => ({
			projectId: project.id,
		}));
}

export const revalidate = 3600;

export const dynamicParams = true;

type Params = Promise<{ projectId: string }>;

export async function generateMetadata(props: { params: Params }) {
	const { projectId } = await props.params;

	const { project } = await getProject(projectId);
	
	if (!project) {
		return { title: 'Project Not Found' };
	}

	const description = project.description || `${project.title} - 김지섭의 프로젝트`;
	const tags = project.태그.map(t => t.name).join(', ');
	
	return {
		title: project.title,
		description: description,
		keywords: [project.title, ...project.태그.map(t => t.name), ...project.분류.map(c => c.name)],
		openGraph: {
			title: `${project.title} | Jisub Kim`,
			description: description,
			type: 'article',
			// images omitted → file-based opengraph-image.tsx takes over
			tags: tags ? [tags] : undefined,
		},
		twitter: {
			card: 'summary_large_image',
			title: `${project.title} | Jisub Kim`,
			description: description,
			// images omitted → file-based opengraph-image.tsx takes over
		},
	};
}

const ProjectPage = async (props: { params: Params }) => {
	const { projectId } = await props.params;
	console.log('[SSG] ProjectPage', { projectId });
	 
	const [projectRes, pageRes] = await Promise.all([
		getProject(projectId),
		getProjectPage(projectId),
	]);
	const { project, fetchedAt } = projectRes;
	const { markdown, fetchedAt: pageFetchedAt } = pageRes;

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

	// JSON-LD CreativeWork schema for SEO
	const creativeWorkSchema = {
		'@context': 'https://schema.org',
		'@type': 'CreativeWork',
		name: project.title,
		description: project.description || `${project.title} - 김지섭의 프로젝트`,
		url: `https://kimjisub.com/projects/${projectId}`,
		image: project.coverImageUrl || 'https://kimjisub.com/logo512.png',
		dateCreated: project.date.start ? format(project.date.start, 'yyyy-MM-dd') : undefined,
		dateModified: project.date.end ? format(project.date.end, 'yyyy-MM-dd') : undefined,
		author: {
			'@type': 'Person',
			name: 'Jisub Kim',
			url: 'https://kimjisub.com',
		},
		creator: {
			'@type': 'Person',
			name: 'Jisub Kim',
		},
		keywords: [...project.태그.map(t => t.name), ...project.분류.map(c => c.name)].join(', '),
		genre: project.분류.map(c => c.name).join(', '),
	};

	return (
		<div className="py-12 md:py-24 px-4 md:px-6 max-w-7xl mx-auto">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(creativeWorkSchema),
				}}
			/>
			<div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
				<section className="col-span-3">
					<div className="flex items-center space-x-3 mb-4">
						{icon}
						<h1 className="font-serif text-3xl md:text-4xl text-foreground italic">{project.title}</h1>
					</div>
					
					<ContentEngagement slug={projectId} contentType="project" className="mb-8" />

					<MarkdownRenderer content={markdown} className="w-full" />

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
