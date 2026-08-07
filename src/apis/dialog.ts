/**
 * Dialog API
 * Provides cross-environment dialog support
 */

import type { DialogAPI } from '../types';
import { getNativeTerbiumAPI } from '../env';

export class TerbiumDialog implements DialogAPI {
  private get native() {
    const tb = getNativeTerbiumAPI();
    return tb?.dialog;
  }

  private get isTerbium(): boolean {
    return !!this.native;
  }

  /**
   * Show an alert dialog
   * Terbium: uses tb.dialog.alert
   * Browser: uses window.alert
   */
  async alert(message: string, title?: string): Promise<void> {
    if (this.isTerbium) {
      return new Promise((resolve) => {
        this.native.alert({
          title: title || 'Alert',
          message: message,
          callback: () => resolve(),
        });
      });
    }

    // Browser fallback
    window.alert(title ? `${title}\n\n${message}` : message);
  }

  /**
   * Show a confirmation dialog
   * Terbium: uses tb.dialog.message
   * Browser: uses window.confirm
   */
  async confirm(message: string, title?: string): Promise<boolean> {
    if (this.isTerbium) {
      return new Promise((resolve) => {
        this.native.message({
          title: title || 'Confirm',
          message: message,
          callback: (result: boolean) => resolve(result),
        });
      });
    }

    // Browser fallback
    return window.confirm(title ? `${title}\n\n${message}` : message);
  }

  /**
   * Show a prompt dialog
   * Terbium: uses tb.dialog.select
   * Browser: uses window.prompt
   */
  async prompt(message: string, defaultValue?: string, title?: string): Promise<string | null> {
    if (this.isTerbium) {
      return new Promise((resolve) => {
        this.native.select({
          title: title || 'Input',
          message: message,
          defaultValue: defaultValue || '',
          callback: (result: string | null) => resolve(result),
        });
      });
    }

    // Browser fallback
    const result = window.prompt(title ? `${title}\n\n${message}` : message, defaultValue);
    return result;
  }
}
