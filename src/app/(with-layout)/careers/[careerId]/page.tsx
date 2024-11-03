import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import { getCareer, getCareerPage, getCareers } from '@/api/notion/careers';
import { JsonView } from '@/components/JsonView';
import { NotionClientRenderer } from '@/components/NotionPage';
import { ProjectItem } from '@/components/ProjectItem';

export async function generateStaticParams() {
	const careers = await getCareers();
	const careerIds = careers.map(career => ({
		params: {
			careerId: career.id,
		},
	}));
	return careerIds;
}

export const revalidate = false;

export const dynamicParams = true;

type Params = Promise<{ careerId: string }>;

const CareerPage = async (props: { params: Params }) => {
	const { careerId } = await props.params;
	console.log('[SSG] CareerPage', { careerId });
	const [career, recordMap] = await Promise.all([
		getCareer(careerId),
		getCareerPage(careerId),
	]);

	if (!career) {
		return <div>Career not found</div>;
	}

	return (
		<div className="pt-16 mx-auto p-6 max-w-5xl">
			<Head>
				<meta name="description" content="React Notion X Minimal Demo" />

				<title>{career.title}</title>
			</Head>

			<h1>{career.title}</h1>

			<div>
				<p>관련된 프로젝트</p>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5 justify-center max-x-1xl">
					{career.relatedProjects.map(project => (
						<Link key={project.id} href={`/projects/${project.id}`}>
							<ProjectItem project={project} />
						</Link>
					))}
				</div>
			</div>

			{/* <JsonView name="career" src={career} collapsed /> */}

			<NotionClientRenderer
				rootPageId={careerId}
				recordMap={recordMap}
				fullPage={false}
				darkMode={false}
				disableHeader
			/>
		</div>
	);
};

export default CareerPage;
