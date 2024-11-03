import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import { getCareer, getCareerPage, getCareers } from '@/api/notion/careers';
import { JsonView } from '@/components/JsonView';
import { NotionClientRenderer } from '@/components/NotionPage';

export async function generateStaticParams() {
	console.log('[generateStaticParams]', 'careers/[careerId]');
	const careers = await getCareers();
	const careerIds = careers.map(career => ({
		params: {
			careerId: career.id,
		},
	}));
	console.log('[generateStaticParams]', 'careers/[careerId]', careerIds);
	return careerIds;
}

export const revalidate = 60;

export const dynamicParams = true;

type Params = Promise<{ careerId: string }>;

const CareerPage = async (props: { params: Params }) => {
	const { careerId } = await props.params;
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

			{/* <JsonView name="career" src={career} collapsed /> */}

			<NotionClientRenderer
				rootPageId={careerId}
				recordMap={recordMap}
				fullPage={false}
				darkMode={false}
				disableHeader
				defaultPageIcon="📄"
				components={{
					nextImage: Image,
					nextLink: Link,
				}}
			/>
		</div>
	);
};

export default CareerPage;
