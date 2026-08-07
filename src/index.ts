/**
 * Terbium.js - Universal SDK for Terbium OS
 * 
 * Write apps that work seamlessly in both Terbium and standard browsers
 */

import type { TerbiumAPI, TerbiumConfig } from './types';
import { isTerbiumEnvironment, getEnvironment, logEnvironmentInfo } from './env';
import { TerbiumFileSystem } from './apis/fs';
import { TerbiumStorage } from './apis/storage';
import { TerbiumNotification } from './apis/notification';
import { TerbiumDialog } from './apis/dialog';
import { TerbiumWindow } from './apis/window';
import {
  TerbiumDesktop,
  TerbiumLauncher,
  TerbiumBattery,
  TerbiumUser,
  TerbiumProcess,
  TerbiumContextMenu,
} from './apis/stubs';

// Version
const VERSION = '0.1.0';

/**
 * Create the Terbium.js API instance
 */
function createTerbiumAPI(config: TerbiumConfig = {}): TerbiumAPI {
  // Log environment info if debug mode
  if (config.debug) {
    logEnvironmentInfo(true);
  }

  const isTerbium = isTerbiumEnvironment();
  const env = getEnvironment();

  // Create ready promise
  let resolveReady: () => void;
  const ready = new Promise<void>((resolve) => {
    resolveReady = resolve;
  });

  // Initialize API
  const api: TerbiumAPI = {
    // Environment detection
    isTerbium,
    env,
    version: VERSION,
    ready,

    // Core APIs with fallbacks
    fs: new TerbiumFileSystem(),
    storage: new TerbiumStorage(),
    notification: new TerbiumNotification(),
    dialog: new TerbiumDialog(),
    window: new TerbiumWindow(),

    // Terbium-specific APIs (limited in browser)
    desktop: new TerbiumDesktop(),
    launcher: new TerbiumLauncher(),
    battery: new TerbiumBattery(),
    user: new TerbiumUser(),
    process: new TerbiumProcess(),
    contextMenu: new TerbiumContextMenu(),
  };

  // Resolve ready immediately (can be extended for async initialization)
  resolveReady!();

  return api;
}

// Export types
export * from './types';

// Export environment detection utilities
export { isTerbiumEnvironment, getEnvironment } from './env';

// Create and export default instance
export const tb = createTerbiumAPI();

// Named export for explicit configuration
export function createTerbium(config?: TerbiumConfig): TerbiumAPI {
  return createTerbiumAPI(config);
}

// Default export
export default tb;

// Attach to window for CDN usage
if (typeof window !== 'undefined') {
  (window as any).TerbiumJS = {
    tb,
    createTerbium,
    version: VERSION,
  };
}
