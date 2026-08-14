/**
 * Stub implementations for Terbium-specific APIs
 * These provide limited or no functionality in browser mode
 */

import type { DesktopAPI, LauncherAPI, BatteryAPI, UserAPI, TDockItem, LauncherProps } from "../types";
import { getNativeTerbiumAPI } from "../env";

// Desktop API
export class TerbiumDesktop implements DesktopAPI {
	private get native() {
		return getNativeTerbiumAPI()?.desktop;
	}

	private get isTerbium(): boolean {
		return !!this.native;
	}

	preferences = {
		setTheme: async (color: string): Promise<void> => {
			if (this.isTerbium) {
				await this.native.preferences.setTheme(color);
			}
		},

		theme: async (): Promise<string> => {
			if (this.isTerbium) {
				return await this.native.preferences.theme();
			}
			return "#000000";
		},

		setAccent: async (color: string): Promise<void> => {
			if (this.isTerbium) {
				await this.native.preferences.setAccent(color);
			}
		},

		getAccent: async (): Promise<string> => {
			if (this.isTerbium) {
				return await this.native.preferences.getAccent();
			}
			return "#0078d4";
		},
	};

	wallpaper = {
		set: async (path: string): Promise<void> => {
			if (this.isTerbium) {
				await this.native.wallpaper.set(path);
			}
		},

		contain: async (): Promise<void> => {
			if (this.isTerbium) {
				await this.native.wallpaper.contain();
			}
		},

		stretch: async (): Promise<void> => {
			if (this.isTerbium) {
				await this.native.wallpaper.stretch();
			}
		},

		cover: async (): Promise<void> => {
			if (this.isTerbium) {
				await this.native.wallpaper.cover();
			}
		},

		fillMode: async (): Promise<string> => {
			if (this.isTerbium) {
				return await this.native.wallpaper.fillMode();
			}
			return "cover";
		},
	};

	dock = {
		pin: async (app: TDockItem): Promise<string> => {
			if (this.isTerbium) {
				return await this.native.dock.pin(app);
			}
			return "Not available in browser mode";
		},

		unpin: async (app: string): Promise<string> => {
			if (this.isTerbium) {
				return await this.native.dock.unpin(app);
			}
			return "Not available in browser mode";
		},
	};
}

// Launcher API
export class TerbiumLauncher implements LauncherAPI {
	private get native() {
		return getNativeTerbiumAPI()?.launcher;
	}

	private get isTerbium(): boolean {
		return !!this.native;
	}

	async addApp(props: LauncherProps): Promise<boolean> {
		if (this.isTerbium) {
			return await this.native.addApp(props);
		}
		return false;
	}

	async removeApp(name: string): Promise<boolean> {
		if (this.isTerbium) {
			return await this.native.removeApp(name);
		}
		return false;
	}
}

// Battery API
export class TerbiumBattery implements BatteryAPI {
	private get native() {
		return getNativeTerbiumAPI()?.battery;
	}

	private get isTerbium(): boolean {
		return !!this.native;
	}

	async showPercentage(): Promise<string> {
		if (this.isTerbium) {
			return await this.native.showPercentage();
		}
		return "Not available";
	}

	async hidePercentage(): Promise<string> {
		if (this.isTerbium) {
			return await this.native.hidePercentage();
		}
		return "Not available";
	}

	async canUse(): Promise<boolean> {
		if (this.isTerbium) {
			return await this.native.canUse();
		}
		return "getBattery" in navigator;
	}
}

// User API
export class TerbiumUser implements UserAPI {
	private get native() {
		return getNativeTerbiumAPI()?.user;
	}

	private get isTerbium(): boolean {
		return !!this.native;
	}

	async username(): Promise<string> {
		if (this.isTerbium) {
			return await this.native.username();
		}
		return "guest";
	}

	async pfp(): Promise<string> {
		if (this.isTerbium) {
			return await this.native.pfp();
		}
		return "";
	}

	async email(): Promise<string | null> {
		if (this.isTerbium) {
			return await this.native.email();
		}
		return null;
	}

	async id(): Promise<string> {
		if (this.isTerbium) {
			return await this.native.id();
		}
		return "browser-user";
	}

	async isGuest(): Promise<boolean> {
		if (this.isTerbium) {
			return await this.native.isGuest();
		}
		return true;
	}

	async permissions(): Promise<string[]> {
		if (this.isTerbium) {
			return await this.native.permissions();
		}
		return [];
	}
}
