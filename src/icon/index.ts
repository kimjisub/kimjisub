import { FC, SVGProps } from 'react';

import GithubIcon from './github.svg';
import HapiIcon from './hapi.svg';
import HaproxyIcon from './haproxy.svg';
import JavaIcon from './java.svg';

export interface IconType {
	component: FC<SVGProps<SVGElement>>;
	hex: string;
}

export const Icons = {
	github: { component: GithubIcon, hex: '181717' },
	hapi: { component: HapiIcon, hex: '181717' },
	haproxy: { component: HaproxyIcon, hex: '181717' },
	java: { component: JavaIcon, hex: '181717' },
};
