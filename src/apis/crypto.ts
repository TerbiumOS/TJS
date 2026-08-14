/**
 * Crypto API
 * Password hashing and encryption
 */

import { getNativeTerbiumAPI } from "../env";

export async function createCryptoFunction(): Promise<(pass: string, file: string) => Promise<string>> {
	const native = getNativeTerbiumAPI();
	if (native?.crypto) {
		return native.crypto;
	}
	return async (pass: string, file: string): Promise<string> => {
		try {
			const encoder = new TextEncoder();
			const data = encoder.encode(pass + file);

			const hashBuffer = await crypto.subtle.digest("SHA-256", data);
			const hashArray = Array.from(new Uint8Array(hashBuffer));
			const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

			return hashHex;
		} catch (err) {
			console.error("[TerbiumJS] Crypto operation failed:", err);
			throw err;
		}
	};
}
