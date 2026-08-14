/**
 * Theme API
 * Deprecated API maintained for compatibility
 */

import type { ThemeAPI } from "../types";
import { getNativeTerbiumAPI } from "../env";

export class TerbiumTheme implements ThemeAPI {
	private get native() {
		const tb = getNativeTerbiumAPI();
		return tb?.theme;
	}

	private get isTerbium(): boolean {
		return !!this.native;
	}

	async get(): Promise<any> {
		if (this.isTerbium) {
			return await this.native.get();
		}
		const isDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
		return isDark ? "dark" : "light";
	}

	async set(data: any): Promise<boolean> {
		if (this.isTerbium) {
			return await this.native.set(data);
		}
		console.warn("[TerbiumJS] Theme.set is deprecated and not available in browser mode");
		return false;
	}
}
