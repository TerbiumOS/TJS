/**
 * Terbium.js Type Definitions
 * Based on Terbium OS API specification
 */

// Environment type
export type Environment = 'terbium' | 'browser';

// File System types
export interface FileSystemAPI {
  writeFile(path: string, content: string | Uint8Array | Blob, encoding?: string): Promise<void>;
  readFile(path: string, encoding?: string): Promise<string | Uint8Array>;
  readdir(path: string): Promise<string[]>;
  mkdir(path: string, options?: { recursive?: boolean }): Promise<void>;
  exists(path: string): Promise<boolean>;
  stat(path: string): Promise<FileStats>;
  unlink(path: string): Promise<void>;
  rmdir(path: string, options?: { recursive?: boolean }): Promise<void>;
  rename(oldPath: string, newPath: string): Promise<void>;
  copy(src: string, dest: string): Promise<void>;
}

export interface FileStats {
  name: string;
  size: number;
  isFile: boolean;
  isDirectory: boolean;
  mtime: Date;
  ctime: Date;
}

// Storage API
export interface StorageAPI {
  get<T = any>(key: string): Promise<T | null>;
  set(key: string, value: any): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
  keys(): Promise<string[]>;
}

// Notification types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationOptions {
  title: string;
  message: string;
  type?: NotificationType;
  timeout?: number;
  icon?: string;
}

export interface NotificationAPI {
  show(options: NotificationOptions): Promise<void>;
  dismiss(id?: string): Promise<void>;
}

// Dialog API
export interface DialogAPI {
  alert(message: string, title?: string): Promise<void>;
  confirm(message: string, title?: string): Promise<boolean>;
  prompt(message: string, defaultValue?: string, title?: string): Promise<string | null>;
}

// Window types (Terbium only)
export interface WindowConfig {
  title?: string;
  src?: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  resizable?: boolean;
  minimizable?: boolean;
  maximizable?: boolean;
  closable?: boolean;
  frame?: boolean;
  transparent?: boolean;
}

export interface WindowAPI {
  create(config: WindowConfig): void;
  close(): void;
  minimize(): void;
  maximize(): void;
  reload(): void;
  getId(): number;
  changeSrc(src: string): void;
  
  content: {
    get(): Promise<HTMLDivElement>;
    set(content: string): void;
  };
  
  titlebar: {
    setColor(color: string): void;
    setText(text: string): void;
    setBackgroundColor(color: string): void;
  };
  
  island: {
    addControl(props: any): void;
    clear(): void;
  };
}

// Desktop API
export interface DesktopAPI {
  preferences: {
    setTheme(color: string): Promise<void>;
    theme(): Promise<string>;
    setAccent(color: string): Promise<void>;
    getAccent(): Promise<string>;
  };
  
  wallpaper: {
    set(path: string): Promise<void>;
    contain(): Promise<void>;
    stretch(): Promise<void>;
    cover(): Promise<void>;
    fillMode(): Promise<string>;
  };
  
  dock: {
    pin(app: DockItem): Promise<string>;
    unpin(app: string): Promise<string>;
  };
}

export interface DockItem {
  title: string;
  icon?: string;
  src?: string;
}

// Launcher API
export interface LauncherAPI {
  addApp(props: LauncherApp): Promise<boolean>;
  removeApp(name: string): Promise<boolean>;
}

export interface LauncherApp {
  name: string;
  icon: string;
  src?: string;
  [key: string]: any;
}

// Battery API
export interface BatteryAPI {
  showPercentage(): Promise<string>;
  hidePercentage(): Promise<string>;
  canUse(): Promise<boolean>;
}

// User API
export interface UserAPI {
  username(): Promise<string>;
  pfp(): Promise<string>;
  email(): Promise<string | null>;
  id(): Promise<string>;
  isGuest(): Promise<boolean>;
  permissions(): Promise<string[]>;
}

// Process API
export interface ProcessInfo {
  pid: number;
  name: string;
  status: string;
  memory?: number;
  cpu?: number;
}

export interface ProcessAPI {
  list(): Promise<ProcessInfo[]>;
  kill(pid: number): Promise<void>;
  create(name: string, fn: Function): Promise<number>;
}

// Context Menu types
export interface ContextMenuItem {
  label: string;
  icon?: string;
  action?: () => void;
  submenu?: ContextMenuItem[];
  separator?: boolean;
  disabled?: boolean;
}

export interface ContextMenuAPI {
  show(items: ContextMenuItem[], x?: number, y?: number): void;
  hide(): void;
}

// Main API interface
export interface TerbiumAPI {
  // Environment detection
  isTerbium: boolean;
  env: Environment;
  
  // Core APIs
  fs: FileSystemAPI;
  storage: StorageAPI;
  notification: NotificationAPI;
  dialog: DialogAPI;
  
  // Terbium-specific APIs (may be limited in browser)
  window: WindowAPI;
  desktop: DesktopAPI;
  launcher: LauncherAPI;
  battery: BatteryAPI;
  user: UserAPI;
  process: ProcessAPI;
  contextMenu: ContextMenuAPI;
  
  // Utility methods
  version: string;
  ready: Promise<void>;
}

// Event types
export interface TerbiumEvent {
  type: string;
  data?: any;
}

export type TerbiumEventListener = (event: TerbiumEvent) => void;

// Configuration options
export interface TerbiumConfig {
  // Fallback behavior configuration
  useBrowserFallbacks?: boolean;
  
  // Storage backend
  storageBackend?: 'terbium' | 'localStorage' | 'indexedDB';
  
  // Notification backend
  notificationBackend?: 'terbium' | 'browser';
  
  // Debug mode
  debug?: boolean;
}
