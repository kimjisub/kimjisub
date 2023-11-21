import React from 'react';

import careers from '../../data/careers.json';

import Image from 'next/image';
export default function CareerPage() {
	return (
		<div className="pt-16 mx-auto p-6 max-w-5xl">
			<p>Career</p>
			<p>그동안 경험했던 것들이에요.</p>

			<div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-5 justify-center max-x-1xl">
				{careers.results.map((career) => (
					<CareerItem key={career.id} project={career} />
				))}
			</div>
		</div>
	);
}

type Career = (typeof careers.results)[number];

interface CareerItemProps {
	project: Career;
	className?: string;
}

const CareerItem = ({ project, className }: CareerItemProps) => {
	const name = project.properties.이름.title?.[0]?.text?.content;
	const description = project.properties.설명.rich_text[0]?.plain_text;
	const icon = {
		emoji: <span className="mr-2">{project.icon?.emoji}</span>,
		file: project.icon?.file?.url ? (
			<Image
				className="mr-2"
				width={24}
				height={24}
				src={project.icon?.file?.url}
				alt={`${name} 아이콘`}
			/>
		) : (
			<></>
		),
	}[project.icon?.type ?? ''] ?? <></>;

	return (
		<article
			className={`cursor-pointer rounded-lg border-2 border-gray-200 ${className}`}
		>
			<div className="h-32">
				{/* <Image
					src=""
					alt=""
				/> */}
			</div>
			<div className="p-2">
				<p className="text-md font-semibold flex">
					{icon}
					{name}
				</p>
				<p className="text-sm">{description}</p>
			</div>
		</article>
	);
};
