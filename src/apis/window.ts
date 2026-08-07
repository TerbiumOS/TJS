/**
 * Window API
 * Window management (primarily for Terbium, limited browser support)
 */

import type { WindowAPI, WindowConfig } from '../types';
import { getNativeTerbiumAPI } from '../env';

export class TerbiumWindow implements WindowAPI {
  private get native() {
    const tb = getNativeTerbiumAPI();
    return tb?.window;
  }

  private get isTerbium(): boolean {
    return !!this.native;
  }

  /**
   * Create a new window
   * Terbium: uses tb.window.create
   * Browser: uses window.open
   */
  create(config: WindowConfig): void {
    if (this.isTerbium) {
      this.native.create(config);
      return;
    }

    // Browser fallback: window.open
    const features: string[] = [];
    
    if (config.width) features.push(`width=${config.width}`);
    if (config.height) features.push(`height=${config.height}`);
    if (config.x !== undefined) features.push(`left=${config.x}`);
    if (config.y !== undefined) features.push(`top=${config.y}`);
    
    window.open(
      config.src || 'about:blank',
      config.title || '_blank',
      features.join(',')
    );
  }

  /**
   * Close current window
   * Terbium: uses tb.window.close
   * Browser: uses window.close (may be blocked)
   */
  close(): void {
    if (this.isTerbium) {
      this.native.close();
      return;
    }

    // Browser fallback
    window.close();
  }

  /**
   * Minimize current window (Terbium only)
   */
  minimize(): void {
    if (this.isTerbium) {
      this.native.minimize();
    }
  }

  /**
   * Maximize current window (Terbium only)
   */
  maximize(): void {
    if (this.isTerbium) {
      this.native.maximize();
    }
  }

  /**
   * Reload current window
   * Terbium: uses tb.window.reload
   * Browser: uses location.reload
   */
  reload(): void {
    if (this.isTerbium) {
      this.native.reload();
      return;
    }

    // Browser fallback
    location.reload();
  }

  /**
   * Get window ID (Terbium only)
   */
  getId(): number {
    if (this.isTerbium) {
      return this.native.getId();
    }

    // Browser: return 0 as placeholder
    return 0;
  }

  /**
   * Change window source (Terbium only)
   */
  changeSrc(src: string): void {
    if (this.isTerbium) {
      this.native.changeSrc(src);
      return;
    }

    // Browser fallback: change location
    location.href = src;
  }

  // Content management
  content = {
    get: async (): Promise<HTMLDivElement> => {
      if (this.isTerbium) {
        return await this.native.content.get();
      }

      // Browser fallback: return document.body as HTMLDivElement
      return document.body as any;
    },

    set: (content: string): void => {
      if (this.isTerbium) {
        this.native.content.set(content);
        return;
      }

      // Browser fallback: set innerHTML
      document.body.innerHTML = content;
    },
  };

  // Titlebar management (Terbium only)
  titlebar = {
    setColor: (color: string): void => {
      if (this.isTerbium) {
        this.native.titlebar.setColor(color);
      }
    },

    setText: (text: string): void => {
      if (this.isTerbium) {
        this.native.titlebar.setText(text);
      } else {
        // Browser fallback: set document title
        document.title = text;
      }
    },

    setBackgroundColor: (color: string): void => {
      if (this.isTerbium) {
        this.native.titlebar.setBackgroundColor(color);
      }
    },
  };

  // App Island controls (Terbium only)
  island = {
    addControl: (props: any): void => {
      if (this.isTerbium) {
        this.native.island.addControl(props);
      }
    },

    clear: (): void => {
      if (this.isTerbium) {
        this.native.island.clear();
      }
    },
  };
}
