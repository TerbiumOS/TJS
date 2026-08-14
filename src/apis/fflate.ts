/**
 * fflate API
 * Compression/decompression wrapper
 */

import { getNativeTerbiumAPI } from "../env";

export class TerbiumFflate {
	[key: string]: any;
}

export function createFflateProxy(): any {
	const instance = new TerbiumFflate();
	const native = getNativeTerbiumAPI()?.fflate;
	return new Proxy(instance, {
		get(target: any, prop: string) {
			if (prop in target) {
				return target[prop];
			}
			if (native && prop in native) {
				return native[prop];
			}
			return (..._args: any[]) => {
				console.warn(`[TerbiumJS] fflate.${prop} not available - consider loading fflate library`);
				console.log("Install fflate: npm install fflate");
				return null;
			};
		},
	});
}
