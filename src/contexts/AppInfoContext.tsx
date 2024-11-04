'use client';

import { createContext, ReactNode, useEffect, useState } from 'react';

import packageJson from '../../package.json';

interface AppInfoContextType {
	appName: string;
	version: string;
}

export const AppInfoContext = createContext<AppInfoContextType | undefined>(
	undefined,
);

interface AppInfoProviderProps {
	children: ReactNode;
}

export const AppInfoProvider: React.FC<AppInfoProviderProps> = ({
	children,
}) => {
	const [appInfo, setAppInfo] = useState<AppInfoContextType>({
		appName: '',
		version: '',
	});

	useEffect(() => {
		const info = {
			appName: packageJson.name,
			version: packageJson.version,
		};
		console.log(info);
		setAppInfo(info);
	}, []);

	return (
		<AppInfoContext.Provider value={appInfo}>
			{children}
		</AppInfoContext.Provider>
	);
};
