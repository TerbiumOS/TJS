/**
 * Libcurl API
 * HTTP client with browser fetch fallback
 */

import type { LibcurlAPI } from "../types";
import { getNativeTerbiumAPI } from "../env";

export class TerbiumLibcurl implements LibcurlAPI {
	private get native() {
		const tb = getNativeTerbiumAPI();
		return tb?.libcurl;
	}

	private get isTerbium(): boolean {
		return !!this.native;
	}

	private websocketUrl: string = "";

	async fetch(url: string, options?: RequestInit): Promise<Response> {
		if (this.isTerbium) {
			return await this.native.fetch(url, options);
		}
		return await fetch(url, options);
	}

	set_websocket(url: string): void {
		if (this.isTerbium) {
			this.native.set_websocket(url);
			return;
		}
		this.websocketUrl = url;
	}

	get_websocket(): string {
		if (this.isTerbium && this.native.get_websocket) {
			return this.native.get_websocket();
		}
		return this.websocketUrl;
	}
	[key: string]: any;
}

export function createLibcurlProxy(): LibcurlAPI {
	const instance = new TerbiumLibcurl();
	return new Proxy(instance, {
		get(target: any, prop: string) {
			if (prop in target) {
				return target[prop];
			}
			const native = target.native;
			if (native && prop in native) {
				return native[prop];
			}
			return () => {
				console.warn(`[TerbiumJS] Libcurl.${prop} not available in browser mode`);
			};
		},
	});
}
