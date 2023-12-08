import React from 'react';

import { notionApi } from '@/api/notion/notion';
import { fetchProject } from '@/api/notion/projects';
import { NotionPage } from '@/components/NotionPage';

const ProjectPage = async ({ params }: { params: { projectId: string } }) => {
	return <div className="">작업중인 페이지입니다.</div>;

	const { projectId } = params;

	const project = await fetchProject(projectId);

	console.log('project', project);

	const recordMap = await notionApi.getPage(projectId);

	console.log('recordMap', recordMap);

	return (
		<div className="pt-16 mx-auto p-6 max-w-5xl">
			<NotionPage recordMap={recordMap} rootPageId={projectId} />
		</div>
	);
};

export default ProjectPage;
