'use client';

import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
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

function NotionErrorFallback({ error }: { error: unknown }) {
	const message = error instanceof Error ? error.message : '알 수 없는 오류';
	return (
		<div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
			<p className="text-red-600 dark:text-red-400 font-medium">콘텐츠를 불러오는 중 오류가 발생했습니다.</p>
			<p className="text-red-500 dark:text-red-500 text-sm mt-1">{message}</p>
		</div>
	);
}

export type NotionClientRendererProps = React.ComponentProps<
	typeof NotionRenderer
>;

export const NotionClientRenderer = (props: NotionClientRendererProps) => {
	return (
		<ErrorBoundary FallbackComponent={NotionErrorFallback}>
			<NotionRenderer
				{...props}
				components={{
					nextImage: Image,
					nextLink: Link,
					Collection: () => <></>,
				}}
			/>
		</ErrorBoundary>
	);
};
