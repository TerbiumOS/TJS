/**
 * Node and Dusk Runtime APIs
 * WebContainer compatibility and Dusk runtime access
 */

import type { NodeAPI, DuskAPI } from "../types";
import { getNativeTerbiumAPI } from "../env";

export class TerbiumNode implements NodeAPI {
	private get native() {
		const tb = getNativeTerbiumAPI();
		return tb?.node;
	}

	private get isTerbium(): boolean {
		return !!this.native;
	}

	get webContainer(): any {
		if (this.isTerbium) {
			return this.native.webContainer;
		}
		return {
			mount: () => Promise.reject(new Error("WebContainer not available in browser mode")),
			spawn: () => Promise.reject(new Error("WebContainer not available in browser mode")),
		};
	}

	get servers(): Map<number, string> {
		if (this.isTerbium) {
			return this.native.servers;
		}
		return new Map();
	}

	get isReady(): boolean {
		if (this.isTerbium) {
			return this.native.isReady;
		}
		return false;
	}

	async start(): Promise<void> {
		if (this.isTerbium) {
			return await this.native.start();
		}
		console.warn("[TerbiumJS] Node.start not available in browser mode");
	}

	stop(): boolean {
		if (this.isTerbium) {
			return this.native.stop();
		}
		console.warn("[TerbiumJS] Node.stop not available in browser mode");
		return false;
	}
}

export class TerbiumDusk implements DuskAPI {
	private get native() {
		const tb = getNativeTerbiumAPI();
		return tb?.dusk;
	}

	private get isTerbium(): boolean {
		return !!this.native;
	}

	get runtime(): any {
		if (this.isTerbium) {
			return this.native.runtime;
		}
		return null;
	}

	get processManager(): any {
		if (this.isTerbium) {
			return this.native.processManager;
		}
		return null;
	}

	get isReady(): boolean {
		if (this.isTerbium) {
			return this.native.isReady;
		}
		return false;
	}

	get servers(): Map<number, string> {
		if (this.isTerbium) {
			return this.native.servers;
		}
		return new Map();
	}

	async start(): Promise<void> {
		if (this.isTerbium) {
			return await this.native.start();
		}
		console.warn("[TerbiumJS] Dusk.start not available in browser mode");
	}

	async stop(): Promise<void> {
		if (this.isTerbium) {
			return await this.native.stop();
		}
		console.warn("[TerbiumJS] Dusk.stop not available in browser mode");
	}
}
