/**
 * VFS (Virtual File System) API
 * Manages remote file systems via WebDAV
 */

import type { VFSAPI } from "../types";
import { getNativeTerbiumAPI } from "../env";

export class TerbiumVFS implements VFSAPI {
	[key: string]: any;
}

export function createVFSProxy(): VFSAPI {
	const instance = new TerbiumVFS();
	const native = getNativeTerbiumAPI()?.vfs;
	return new Proxy(instance, {
		get(target: any, prop: string) {
			if (prop in target) {
				return target[prop];
			}
			if (native && prop in native) {
				return native[prop];
			}
			return (..._args: any[]) => {
				console.warn(`[TerbiumJS] VFS.${prop} not available in browser mode`);
				return Promise.resolve(null);
			};
		},
	});
}
