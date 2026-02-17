'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';

// react-notion-x는 무거운 라이브러리이므로 dynamic import
const NotionRenderer = dynamic(
	() => import('react-notion-x').then((mod) => mod.NotionRenderer),
	{
		ssr: false,
		loading: () => (
			<div className="animate-pulse space-y-4">
				<div className="h-4 bg-muted rounded w-3/4" />
				<div className="h-4 bg-muted rounded w-1/2" />
				<div className="h-4 bg-muted rounded w-5/6" />
				<div className="h-32 bg-muted rounded" />
				<div className="h-4 bg-muted rounded w-2/3" />
			</div>
		),
	}
);

export type NotionClientRendererProps = React.ComponentProps<
	typeof NotionRenderer
>;

export const NotionClientRenderer = (props: NotionClientRendererProps) => {
	return (
		<NotionRenderer
			{...props}
			components={{
				nextImage: Image,
				nextLink: Link,
				Collection: () => <></>,
			}}
		/>
	);
};
