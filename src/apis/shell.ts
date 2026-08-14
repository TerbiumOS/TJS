/**
 * Shell API
 * Provides shell-like file operations with browser fallbacks
 */

import type { ShellAPI } from "../types";
import { getNativeTerbiumAPI } from "../env";

export class TerbiumShell implements ShellAPI {
	private get native() {
		const tb = getNativeTerbiumAPI();
		return tb?.sh;
	}

	private get isTerbium(): boolean {
		return !!this.native;
	}

	promises = {
		rm: async (path: string, options?: { recursive?: boolean; force?: boolean }): Promise<void> => {
			if (this.isTerbium) {
				return await this.native.promises.rm(path, options);
			}
			console.warn("[TerbiumJS] Shell.rm not available in browser mode");
		},

		cp: async (src: string, dest: string, options?: { recursive?: boolean }): Promise<void> => {
			if (this.isTerbium) {
				return await this.native.promises.cp(src, dest, options);
			}
			console.warn("[TerbiumJS] Shell.cp not available in browser mode");
		},

		mv: async (src: string, dest: string): Promise<void> => {
			if (this.isTerbium) {
				return await this.native.promises.mv(src, dest);
			}
			console.warn("[TerbiumJS] Shell.mv not available in browser mode");
		},

		exec: async (command: string): Promise<{ stdout: string; stderr: string; exitCode: number }> => {
			if (this.isTerbium) {
				return await this.native.promises.exec(command);
			}
			console.warn("[TerbiumJS] Shell.exec not available in browser mode");
			return { stdout: "", stderr: "Not supported in browser", exitCode: 1 };
		},
	};

	rm(path: string, options: any, callback: (err: Error | null) => void): void {
		if (this.isTerbium) {
			this.native.rm(path, options, callback);
			return;
		}
		callback(new Error("Not supported in browser mode"));
	}

	cp(src: string, dest: string, options: any, callback: (err: Error | null) => void): void {
		if (this.isTerbium) {
			this.native.cp(src, dest, options, callback);
			return;
		}
		callback(new Error("Not supported in browser mode"));
	}

	mv(src: string, dest: string, callback: (err: Error | null) => void): void {
		if (this.isTerbium) {
			this.native.mv(src, dest, callback);
			return;
		}
		callback(new Error("Not supported in browser mode"));
	}

	exec(command: string, callback: (err: Error | null, result: any) => void): void {
		if (this.isTerbium) {
			this.native.exec(command, callback);
			return;
		}
		callback(new Error("Not supported in browser mode"), null);
	}
}
