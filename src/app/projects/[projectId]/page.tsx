import React from 'react';

import { notionApi } from '@/api/notion/notion';
import { fetchProject } from '@/api/notion/projects';
import { NotionPage } from '@/components/NotionPage';

const ProjectPage = async ({ params }: { params: { projectId: string } }) => {
	const { projectId } = params;
	const [project, recordMap] = await Promise.all([
		fetchProject(projectId),
		notionApi.getPage(projectId),
	]);

	console.log('project', project);
	console.log('recordMap', recordMap);

	return (
		<div className="pt-16 mx-auto p-6 max-w-5xl">
			<NotionPage recordMap={recordMap} rootPageId={projectId} />
		</div>
	);
};

export default ProjectPage;
