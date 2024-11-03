'use client';

import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useState,
	useEffect,
} from 'react';
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
		setAppInfo({
			appName: packageJson.name,
			version: packageJson.version,
		});
	}, []);

	useEffect(() => {
		console.log(appInfo);
	}, [appInfo]);

	return (
		<AppInfoContext.Provider value={appInfo}>
			{children}
		</AppInfoContext.Provider>
	);
};
