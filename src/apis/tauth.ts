/**
 * TAuth API
 * Terbium Cloud authentication and sync
 */

import type { TAuthAPI } from "../types";
import { getNativeTerbiumAPI } from "../env";

export class TerbiumTAuth implements TAuthAPI {
	private get native() {
		const tb = getNativeTerbiumAPI();
		return tb?.tauth;
	}

	private get isTerbium(): boolean {
		return !!this.native;
	}

	get client(): any {
		if (this.isTerbium) {
			return this.native.client;
		}
		return {
			signIn: () => Promise.reject(new Error("TAuth not available in browser mode")),
			signOut: () => Promise.reject(new Error("TAuth not available in browser mode")),
		};
	}

	async signIn(): Promise<any> {
		if (this.isTerbium) {
			return await this.native.signIn();
		}
		throw new Error("TAuth.signIn not available in browser mode");
	}

	async signOut(): Promise<void> {
		if (this.isTerbium) {
			return await this.native.signOut();
		}
		console.warn("[TerbiumJS] TAuth.signOut not available in browser mode");
	}

	async isTACC(username?: string): Promise<boolean> {
		if (this.isTerbium) {
			return await this.native.isTACC(username);
		}
		return false;
	}

	async updateInfo(data: any): Promise<void> {
		if (this.isTerbium) {
			return await this.native.updateInfo(data);
		}
		console.warn("[TerbiumJS] TAuth.updateInfo not available in browser mode");
	}

	async reauth(): Promise<void> {
		if (this.isTerbium) {
			return await this.native.reauth();
		}
		throw new Error("TAuth.reauth not available in browser mode");
	}

	sync = {
		retreive: async (): Promise<void> => {
			if (this.isTerbium) {
				return await this.native.sync.retreive();
			}
			console.warn("[TerbiumJS] TAuth.sync.retreive not available in browser mode");
		},

		upload: async (): Promise<void> => {
			if (this.isTerbium) {
				return await this.native.sync.upload();
			}
			console.warn("[TerbiumJS] TAuth.sync.upload not available in browser mode");
		},
		isSyncing: false,
	};

	async getInfo(username?: string): Promise<any> {
		if (this.isTerbium) {
			return await this.native.getInfo(username);
		}
		return null;
	}
}
