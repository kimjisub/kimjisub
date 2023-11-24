'use client';

import * as React from 'react';
import { NotionRenderer } from 'react-notion-x';
import Head from 'next/head';
import { ExtendedRecordMap } from 'notion-types';
import { getPageTitle } from 'notion-utils';

export const NotionPage = ({
	recordMap,
	rootPageId,
}: {
	recordMap: ExtendedRecordMap;
	rootPageId?: string;
}) => {
	if (!recordMap) {
		return null;
	}

	const title = getPageTitle(recordMap);
	console.log(title, recordMap);

	return (
		<>
			<Head>
				<meta name="description" content="React Notion X Minimal Demo" />

				<title>{title}</title>
			</Head>

			<NotionRenderer
				rootPageId={rootPageId}
				recordMap={recordMap}
				fullPage={true}
				darkMode={false}
				disableHeader
			/>
		</>
	);
};
