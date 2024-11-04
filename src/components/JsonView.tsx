'use client';

import * as React from 'react';
import ReactJsonView, { ReactJsonViewProps } from 'react-json-view';

export type JsonViewProps = ReactJsonViewProps;

export const JsonView = (props: JsonViewProps) => {
	return <ReactJsonView {...props} />;
};
