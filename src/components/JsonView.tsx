'use client';

import * as React from 'react';
import ReactJsonView, { ReactJsonViewProps } from 'react-json-view';

export interface JsonViewProps extends ReactJsonViewProps {}

export const JsonView = (props: JsonViewProps) => {
	return <ReactJsonView {...props} />;
};
