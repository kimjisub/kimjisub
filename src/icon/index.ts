import { FC, SVGProps } from 'react';

import abletonlive from './abletonlive.svg';
import editorconfig from './editorconfig.svg';
import emqx from './emqx.svg';
import esp32 from './esp32.svg';
import flstudio from './flstudio.svg';
import grpc from './grpc.svg';
import hapi from './hapi.svg';
import haproxy from './haproxy.svg';
import java from './java.svg';
import marp from './marp.svg';
import modbus from './modbus.svg';

export interface IconType {
	component: FC<SVGProps<SVGElement>>;
	hex: string;
}

export const Icons = {
	abletonlive: { component: abletonlive, hex: 'eeeeee' },
	editorconfig: { component: editorconfig, hex: 'eeeeee' },
	emqx: { component: emqx, hex: 'eeeeee' },
	esp32: { component: esp32, hex: 'eeeeee' },
	flstudio: { component: flstudio, hex: 'eeeeee' },
	grpc: { component: grpc, hex: 'eeeeee' },
	hapi: { component: hapi, hex: 'eeeeee' },
	haproxy: { component: haproxy, hex: '256EA5' },
	java: { component: java, hex: 'DE6856' },
	marp: { component: marp, hex: 'eeeeee' },
	modbus: { component: modbus, hex: 'eeeeee' },
};
