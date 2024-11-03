'use client';

import * as React from 'react';
import { NotionRenderer } from 'react-notion-x';
import Image from 'next/image';
import Link from 'next/link';

export interface NotionClientRendererProps
	extends React.ComponentProps<typeof NotionRenderer> {}

export const NotionClientRenderer = (props: NotionClientRendererProps) => {
	return (
		<NotionRenderer
			{...props}
			components={{
				nextImage: Image,
				nextLink: Link,
			}}
		/>
	);
};
