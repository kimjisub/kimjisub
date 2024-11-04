'use client';

import { ReactJsonViewProps } from 'react-json-view';
import dynamic from 'next/dynamic';

// 동적으로 react-json-view를 로드하고 SSR을 비활성화
const ReactJsonView = dynamic(() => import('react-json-view'), { ssr: false });

export type JsonViewProps = ReactJsonViewProps;

export const JsonView = (props: JsonViewProps) => {
	return <ReactJsonView {...props} />;
};
