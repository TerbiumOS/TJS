/**
 * Environment Detection
 * Detects if running in Terbium OS or a standard browser
 */

import type { Environment } from "./types";

/**
 * Checks if the current environment is Terbium OS
 */
export function isTerbiumEnvironment(): boolean {
	if (typeof window === "undefined") return false;
	return typeof (window as any).tb !== "undefined" && typeof (window as any).tb.fs !== "undefined" && typeof (window as any).tfs !== "undefined";
}

/**
 * Gets the current environment type
 */
export function getEnvironment(): Environment {
	return isTerbiumEnvironment() ? "terbium" : "browser";
}

/**
 * Gets the native Terbium API if available
 */
export function getNativeTerbiumAPI(): any | null {
	if (!isTerbiumEnvironment()) return null;
	return (window as any).tb;
}

/**
 * Logs environment detection info (debug mode)
 */
export function logEnvironmentInfo(debug: boolean = false): void {
	if (!debug) return;
	const env = getEnvironment();
	console.log(`[Terbium.js] Environment: ${env}`);
	if (env === "terbium") {
		const tb = getNativeTerbiumAPI();
		console.log("[Terbium.js] Native API detected:", {
			fs: !!tb?.fs,
			window: !!tb?.window,
			user: !!tb?.user,
			desktop: !!tb?.desktop,
		});
	} else {
		console.log("[Terbium.js] Running in browser mode with fallbacks");
	}
}

/**
 * Checks if a specific Terbium API is available
 */
export function hasAPI(apiName: string): boolean {
	const tb = getNativeTerbiumAPI();
	if (!tb) return false;
	const parts = apiName.split(".");
	let current = tb;
	for (const part of parts) {
		if (!current[part]) return false;
		current = current[part];
	}
	return true;
}
