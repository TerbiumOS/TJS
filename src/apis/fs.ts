/**
 * File System API
 * Provides unified file system access with automatic fallbacks
 */

import type { FileSystemAPI, FileStats } from '../types';
import { getNativeTerbiumAPI, hasAPI } from '../env';

export class TerbiumFileSystem implements FileSystemAPI {
  private get native() {
    const tb = getNativeTerbiumAPI();
    return tb?.fs;
  }

  private get isTerbium(): boolean {
    return !!this.native;
  }

  /**
   * Write a file
   * Terbium: uses tb.fs.promises.writeFile
   * Browser: uses File System Access API or triggers download
   */
  async writeFile(path: string, content: string | Uint8Array | Blob, encoding: string = 'utf8'): Promise<void> {
    if (this.isTerbium) {
      // Use native Terbium FS
      const data = typeof content === 'string' 
        ? content 
        : content instanceof Uint8Array 
          ? (window as any).tb.buffer.from(content)
          : content;
          
      await this.native.promises.writeFile(path, data, encoding);
      return;
    }

    // Browser fallback: try File System Access API
    if ('showSaveFilePicker' in window) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: path.split('/').pop() || 'file.txt',
        });
        
        const writable = await handle.createWritable();
        
        if (typeof content === 'string') {
          await writable.write(content);
        } else if (content instanceof Uint8Array) {
          await writable.write(content);
        } else {
          await writable.write(content);
        }
        
        await writable.close();
        return;
      } catch (err) {
        // User cancelled or error - fall through to download
      }
    }

    // Final fallback: trigger download
    const blob = typeof content === 'string'
      ? new Blob([content], { type: 'text/plain' })
      : content instanceof Uint8Array
        ? new Blob([content])
        : content;

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = path.split('/').pop() || 'file.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Read a file
   * Terbium: uses tb.fs.promises.readFile
   * Browser: uses File System Access API or file input
   */
  async readFile(path: string, encoding: string = 'utf8'): Promise<string | Uint8Array> {
    if (this.isTerbium) {
      return await this.native.promises.readFile(path, encoding);
    }

    // Browser fallback: File System Access API
    if ('showOpenFilePicker' in window) {
      try {
        const [handle] = await (window as any).showOpenFilePicker();
        const file = await handle.getFile();
        
        if (encoding === 'utf8' || encoding === 'utf-8') {
          return await file.text();
        } else {
          const buffer = await file.arrayBuffer();
          return new Uint8Array(buffer);
        }
      } catch (err) {
        throw new Error('Failed to read file: User cancelled or permission denied');
      }
    }

    // Fallback: file input element
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '*/*';
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) {
          reject(new Error('No file selected'));
          return;
        }

        if (encoding === 'utf8' || encoding === 'utf-8') {
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

  /**
   * List directory contents
   * Terbium: uses tb.fs.promises.readdir
   * Browser: uses File System Access API (directory picker)
   */
  async readdir(path: string): Promise<string[]> {
    if (this.isTerbium) {
      return new Promise((resolve, reject) => {
        this.native.readdir(path, (err: Error | null, files: string[]) => {
          if (err) reject(err);
          else resolve(files);
        });
      });
    }

    // Browser fallback: Directory picker
    if ('showDirectoryPicker' in window) {
      try {
        const handle = await (window as any).showDirectoryPicker();
        const entries: string[] = [];
        
        for await (const entry of (handle as any).values()) {
          entries.push(entry.name);
        }
        
        return entries;
      } catch (err) {
        throw new Error('Failed to read directory: User cancelled or permission denied');
      }
    }

    throw new Error('Directory operations not supported in this browser');
  }

  /**
   * Create a directory
   * Terbium: uses tb.fs.promises.mkdir
   * Browser: Limited support via File System Access API
   */
  async mkdir(path: string, options?: { recursive?: boolean }): Promise<void> {
    if (this.isTerbium) {
      await this.native.promises.mkdir(path, options);
      return;
    }

    // Browser: Directory creation not directly supported
    // This would require File System Access API with write permissions
    console.warn('[Terbium.js] mkdir is not fully supported in browser mode');
  }

  /**
   * Check if file/directory exists
   * Terbium: uses tb.fs.exists
   * Browser: Not available (returns false)
   */
  async exists(path: string): Promise<boolean> {
    if (this.isTerbium) {
      return new Promise((resolve) => {
        this.native.exists(path, (exists: boolean) => {
          resolve(exists);
        });
      });
    }

    // Browser: No way to check existence without prompting user
    return false;
  }

  /**
   * Get file statistics
   * Terbium: uses tb.fs.promises.stat
   * Browser: Limited support
   */
  async stat(path: string): Promise<FileStats> {
    if (this.isTerbium) {
      const stats = await this.native.promises.stat(path);
      return {
        name: stats.name || path.split('/').pop() || '',
        size: stats.size || 0,
        isFile: stats.isFile(),
        isDirectory: stats.isDirectory(),
        mtime: new Date(stats.mtime),
        ctime: new Date(stats.ctime || stats.mtime),
      };
    }

    throw new Error('stat() not available in browser mode');
  }

  /**
   * Delete a file
   * Terbium: uses tb.fs.promises.unlink
   * Browser: Not supported
   */
  async unlink(path: string): Promise<void> {
    if (this.isTerbium) {
      await this.native.promises.unlink(path);
      return;
    }

    throw new Error('unlink() not available in browser mode');
  }

  /**
   * Remove a directory
   * Terbium: uses tb.fs.promises.rmdir
   * Browser: Not supported
   */
  async rmdir(path: string, options?: { recursive?: boolean }): Promise<void> {
    if (this.isTerbium) {
      await this.native.promises.rmdir(path, options);
      return;
    }

    throw new Error('rmdir() not available in browser mode');
  }

  /**
   * Rename a file or directory
   * Terbium: uses tb.fs.promises.rename
   * Browser: Not supported
   */
  async rename(oldPath: string, newPath: string): Promise<void> {
    if (this.isTerbium) {
      await this.native.promises.rename(oldPath, newPath);
      return;
    }

    throw new Error('rename() not available in browser mode');
  }

  /**
   * Copy a file
   * Terbium: uses tb.fs.promises.copyFile
   * Browser: Not supported
   */
  async copy(src: string, dest: string): Promise<void> {
    if (this.isTerbium) {
      const content = await this.native.promises.readFile(src);
      await this.native.promises.writeFile(dest, content);
      return;
    }

    throw new Error('copy() not available in browser mode');
  }
}
