'use client';

import React from 'react';

import useLocalStorage from '@/hooks/useLocalStorage';

export interface DebugViewProps {
	children: React.ReactNode;
}

const DebugView: React.FC<DebugViewProps> = ({ children }) => {
	const [debug, _setDebug] = useLocalStorage('debug', false);

	if (!debug) {
		return null;
	}

	return <>{children}</>;
};

export default DebugView;
