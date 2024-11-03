import React from 'react';

import { notionXApi } from '@/api/notion';
import { NotionClientRenderer } from '@/components/NotionPage';

type Params = Promise<{ projectId: string }>;

const ProjectPage = async ({ params }: { params: Params }) => {
	return <div className="">작업중인 페이지입니다.</div>;

	// const { projectId } = await params;

	// const project = await fetchProject(projectId);

	// console.log('project', project);

	// const recordMap = await notionXApi.getPage(projectId);

	// console.log('recordMap', recordMap);

	// return (
	// 	<div className="pt-16 mx-auto p-6 max-w-5xl">
	// 		<NotionClientRenderer recordMap={recordMap} rootPageId={projectId} />
	// 	</div>
	// );
};

export default ProjectPage;
