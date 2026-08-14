/**
 * System API
 * Comprehensive system operations with browser fallbacks
 */

import type { SystemAPI, User, WindowConfig } from "../types";
import { getNativeTerbiumAPI } from "../env";

export class TerbiumSystem implements SystemAPI {
	private get native() {
		const tb = getNativeTerbiumAPI();
		return tb?.system;
	}

	private get isTerbium(): boolean {
		return !!this.native;
	}

	version(): string | number {
		if (this.isTerbium) {
			return this.native.version();
		}
		return `Browser ${navigator.userAgent.split(" ").pop()}`;
	}

	get instance() {
		if (this.isTerbium) {
			return this.native.instance;
		}
		return {
			version: this.version(),
			platform: "browser",
		};
	}

	async openApp(pkg: string, options?: Partial<WindowConfig>): Promise<void> {
		if (this.isTerbium) {
			return await this.native.openApp(pkg, options);
		}
		console.warn("[TerbiumJS] System.openApp not available in browser mode");
	}

	async download(url: string, location: string): Promise<void> {
		if (this.isTerbium) {
			return await this.native.download(url, location);
		}
		try {
			const response = await fetch(url);
			const blob = await response.blob();
			const blobUrl = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = blobUrl;
			a.download = location.split("/").pop() || "download";
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(blobUrl);
		} catch (err) {
			console.error("[TerbiumJS] Download failed:", err);
			throw err;
		}
	}

	async exportfs(startPath: string = "/", filename: string = "tbfs.backup.zip"): Promise<string> {
		if (this.isTerbium) {
			return await this.native.exportfs(startPath, filename);
		}
		console.warn("[TerbiumJS] System.exportfs not available in browser mode");
		return "";
	}

	async scanintegrity(): Promise<string[]> {
		if (this.isTerbium) {
			return await this.native.scanintegrity();
		}
		return [];
	}

	get TSLParser() {
		if (this.isTerbium) {
			return this.native.TSLParser;
		}
		return {
			parse: (_tsl: string) => {
				console.warn("[TerbiumJS] TSLParser not available in browser mode");
				return {};
			},
		};
	}

	// User management
	users = {
		list: async (): Promise<string[]> => {
			if (this.isTerbium) {
				return await this.native.users.list();
			}
			return ["guest"];
		},

		add: async (user: User): Promise<boolean> => {
			if (this.isTerbium) {
				return await this.native.users.add(user);
			}
			console.warn("[TerbiumJS] System.users.add not available in browser mode");
			return false;
		},

		remove: async (id: string): Promise<boolean> => {
			if (this.isTerbium) {
				return await this.native.users.remove(id);
			}
			console.warn("[TerbiumJS] System.users.remove not available in browser mode");
			return false;
		},

		update: async (user: User): Promise<void> => {
			if (this.isTerbium) {
				return await this.native.users.update(user);
			}
			console.warn("[TerbiumJS] System.users.update not available in browser mode");
		},

		renameUser: async (olduser: string, newuser: string): Promise<void> => {
			if (this.isTerbium) {
				return await this.native.users.renameUser(olduser, newuser);
			}
			console.warn("[TerbiumJS] System.users.renameUser not available in browser mode");
		},
	};

	// Boot menu management
	bootmenu = {
		addEntry: async (name: string, file: string): Promise<void> => {
			if (this.isTerbium) {
				return await this.native.bootmenu.addEntry(name, file);
			}
			console.warn("[TerbiumJS] System.bootmenu.addEntry not available in browser mode");
		},

		removeEntry: async (name: string): Promise<void> => {
			if (this.isTerbium) {
				return await this.native.bootmenu.removeEntry(name);
			}
			console.warn("[TerbiumJS] System.bootmenu.removeEntry not available in browser mode");
		},
	};

	// Startup processes management
	startup = {
		addProc: async (pkgorname: string, target: "System" | "User", cmd?: string): Promise<void> => {
			if (this.isTerbium) {
				return await this.native.startup.addProc(pkgorname, target, cmd);
			}
			console.warn("[TerbiumJS] System.startup.addProc not available in browser mode");
		},

		removeProc: async (pkgorname: string, target: "System" | "User"): Promise<void> => {
			if (this.isTerbium) {
				return await this.native.startup.removeProc(pkgorname, target);
			}
			console.warn("[TerbiumJS] System.startup.removeProc not available in browser mode");
		},

		enable: async (pkgorname: string, target: "System" | "User"): Promise<void> => {
			if (this.isTerbium) {
				return await this.native.startup.enable(pkgorname, target);
			}
			console.warn("[TerbiumJS] System.startup.enable not available in browser mode");
		},

		disable: async (pkgorname: string, target: "System" | "User"): Promise<void> => {
			if (this.isTerbium) {
				return await this.native.startup.disable(pkgorname, target);
			}
			console.warn("[TerbiumJS] System.startup.disable not available in browser mode");
		},

		list: async (): Promise<any[]> => {
			if (this.isTerbium) {
				return await this.native.startup.list();
			}
			return [];
		},
	};
}
