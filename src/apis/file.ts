/**
 * File Handler API
 * File associations and custom icons
 */

import type { FileAPI } from "../types";
import { getNativeTerbiumAPI } from "../env";

export class TerbiumFile implements FileAPI {
	private get native() {
		const tb = getNativeTerbiumAPI();
		return tb?.file;
	}

	private get isTerbium(): boolean {
		return !!this.native;
	}

	handler = {
		openFile: (path: string, type: string): void => {
			if (this.isTerbium) {
				this.native.handler.openFile(path, type);
				return;
			}
			console.warn("[TerbiumJS] File.handler.openFile not available in browser mode");
		},

		addHandler: (app: string, ext: string): void => {
			if (this.isTerbium) {
				this.native.handler.addHandler(app, ext);
				return;
			}
			console.warn("[TerbiumJS] File.handler.addHandler not available in browser mode");
		},

		removeHandler: (ext: string): void => {
			if (this.isTerbium) {
				this.native.handler.removeHandler(ext);
				return;
			}
			console.warn("[TerbiumJS] File.handler.removeHandler not available in browser mode");
		},
	};

	icons = {
		get: async (ext: string): Promise<string> => {
			if (this.isTerbium) {
				return await this.native.icons.get(ext);
			}
			const iconMap: Record<string, string> = {
				jpg: "🖼️",
				jpeg: "🖼️",
				png: "🖼️",
				gif: "🖼️",
				svg: "🖼️",
				mp4: "🎥",
				avi: "🎥",
				mov: "🎥",
				mkv: "🎥",
				mp3: "🎵",
				wav: "🎵",
				ogg: "🎵",
				flac: "🎵",
				pdf: "📄",
				doc: "📄",
				docx: "📄",
				txt: "📄",
				zip: "📦",
				rar: "📦",
				"7z": "📦",
				tar: "📦",
				js: "📜",
				ts: "📜",
				jsx: "📜",
				tsx: "📜",
				html: "📜",
				css: "📜",
				json: "📜",
			};
			return iconMap[ext.toLowerCase()] || "📄";
		},

		set: async (ext: string, iconPath: string): Promise<boolean> => {
			if (this.isTerbium) {
				return await this.native.icons.set(ext, iconPath);
			}
			console.warn("[TerbiumJS] File.icons.set not available in browser mode");
			return false;
		},
		remove: async (ext: string): Promise<boolean> => {
			if (this.isTerbium) {
				return await this.native.icons.remove(ext);
			}
			console.warn("[TerbiumJS] File.icons.remove not available in browser mode");
			return false;
		},
	};
}
