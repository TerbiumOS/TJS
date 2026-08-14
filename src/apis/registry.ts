/**
 * Registry API
 * Terbium's registry system (browser fallback uses sessionStorage)
 */

import { getNativeTerbiumAPI } from "../env";

export class TerbiumRegistry {
	private get native() {
		const tb = getNativeTerbiumAPI();
		return tb?.registry;
	}

	private get isTerbium(): boolean {
		return !!this.native;
	}

	private browserRegistry: Map<string, any> = new Map();

	get(key: string): any {
		if (this.isTerbium) {
			return this.native.get(key);
		}
		return this.browserRegistry.get(key);
	}

	set(key: string, value: any): void {
		if (this.isTerbium) {
			this.native.set(key, value);
			return;
		}
		this.browserRegistry.set(key, value);
	}

	delete(key: string): void {
		if (this.isTerbium) {
			this.native.delete(key);
			return;
		}
		this.browserRegistry.delete(key);
	}

	has(key: string): boolean {
		if (this.isTerbium) {
			return this.native.has(key);
		}
		return this.browserRegistry.has(key);
	}

	clear(): void {
		if (this.isTerbium) {
			this.native.clear();
			return;
		}
		this.browserRegistry.clear();
	}

	keys(): string[] {
		if (this.isTerbium) {
			return this.native.keys();
		}
		return Array.from(this.browserRegistry.keys());
	}

	entries(): [string, any][] {
		if (this.isTerbium) {
			return this.native.entries();
		}
		return Array.from(this.browserRegistry.entries());
	}
}
