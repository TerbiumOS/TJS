/**
 * Window API
 * Window management (primarily for Terbium, limited browser support)
 */

import type { WindowAPI, WindowConfig } from "../types";
import { getNativeTerbiumAPI } from "../env";

export class TerbiumWindow implements WindowAPI {
	private get native() {
		const tb = getNativeTerbiumAPI();
		return tb?.window;
	}

	private get isTerbium(): boolean {
		return !!this.native;
	}

	/**
	 * Create a new window
	 * Terbium: uses tb.window.create
	 * Browser: uses window.open
	 */
	create(config: WindowConfig): void {
		if (this.isTerbium) {
			this.native.create(config);
			return;
		}
		const features: string[] = [];
		if (config.size?.width) features.push(`width=${config.size.width}`);
		if (config.size?.height) features.push(`height=${config.size.height}`);
		const title = typeof config.title === "string" ? config.title : config.title?.text || "_blank";
		window.open(config.src || "about:blank", title, features.join(","));
	}

	/**
	 * Close current window
	 * Terbium: uses tb.window.close
	 * Browser: uses window.close (may be blocked)
	 */
	close(): void {
		if (this.isTerbium) {
			this.native.close();
			return;
		}
		window.close();
	}

	/**
	 * Minimize current window (Terbium only)
	 */
	minimize(): void {
		if (this.isTerbium) {
			this.native.minimize();
		}
	}

	/**
	 * Maximize current window (Terbium only)
	 */
	maximize(): void {
		if (this.isTerbium) {
			this.native.maximize();
		}
	}

	/**
	 * Reload current window
	 * Terbium: uses tb.window.reload
	 * Browser: uses location.reload
	 */
	reload(): void {
		if (this.isTerbium) {
			this.native.reload();
			return;
		}
		location.reload();
	}

	/**
	 * Get window ID (Terbium only)
	 */
	getId(): number {
		if (this.isTerbium) {
			return this.native.getId();
		}
		return 0;
	}

	/**
	 * Change window source (Terbium only)
	 */
	changeSrc(src: string): void {
		if (this.isTerbium) {
			this.native.changeSrc(src);
			return;
		}
		location.href = src;
	}

	// Content management
	content = {
		get: async (): Promise<HTMLDivElement> => {
			if (this.isTerbium) {
				return await this.native.content.get();
			}
			return document.body as any;
		},

		set: (content: string): void => {
			if (this.isTerbium) {
				this.native.content.set(content);
				return;
			}
			document.body.innerHTML = content;
		},
	};

	// Titlebar management (Terbium only)
	titlebar = {
		setColor: (color: string): void => {
			if (this.isTerbium) {
				this.native.titlebar.setColor(color);
			}
		},

		setText: (text: string): void => {
			if (this.isTerbium) {
				this.native.titlebar.setText(text);
			} else {
				document.title = text;
			}
		},

		setBackgroundColor: (color: string): void => {
			if (this.isTerbium) {
				this.native.titlebar.setBackgroundColor(color);
			}
		},
	};

	// App Island controls (Terbium only)
	island = {
		addControl: (props: any): void => {
			if (this.isTerbium) {
				this.native.island.addControl(props);
			}
		},

		removeControl: (control_id: string): void => {
			if (this.isTerbium) {
				this.native.island.removeControl(control_id);
			}
		},
	};
}
