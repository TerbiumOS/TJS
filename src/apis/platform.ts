/**
 * Platform API
 * Platform detection
 */

import type { PlatformAPI } from "../types";
import { getNativeTerbiumAPI } from "../env";

export class TerbiumPlatform implements PlatformAPI {
	private get native() {
		const tb = getNativeTerbiumAPI();
		return tb?.platform;
	}

	private get isTerbium(): boolean {
		return !!this.native;
	}

	async getPlatform(): Promise<"desktop" | "mobile"> {
		if (this.isTerbium) {
			return await this.native.getPlatform();
		}
		const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
		const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
		const isSmallScreen = window.innerWidth < 768;
		if (isMobile || (isTouchDevice && isSmallScreen)) {
			return "mobile";
		}
		return "desktop";
	}
}
