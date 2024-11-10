import abletonliveRaw from './abletonlive.svg?raw';
import editorconfigRaw from './editorconfig.svg?raw';
import emqxRaw from './emqx.svg?raw';
import esp32Raw from './esp32.svg?raw';
import flstudioRaw from './flstudio.svg?raw';
import grpcRaw from './grpc.svg?raw';
import hapiRaw from './hapi.svg?raw';
import haproxyRaw from './haproxy.svg?raw';
import javaRaw from './java.svg?raw';
import marpRaw from './marp.svg?raw';
import modbusRaw from './modbus.svg?raw';

export interface IconSvgType {
	svgCode: string;
	hex: string;
}

export const IconSvgCodes = {
	abletonlive: { svgCode: abletonliveRaw, hex: 'eeeeee' },
	editorconfig: { svgCode: editorconfigRaw, hex: 'eeeeee' },
	emqx: { svgCode: emqxRaw, hex: 'eeeeee' },
	esp32: { svgCode: esp32Raw, hex: 'eeeeee' },
	flstudio: { svgCode: flstudioRaw, hex: 'eeeeee' },
	grpc: { svgCode: grpcRaw, hex: 'eeeeee' },
	hapi: { svgCode: hapiRaw, hex: 'eeeeee' },
	haproxy: { svgCode: haproxyRaw, hex: '256EA5' },
	java: { svgCode: javaRaw, hex: 'DE6856' },
	marp: { svgCode: marpRaw, hex: 'eeeeee' },
	modbus: { svgCode: modbusRaw, hex: 'eeeeee' },
};
