/**
 * Screen API
 * Screen capture functionality
 */

import type { ScreenAPI } from "../types";
import { getNativeTerbiumAPI } from "../env";

export class TerbiumScreen implements ScreenAPI {
	private get native() {
		const tb = getNativeTerbiumAPI();
		return tb?.screen;
	}

	private get isTerbium(): boolean {
		return !!this.native;
	}

	async captureScreen(): Promise<void> {
		if (this.isTerbium) {
			return await this.native.captureScreen();
		}
		try {
			// @ts-ignore - getDisplayMedia is not in TypeScript types yet
			const stream = await navigator.mediaDevices.getDisplayMedia({
				video: true,
			});
			const video = document.createElement("video");
			video.srcObject = stream;
			video.play();
			await new Promise(resolve => {
				video.onloadedmetadata = resolve;
			});
			const canvas = document.createElement("canvas");
			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;
			const ctx = canvas.getContext("2d");
			ctx?.drawImage(video, 0, 0);
			stream.getTracks().forEach(track => track.stop());
			canvas.toBlob(blob => {
				if (blob) {
					const url = URL.createObjectURL(blob);
					const a = document.createElement("a");
					a.href = url;
					a.download = `screenshot-${Date.now()}.png`;
					document.body.appendChild(a);
					a.click();
					document.body.removeChild(a);
					URL.revokeObjectURL(url);
				}
			});
		} catch (err) {
			console.error("[TerbiumJS] Screen capture failed:", err);
			throw new Error("Screen capture not available or permission denied");
		}
	}
}
