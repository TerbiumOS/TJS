/**
 * Media Player API
 * System-wide media controls
 */

import type { MediaPlayerAPI, MediaProps } from "../types";
import { getNativeTerbiumAPI } from "../env";

export class TerbiumMediaPlayer implements MediaPlayerAPI {
	private get native() {
		const tb = getNativeTerbiumAPI();
		return tb?.mediaplayer;
	}

	private get isTerbium(): boolean {
		return !!this.native;
	}

	music(props: MediaProps): void {
		if (this.isTerbium) {
			this.native.music(props);
			return;
		}

		if ("mediaSession" in navigator) {
			navigator.mediaSession.metadata = new MediaMetadata({
				title: props.track_name || "Unknown Track",
				artist: props.artist || "Unknown Artist",
				album: props.album || "",
				artwork: props.background ? [{ src: props.background }] : [],
			});
			if (props.onPausePlay) {
				navigator.mediaSession.setActionHandler("play", props.onPausePlay);
				navigator.mediaSession.setActionHandler("pause", props.onPausePlay);
			}
			if (props.onNext) {
				navigator.mediaSession.setActionHandler("nexttrack", props.onNext);
			}
			if (props.onBack) {
				navigator.mediaSession.setActionHandler("previoustrack", props.onBack);
			}
		} else {
			console.warn("[TerbiumJS] MediaPlayer.music not fully supported in this browser");
		}
	}

	video(props: MediaProps): void {
		if (this.isTerbium) {
			this.native.video(props);
			return;
		}
		if ("mediaSession" in navigator) {
			navigator.mediaSession.metadata = new MediaMetadata({
				title: props.video_name || "Unknown Video",
				artist: props.creator || "Unknown Creator",
				artwork: props.background ? [{ src: props.background }] : [],
			});
			if (props.onPausePlay) {
				navigator.mediaSession.setActionHandler("play", props.onPausePlay);
				navigator.mediaSession.setActionHandler("pause", props.onPausePlay);
			}
		} else {
			console.warn("[TerbiumJS] MediaPlayer.video not fully supported in this browser");
		}
	}

	hide(): void {
		if (this.isTerbium) {
			this.native.hide();
			return;
		}
		if ("mediaSession" in navigator) {
			navigator.mediaSession.metadata = null;
		}
	}

	pauseplay(): void {
		if (this.isTerbium) {
			this.native.pauseplay();
			return;
		}
		console.warn("[TerbiumJS] MediaPlayer.pauseplay not available in browser mode");
	}

	isExisting(): void | boolean | Promise<boolean> {
		if (this.isTerbium) {
			return this.native.isExisting();
		}
		return "mediaSession" in navigator && navigator.mediaSession.metadata !== null;
	}
}
