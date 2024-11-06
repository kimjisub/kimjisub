import React from 'react';
import { Badge, DataList } from '@radix-ui/themes';
import { format } from 'date-fns';
import Image from 'next/image';

import { getCareer, getCareerPage } from '@/api/notion/career';
import { getCareers } from '@/api/notion/careers';
import { JsonView } from '@/components/JsonView';
import { NotionClientRenderer } from '@/components/NotionPage';
import { ProjectItem } from '@/components/ProjectItem';

export async function generateStaticParams() {
	console.log('[generateStaticParams]', 'careers/[careerId]');
	const careers = await getCareers();
	const careerIds = careers.map(career => ({
		careerId: career.id,
	}));
	return careerIds;
}

export const revalidate = 3600;

export const dynamicParams = true;

type Params = Promise<{ careerId: string }>;

export async function generateMetadata(props: { params: Params }) {
	const { careerId } = await props.params;

	const career = await getCareer(careerId);
	return {
		title: career?.title,
	};
}

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

	const icon = career.iconUrl ? (
		<Image
			className="mr-2 w-8 h-8"
			width={32}
			height={32}
			src={career.iconUrl}
			alt={`${career.title} 아이콘`}
		/>
	) : career.iconEmoji ? (
		<span className="mr-2">{career.iconEmoji}</span>
	) : (
		<></>
	);

	return (
		<div className="pt-16 mx-auto p-6">
			<div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
				<section className="col-span-3 max-w-fit">
					<div className="flex items-center bg-center space-x-2">
						{icon}
						<h1 className="text-3xl font-bold">{career.title}</h1>
					</div>

					<NotionClientRenderer
						className="w-full"
						rootPageId={careerId}
						recordMap={recordMap}
						fullPage={false}
						darkMode={false}
						disableHeader
					/>
				</section>

				<section className="col-span-2">
					<div className="space-y-4">
						<DataList.Root>
							<DataList.Item>
								<DataList.Label minWidth="88px">날짜</DataList.Label>
								<DataList.Value>
									{career.date.start && career.date.end ? (
										<div>
											{`${format(career.date.start, 'yyyy-MM-dd')} ~ ${format(
												career.date.end,
												'yyyy-MM-dd',
											)}`}
										</div>
									) : career.date.start ? (
										<div>{format(career.date.start, 'yyyy-MM-dd')}</div>
									) : null}
								</DataList.Value>
							</DataList.Item>
							<DataList.Item>
								<DataList.Label minWidth="88px">수상 및 수료</DataList.Label>
								<DataList.Value className="space-x-2">
									{career.awardsAndCertifications}
								</DataList.Value>
							</DataList.Item>
							<DataList.Item>
								<DataList.Label minWidth="88px">기관</DataList.Label>
								<DataList.Value className="space-x-2">
									{career.institutions.map(institution => (
										<Badge key={institution.name} color={institution.color}>
											{institution.name}
										</Badge>
									))}
								</DataList.Value>
							</DataList.Item>
							<DataList.Item>
								<DataList.Label minWidth="88px">importance</DataList.Label>
								<DataList.Value className="space-x-2">
									{career.importance}
								</DataList.Value>
							</DataList.Item>
							<DataList.Item>
								<DataList.Label minWidth="88px">분류</DataList.Label>
								<DataList.Value className="space-x-2">
									{career.categories.map(category => (
										<Badge key={category.name} color={category.color}>
											{category.name}
										</Badge>
									))}
								</DataList.Value>
							</DataList.Item>
						</DataList.Root>

						<div className="space-y-4">
							<h2>관련된 프로젝트</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5 justify-center max-x-1xl">
								{career.relatedProjects.map(project => (
									<ProjectItem key={project.id} project={project} />
								))}
							</div>
						</div>

						<JsonView src={career} collapsed />
					</div>
				</section>
			</div>
		</div>
	);
};

export default CareerPage;
