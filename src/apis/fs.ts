/**
 * File System API
 * Provides unified file system access with automatic fallbacks
 */

import type { FileSystemAPI, FileStats } from "../types";
import { getNativeTerbiumAPI } from "../env";

export class TerbiumFileSystem implements FileSystemAPI {
	private get native() {
		const tb = getNativeTerbiumAPI();
		return tb?.fs;
	}

	private get isTerbium(): boolean {
		return !!this.native;
	}

	promises = {
		writeFile: async (path: string, content: string | Uint8Array | ArrayBuffer, encoding: string = "utf8"): Promise<void> => {
			if (this.isTerbium) {
				return await this.native.promises.writeFile(path, content, encoding);
			}
			await this.browserWriteFile(path, content, encoding);
		},

		readFile: async (path: string, encoding: string = "utf8"): Promise<string | Uint8Array> => {
			if (this.isTerbium) {
				return await this.native.promises.readFile(path, encoding);
			}
			return await this.browserReadFile(path, encoding);
		},

		readdir: async (path: string): Promise<string[]> => {
			if (this.isTerbium) {
				return await this.native.promises.readdir(path);
			}
			return await this.browserReadDir(path);
		},

		mkdir: async (path: string, options?: { recursive?: boolean }): Promise<void> => {
			if (this.isTerbium) {
				return await this.native.promises.mkdir(path, options);
			}
			console.warn("[TerbiumJS] fs.promises.mkdir not available in browser mode");
		},

		stat: async (path: string): Promise<FileStats> => {
			if (this.isTerbium) {
				const stats = await this.native.promises.stat(path);
				return {
					name: stats.name || path.split("/").pop() || "",
					size: stats.size || 0,
					type: stats.type || "FILE",
					mtime: stats.mtime,
					ctime: stats.ctime,
					isFile: () => stats.type === "FILE",
					isDirectory: () => stats.type === "DIRECTORY",
					isSymbolicLink: () => stats.type === "SYMLINK",
				};
			}
			throw new Error("stat() not available in browser mode");
		},

		unlink: async (path: string): Promise<void> => {
			if (this.isTerbium) {
				return await this.native.promises.unlink(path);
			}
			throw new Error("unlink() not available in browser mode");
		},

		rmdir: async (path: string, options?: { recursive?: boolean }): Promise<void> => {
			if (this.isTerbium) {
				return await this.native.promises.rmdir(path, options);
			}
			throw new Error("rmdir() not available in browser mode");
		},

		rename: async (oldPath: string, newPath: string): Promise<void> => {
			if (this.isTerbium) {
				return await this.native.promises.rename(oldPath, newPath);
			}
			throw new Error("rename() not available in browser mode");
		},

		copyFile: async (src: string, dest: string): Promise<void> => {
			if (this.isTerbium) {
				return await this.native.promises.copyFile(src, dest);
			}
			throw new Error("copyFile() not available in browser mode");
		},

		exists: async (path: string): Promise<boolean> => {
			if (this.isTerbium) {
				return await this.native.promises.exists(path);
			}
			return false;
		},

		readlink: async (path: string): Promise<string> => {
			if (this.isTerbium) {
				return await this.native.promises.readlink(path);
			}
			throw new Error("readlink() not available in browser mode");
		},

		symlink: async (target: string, path: string): Promise<void> => {
			if (this.isTerbium) {
				return await this.native.promises.symlink(target, path);
			}
			throw new Error("symlink() not available in browser mode");
		},
	};

	exists(path: string, callback: (exists: boolean) => void): void {
		if (this.isTerbium) {
			this.native.exists(path, callback);
			return;
		}
		callback(false);
	}

	readdir(path: string, callback: (err: Error | null, files: string[]) => void): void {
		if (this.isTerbium) {
			this.native.readdir(path, callback);
			return;
		}
		this.browserReadDir(path)
			.then(files => callback(null, files))
			.catch(err => callback(err, []));
	}

	stat(path: string, callback: (err: Error | null, stats: FileStats) => void): void {
		if (this.isTerbium) {
			this.native.stat(path, callback);
			return;
		}
		callback(new Error("stat() not available in browser mode"), {} as FileStats);
	}

	private async browserWriteFile(path: string, content: string | Uint8Array | ArrayBuffer, _encoding: string): Promise<void> {
		if ("showSaveFilePicker" in window) {
			try {
				const handle = await (window as any).showSaveFilePicker({
					suggestedName: path.split("/").pop() || "file.txt",
				});
				const writable = await handle.createWritable();
				if (typeof content === "string") {
					await writable.write(content);
				} else if (content instanceof Uint8Array) {
					await writable.write(content);
				} else if (content instanceof ArrayBuffer) {
					await writable.write(content);
				}
				await writable.close();
				return;
			} catch (err) {
				throw new Error("Failed to write file: User cancelled or permission denied");
			}
		}
		let blob: Blob;
		if (typeof content === "string") {
			blob = new Blob([content], { type: "text/plain" });
		} else if (content instanceof Uint8Array) {
			blob = new Blob([content as any]);
		} else {
			blob = new Blob([content as any]);
		}
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = path.split("/").pop() || "file.txt";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	private async browserReadFile(_path: string, encoding: string): Promise<string | Uint8Array> {
		if ("showOpenFilePicker" in window) {
			try {
				const [handle] = await (window as any).showOpenFilePicker();
				const file = await handle.getFile();
				if (encoding === "utf8" || encoding === "utf-8") {
					return await file.text();
				} else {
					const buffer = await file.arrayBuffer();
					return new Uint8Array(buffer);
				}
			} catch (err) {
				throw new Error("Failed to read file: User cancelled or permission denied");
			}
		}

		return new Promise((resolve, reject) => {
			const input = document.createElement("input");
			input.type = "file";
			input.accept = "*/*";
			input.onchange = async e => {
				const file = (e.target as HTMLInputElement).files?.[0];
				if (!file) {
					reject(new Error("No file selected"));
					return;
				}
				if (encoding === "utf8" || encoding === "utf-8") {
					const text = await file.text();
					resolve(text);
				} else {
					const buffer = await file.arrayBuffer();
					resolve(new Uint8Array(buffer));
				}
			};
			input.click();
		});
	}

	private async browserReadDir(_path: string): Promise<string[]> {
		if ("showDirectoryPicker" in window) {
			try {
				const handle = await (window as any).showDirectoryPicker();
				const entries: string[] = [];
				for await (const entry of (handle as any).values()) {
					entries.push(entry.name);
				}
				return entries;
			} catch (err) {
				throw new Error("Failed to read directory: User cancelled or permission denied");
			}
		}
		throw new Error("Directory operations not supported in this browser");
	}
}
