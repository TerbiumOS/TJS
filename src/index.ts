/**
 * Terbium.js - Universal SDK for Terbium OS
 *
 * Complete 1:1 API implementation with browser fallbacks
 */

import type { TerbiumAPI, TerbiumConfig } from "./types";
import { isTerbiumEnvironment, getEnvironment, logEnvironmentInfo } from "./env";
import { TerbiumFileSystem } from "./apis/fs";
import { TerbiumStorage } from "./apis/storage";
import { TerbiumNotification } from "./apis/notification";
import { TerbiumDialog } from "./apis/dialog";
import { TerbiumWindow } from "./apis/window";
import { TerbiumRegistry } from "./apis/registry";
import { TerbiumShell } from "./apis/shell";
import { TerbiumBuffer } from "./apis/buffer";
import { TerbiumTheme } from "./apis/theme";
import { TerbiumProxy } from "./apis/proxy";
import { TerbiumSystem } from "./apis/system";
import { TerbiumPlatform } from "./apis/platform";
import { TerbiumScreen } from "./apis/screen";
import { TerbiumProcess } from "./apis/process";
import { TerbiumContextMenu } from "./apis/contextmenu";
import { TerbiumMediaPlayer } from "./apis/mediaplayer";
import { TerbiumFile } from "./apis/file";
import { createLibcurlProxy } from "./apis/libcurl";
import { createFflateProxy } from "./apis/fflate";
import { createVFSProxy } from "./apis/vfs";
import { TerbiumTAuth } from "./apis/tauth";
import { createCryptoFunction } from "./apis/crypto";
import { TerbiumNode, TerbiumDusk } from "./apis/node";
import { TerbiumDesktop, TerbiumLauncher, TerbiumBattery, TerbiumUser } from "./apis/stubs";

const VERSION = "1.0.0";

/**
 * Create the Terbium.js API instance
 */
async function createTerbiumAPI(config: TerbiumConfig = {}): Promise<TerbiumAPI> {
	if (config.debug) {
		logEnvironmentInfo(true);
	}
	const isTerbium = isTerbiumEnvironment();
	const env = getEnvironment();
	let resolveReady: () => void;
	const ready = new Promise<void>(resolve => {
		resolveReady = resolve;
	});
	const crypto = await createCryptoFunction();
	const api: TerbiumAPI = {
		isTerbium,
		env,
		version: VERSION,
		ready,
		registry: new TerbiumRegistry(),
		sh: new TerbiumShell(),
		buffer: new TerbiumBuffer(),
		fs: new TerbiumFileSystem(),
		storage: new TerbiumStorage(),
		notification: new TerbiumNotification(),
		dialog: new TerbiumDialog(),
		window: new TerbiumWindow(),
		contextmenu: new TerbiumContextMenu(),
		battery: new TerbiumBattery(),
		launcher: new TerbiumLauncher(),
		theme: new TerbiumTheme(),
		desktop: new TerbiumDesktop(),
		user: new TerbiumUser(),
		proxy: new TerbiumProxy(),
		system: new TerbiumSystem(),
		libcurl: createLibcurlProxy(),
		fflate: createFflateProxy(),
		vfs: createVFSProxy(),
		tauth: new TerbiumTAuth(),
		crypto,
		platform: new TerbiumPlatform(),
		process: new TerbiumProcess(),
		screen: new TerbiumScreen(),
		mediaplayer: new TerbiumMediaPlayer(),
		file: new TerbiumFile(),
		node: new TerbiumNode(),
		dusk: new TerbiumDusk(),
	};
	resolveReady!();
	return api;
}

export * from "./types";

export { isTerbiumEnvironment, getEnvironment } from "./env";

let tbInstance: TerbiumAPI | null = null;
let tbPromise: Promise<TerbiumAPI> | null = null;

/**
 * Get the default TerbiumJS instance
 */
export async function getTerbium(): Promise<TerbiumAPI> {
	if (tbInstance) {
		return tbInstance;
	}

	if (!tbPromise) {
		tbPromise = createTerbiumAPI().then(instance => {
			tbInstance = instance;
			return instance;
		});
	}

	return tbPromise;
}

export async function createTerbium(config?: TerbiumConfig): Promise<TerbiumAPI> {
	return createTerbiumAPI(config);
}

const initPromise = getTerbium();
export let tb: TerbiumAPI = null as any;

initPromise.then(instance => {
	tb = instance;
});

if (typeof window !== "undefined") {
	initPromise.then(instance => {
		(window as any).TerbiumJS = {
			tb: instance,
			createTerbium,
			getTerbium,
			version: VERSION,
		};
		(window as any).tb = instance;
	});
}

export default initPromise;
