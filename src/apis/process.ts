/**
 * Process API
 * Process management
 */

import type { ProcessAPI, ProcInf } from "../types";
import { getNativeTerbiumAPI } from "../env";

export class TerbiumProcess implements ProcessAPI {
	private get native() {
		const tb = getNativeTerbiumAPI();
		return tb?.process;
	}

	private get isTerbium(): boolean {
		return !!this.native;
	}

	get procs(): Record<number, ProcInf> {
		if (this.isTerbium) {
			return this.native.procs;
		}
		return {};
	}

	kill(config: string | number | any): void {
		if (this.isTerbium) {
			this.native.kill(config);
			return;
		}
		console.warn("[TerbiumJS] Process.kill not available in browser mode");
	}

	list(): Record<number, ProcInf> {
		if (this.isTerbium) {
			return this.native.list();
		}
		return {};
	}

	create(type: "window" | "runtime", config: any): void {
		if (this.isTerbium) {
			this.native.create(type, config);
			return;
		}
		console.warn("[TerbiumJS] Process.create not available in browser mode");
	}

	parse = {
		build: (src: string): void => {
			if (this.isTerbium) {
				this.native.parse.build(src);
				return;
			}
			console.warn("[TerbiumJS] Process.parse.build not available in browser mode");
		},
	};
}
