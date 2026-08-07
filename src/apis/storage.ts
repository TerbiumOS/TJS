/**
 * Storage API
 * Provides key-value storage with automatic fallbacks
 */

import type { StorageAPI } from '../types';
import { getNativeTerbiumAPI } from '../env';

export class TerbiumStorage implements StorageAPI {
  private prefix = 'tjs:';

  private get native() {
    const tb = getNativeTerbiumAPI();
    return tb;
  }

  private get isTerbium(): boolean {
    return !!this.native;
  }

  /**
   * Get a value from storage
   * Terbium: reads from user settings.json
   * Browser: uses localStorage
   */
  async get<T = any>(key: string): Promise<T | null> {
    if (this.isTerbium) {
      try {
        const username = await this.native.user.username();
        const settingsPath = `/home/${username}/settings.json`;
        const settings = JSON.parse(
          await this.native.fs.promises.readFile(settingsPath, 'utf8')
        );
        
        const value = settings[`${this.prefix}${key}`];
        return value !== undefined ? value : null;
      } catch (err) {
        return null;
      }
    }

    // Browser fallback: localStorage
    try {
      const item = localStorage.getItem(`${this.prefix}${key}`);
      return item ? JSON.parse(item) : null;
    } catch (err) {
      return null;
    }
  }

  /**
   * Set a value in storage
   * Terbium: writes to user settings.json
   * Browser: uses localStorage
   */
  async set(key: string, value: any): Promise<void> {
    if (this.isTerbium) {
      try {
        const username = await this.native.user.username();
        const settingsPath = `/home/${username}/settings.json`;
        
        let settings: any;
        try {
          settings = JSON.parse(
            await this.native.fs.promises.readFile(settingsPath, 'utf8')
          );
        } catch {
          settings = {};
        }
        
        settings[`${this.prefix}${key}`] = value;
        
        await this.native.fs.promises.writeFile(
          settingsPath,
          JSON.stringify(settings, null, 2),
          'utf8'
        );
      } catch (err) {
        throw new Error(`Failed to set storage value: ${err}`);
      }
      return;
    }

    // Browser fallback: localStorage
    try {
      localStorage.setItem(`${this.prefix}${key}`, JSON.stringify(value));
    } catch (err) {
      throw new Error(`Failed to set localStorage value: ${err}`);
    }
  }

  /**
   * Remove a value from storage
   * Terbium: removes from user settings.json
   * Browser: uses localStorage
   */
  async remove(key: string): Promise<void> {
    if (this.isTerbium) {
      try {
        const username = await this.native.user.username();
        const settingsPath = `/home/${username}/settings.json`;
        
        const settings = JSON.parse(
          await this.native.fs.promises.readFile(settingsPath, 'utf8')
        );
        
        delete settings[`${this.prefix}${key}`];
        
        await this.native.fs.promises.writeFile(
          settingsPath,
          JSON.stringify(settings, null, 2),
          'utf8'
        );
      } catch (err) {
        // Ignore errors if settings file doesn't exist
      }
      return;
    }

    // Browser fallback: localStorage
    localStorage.removeItem(`${this.prefix}${key}`);
  }

  /**
   * Clear all storage values
   * Terbium: removes all prefixed keys from settings
   * Browser: removes all prefixed keys from localStorage
   */
  async clear(): Promise<void> {
    if (this.isTerbium) {
      try {
        const username = await this.native.user.username();
        const settingsPath = `/home/${username}/settings.json`;
        
        const settings = JSON.parse(
          await this.native.fs.promises.readFile(settingsPath, 'utf8')
        );
        
        // Remove all keys with our prefix
        for (const key of Object.keys(settings)) {
          if (key.startsWith(this.prefix)) {
            delete settings[key];
          }
        }
        
        await this.native.fs.promises.writeFile(
          settingsPath,
          JSON.stringify(settings, null, 2),
          'utf8'
        );
      } catch (err) {
        // Ignore errors
      }
      return;
    }

    // Browser fallback: localStorage
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.prefix)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  /**
   * Get all storage keys
   * Terbium: lists all prefixed keys from settings
   * Browser: lists all prefixed keys from localStorage
   */
  async keys(): Promise<string[]> {
    if (this.isTerbium) {
      try {
        const username = await this.native.user.username();
        const settingsPath = `/home/${username}/settings.json`;
        
        const settings = JSON.parse(
          await this.native.fs.promises.readFile(settingsPath, 'utf8')
        );
        
        return Object.keys(settings)
          .filter(key => key.startsWith(this.prefix))
          .map(key => key.substring(this.prefix.length));
      } catch (err) {
        return [];
      }
    }

    // Browser fallback: localStorage
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.prefix)) {
        keys.push(key.substring(this.prefix.length));
      }
    }
    
    return keys;
  }
}
