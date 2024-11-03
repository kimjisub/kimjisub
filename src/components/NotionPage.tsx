'use client';

import * as React from 'react';
import { NotionRenderer } from 'react-notion-x';

export interface NotionClientRendererProps
	extends React.ComponentProps<typeof NotionRenderer> {}

export const NotionClientRenderer = (props: NotionClientRendererProps) => {
	return <NotionRenderer {...props} />;
};
