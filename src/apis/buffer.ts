/**
 * Buffer API
 * Provides Buffer-like operations compatible with Terbium
 */

import type { BufferAPI } from "../types";
import { getNativeTerbiumAPI } from "../env";

export class TerbiumBuffer implements BufferAPI {
	private get native() {
		const tb = getNativeTerbiumAPI();
		return tb?.buffer;
	}

	private get isTerbium(): boolean {
		return !!this.native;
	}

	from(data: string | Uint8Array | ArrayBuffer | number[], encoding?: string): Uint8Array {
		if (this.isTerbium) {
			return this.native.from(data, encoding);
		}
		if (typeof data === "string") {
			const encoder = new TextEncoder();
			return encoder.encode(data);
		}
		if (data instanceof Uint8Array) {
			return data;
		}
		if (data instanceof ArrayBuffer) {
			return new Uint8Array(data);
		}
		if (Array.isArray(data)) {
			return new Uint8Array(data);
		}
		return new Uint8Array(0);
	}

	alloc(size: number, fill: number = 0): Uint8Array {
		if (this.isTerbium) {
			return this.native.alloc(size, fill);
		}
		const buffer = new Uint8Array(size);
		if (fill !== 0) {
			buffer.fill(fill);
		}
		return buffer;
	}

	concat(buffers: Uint8Array[], totalLength?: number): Uint8Array {
		if (this.isTerbium) {
			return this.native.concat(buffers, totalLength);
		}
		const length = totalLength ?? buffers.reduce((acc, buf) => acc + buf.length, 0);
		const result = new Uint8Array(length);
		let offset = 0;
		for (const buffer of buffers) {
			result.set(buffer, offset);
			offset += buffer.length;
			if (offset >= length) break;
		}
		return result;
	}

	isBuffer(obj: any): boolean {
		if (this.isTerbium) {
			return this.native.isBuffer(obj);
		}
		return obj instanceof Uint8Array || obj instanceof ArrayBuffer;
	}

	toString(buffer: Uint8Array, encoding: string = "utf8"): string {
		const decoder = new TextDecoder(encoding);
		return decoder.decode(buffer);
	}

	compare(buf1: Uint8Array, buf2: Uint8Array): number {
		const len = Math.min(buf1.length, buf2.length);
		for (let i = 0; i < len; i++) {
			if (buf1[i] !== buf2[i]) {
				return buf1[i] < buf2[i] ? -1 : 1;
			}
		}
		if (buf1.length === buf2.length) return 0;
		return buf1.length < buf2.length ? -1 : 1;
	}
}
