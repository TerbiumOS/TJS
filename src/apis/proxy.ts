/**
 * Proxy API
 * Manages proxy settings (Terbium only, deprecated UV support)
 */

import type { ProxyAPI } from "../types";
import { getNativeTerbiumAPI } from "../env";

export class TerbiumProxy implements ProxyAPI {
	private get native() {
		const tb = getNativeTerbiumAPI();
		return tb?.proxy;
	}

	private get isTerbium(): boolean {
		return !!this.native;
	}

	async get(): Promise<"Ultraviolet" | "Scramjet"> {
		if (this.isTerbium) {
			return await this.native.get();
		}
		return "Scramjet";
	}

	async set(proxy: "Ultraviolet" | "Scramjet"): Promise<boolean> {
		if (this.isTerbium) {
			return await this.native.set(proxy);
		}
		console.warn("[TerbiumJS] Proxy.set not available in browser mode");
		return false;
	}

	async updateSWs(): Promise<boolean> {
		if (this.isTerbium) {
			return await this.native.updateSWs();
		}
		console.warn("[TerbiumJS] Proxy.updateSWs not available in browser mode");
		return false;
	}

	async encode(url: string, encoder: string): Promise<string> {
		if (this.isTerbium) {
			return await this.native.encode(url, encoder);
		}
		if (encoder.toLowerCase() === "xor") {
			return btoa(url);
		}
		throw new Error("Encoder not supported in browser mode");
	}

	async decode(url: string, decoder: string): Promise<string> {
		if (this.isTerbium) {
			return await this.native.decode(url, decoder);
		}
		if (decoder.toLowerCase() === "xor") {
			try {
				return atob(url);
			} catch {
				return url;
			}
		}

		throw new Error("Decoder not supported in browser mode");
	}
}
