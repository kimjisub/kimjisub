import React from 'react';
import { NotionRenderer } from 'react-notion-x';

import { fetchProject, notionApi } from '@/api/notion';
import { NotionPage } from '@/components/NotionPage';

const ProjectPage = async ({ params }: { params: { projectId: string } }) => {
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
