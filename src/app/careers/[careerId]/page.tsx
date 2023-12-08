import React from 'react';

import { fetchCareer, notionApi } from '@/api/notion';
import { NotionPage } from '@/components/NotionPage';

const CareerPage = async ({ params }: { params: { careerId: string } }) => {
	const { careerId } = params;

	const [career, recordMap] = await Promise.all([
		fetchCareer(careerId),
		notionApi.getPage(careerId),
	]);

	console.log('career', career);
	console.log('recordMap', recordMap);

	return (
		<div className="pt-16 mx-auto p-6 max-w-5xl">
			<NotionPage recordMap={recordMap} rootPageId={careerId} />
		</div>
	);
};

export default CareerPage;
