import abletonlive from './abletonlive.svg?raw';
import editorconfig from './editorconfig.svg?raw';
import emqx from './emqx.svg?raw';
import esp32 from './esp32.svg?raw';
import flstudio from './flstudio.svg?raw';
import grpc from './grpc.svg?raw';
import hapi from './hapi.svg?raw';
import haproxy from './haproxy.svg?raw';
import java from './java.svg?raw';
import marp from './marp.svg?raw';
import modbus from './modbus.svg?raw';

export interface IconSvgType {
	svgCode: string;
	hex: string;
}

export const IconSvgCodes = {
	abletonlive: { svgCode: abletonlive, hex: 'eeeeee' },
	editorconfig: { svgCode: editorconfig, hex: 'eeeeee' },
	emqx: { svgCode: emqx, hex: 'eeeeee' },
	esp32: { svgCode: esp32, hex: 'eeeeee' },
	flstudio: { svgCode: flstudio, hex: 'eeeeee' },
	grpc: { svgCode: grpc, hex: 'eeeeee' },
	hapi: { svgCode: hapi, hex: 'eeeeee' },
	haproxy: { svgCode: haproxy, hex: '256EA5' },
	java: { svgCode: java, hex: 'DE6856' },
	marp: { svgCode: marp, hex: 'eeeeee' },
	modbus: { svgCode: modbus, hex: 'eeeeee' },
};
