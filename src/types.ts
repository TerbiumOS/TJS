/**
 * Terbium.js Type Definitions
 * Complete 1:1 mapping with Terbium OS API specification
 */

// Environment type
export type Environment = "terbium" | "browser";

// ============================================================================
// File System Types
// ============================================================================

export interface FileSystemAPI {
	promises: {
		writeFile(path: string, content: string | Uint8Array | ArrayBuffer, encoding?: string): Promise<void>;
		readFile(path: string, encoding?: string): Promise<string | Uint8Array>;
		readdir(path: string): Promise<string[]>;
		mkdir(path: string, options?: { recursive?: boolean }): Promise<void>;
		stat(path: string): Promise<FileStats>;
		unlink(path: string): Promise<void>;
		rmdir(path: string, options?: { recursive?: boolean }): Promise<void>;
		rename(oldPath: string, newPath: string): Promise<void>;
		copyFile(src: string, dest: string): Promise<void>;
		exists(path: string): Promise<boolean>;
		readlink(path: string): Promise<string>;
		symlink(target: string, path: string): Promise<void>;
	};

	// Callback-based methods
	exists(path: string, callback: (exists: boolean) => void): void;
	readdir(path: string, callback: (err: Error | null, files: string[]) => void): void;
	stat(path: string, callback: (err: Error | null, stats: FileStats) => void): void;
}

export interface FileStats {
	name?: string;
	size: number;
	type: "FILE" | "DIRECTORY" | "SYMLINK";
	mtime: number;
	ctime?: number;
	isFile(): boolean;
	isDirectory(): boolean;
	isSymbolicLink?(): boolean;
}

// ============================================================================
// Shell Types
// ============================================================================

export interface ShellAPI {
	promises: {
		rm(path: string, options?: { recursive?: boolean; force?: boolean }): Promise<void>;
		cp(src: string, dest: string, options?: { recursive?: boolean }): Promise<void>;
		mv(src: string, dest: string): Promise<void>;
		exec(command: string): Promise<{ stdout: string; stderr: string; exitCode: number }>;
	};

	rm(path: string, options: any, callback: (err: Error | null) => void): void;
	cp(src: string, dest: string, options: any, callback: (err: Error | null) => void): void;
	mv(src: string, dest: string, callback: (err: Error | null) => void): void;
	exec(command: string, callback: (err: Error | null, result: any) => void): void;
}

// ============================================================================
// Buffer Types
// ============================================================================

export interface BufferAPI {
	from(data: string | Uint8Array | ArrayBuffer | number[], encoding?: string): Uint8Array;
	alloc(size: number, fill?: number): Uint8Array;
	concat(buffers: Uint8Array[], totalLength?: number): Uint8Array;
	isBuffer(obj: any): boolean;
}

// ============================================================================
// Storage API
// ============================================================================

export interface StorageAPI {
	get<T = any>(key: string): Promise<T | null>;
	set(key: string, value: any): Promise<void>;
	remove(key: string): Promise<void>;
	clear(): Promise<void>;
	keys(): Promise<string[]>;
}

// ============================================================================
// Notification Types
// ============================================================================

export interface NotificationProps {
	message: string;
	application: string;
	iconSrc: string;
	time?: number;
	onOk?: () => void;
	onCancel?: () => void;
}

export interface NotificationAPI {
	Message(props: NotificationProps): void | Promise<void>;
	Toast(props: NotificationProps): void | Promise<void>;
	Installing<T>(props: NotificationProps, task?: Promise<T> | (() => Promise<T>), doneToast?: Partial<NotificationProps> | null, failToast?: Partial<NotificationProps> | null): Promise<T | undefined> | void;
}

// ============================================================================
// Dialog Types
// ============================================================================

export interface DialogProps {
	title: string;
	message?: string;
	options?: { text: string; value: string }[];
	defaultValue?: string;
	filter?: string;
	defaultUsername?: string;
	defualtDir?: string;
	filename?: string;
	img?: string;
	onOk: (result?: any) => void;
	onCancel?: () => void;
	sudo?: boolean;
	local?: boolean;
}

export interface DialogAPI {
	Alert(props: DialogProps): void;
	Message(props: DialogProps): void;
	Select(props: DialogProps): void;
	Auth(props: DialogProps, options: { sudo: boolean }): void;
	Permissions(props: DialogProps): void;
	FileBrowser(props: DialogProps): void;
	DirectoryBrowser(props: DialogProps): void;
	SaveFile(props: DialogProps): void;
	Cropper(props: DialogProps): void;
	WebAuth(props: DialogProps): void;
}

// ============================================================================
// Window Types
// ============================================================================

export interface WindowConfig {
	title?: string | { text: string; weight?: number; html?: string };
	src?: string;
	icon?: string;
	size?: {
		width?: number;
		height?: number;
		minWidth?: number;
		minHeight?: number;
	};
	single?: boolean;
	controls?: Array<"minimize" | "maximize" | "close">;
	resizable?: boolean;
	maximizable?: boolean;
	minimizable?: boolean;
	closable?: boolean;
	snapable?: boolean;
	message?: any;
	proxy?: boolean;
	pid?: string;
	wid?: string;
	zIndex?: number;
	focused?: boolean;
}

export interface AppIslandProps {
	text: string;
	appname: string;
	id: string;
	click: () => void;
}

export interface WindowAPI {
	getId(): number | string;
	create(props: WindowConfig): void;

	content: {
		get(): Promise<HTMLDivElement>;
		set(html: string | HTMLElement): void;
	};

	titlebar: {
		setColor(hex: string): void;
		setText(text: string): void;
		setBackgroundColor(hex: string): void;
	};

	island: {
		addControl(args: AppIslandProps): void;
		removeControl(control_id: string): void;
	};

	changeSrc(src: string): void;
	reload(): void;
	minimize(): void;
	maximize(): void;
	close(): void;
}

// ============================================================================
// Desktop Types
// ============================================================================

export interface TDockItem {
	title: string;
	icon?: string;
	src?: string;
	[key: string]: any;
}

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
		pin(app: TDockItem): Promise<string>;
		unpin(app: string): Promise<string>;
	};
}

// ============================================================================
// Launcher Types
// ============================================================================

export interface LauncherProps {
	name: string;
	icon: string;
	src?: string;
	user?: string;
	[key: string]: any;
}

export interface LauncherAPI {
	addApp(props: LauncherProps): Promise<boolean>;
	removeApp(name: string): Promise<boolean>;
}

// ============================================================================
// Battery API
// ============================================================================

export interface BatteryAPI {
	showPercentage(): Promise<string>;
	hidePercentage(): Promise<string>;
	canUse(): Promise<boolean>;
}

// ============================================================================
// User Types
// ============================================================================

export interface User {
	id: string;
	username: string;
	password: string | boolean;
	pfp: string;
	perm: string[];
	securityQuestion?: { question: string; answer: string };
	email?: string;
	groups?: string[];
}

export interface UserAPI {
	username(): Promise<string>;
	pfp(): Promise<string>;
}

// ============================================================================
// Context Menu Types
// ============================================================================

export interface ContextMenuProps {
	titlebar?: string | any;
	x: number;
	y: number;
	options: {
		text: string;
		color?: string;
		click: () => void;
	}[];
	iframe?: boolean;
}

export interface ContextMenuAPI {
	create(props: ContextMenuProps): void;
	close(): void;
}

// ============================================================================
// Theme API (Deprecated)
// ============================================================================

export interface ThemeAPI {
	get(): Promise<any>;
	set(data: any): Promise<boolean>;
}

// ============================================================================
// Proxy Types
// ============================================================================

export interface ProxyAPI {
	get(): Promise<"Ultraviolet" | "Scramjet">;
	set(proxy: "Ultraviolet" | "Scramjet"): Promise<boolean>;
	updateSWs(): Promise<boolean>;
	encode(url: string, encoder: string): Promise<string>;
	decode(url: string, decoder: string): Promise<string>;
}

// ============================================================================
// System Types
// ============================================================================

export interface UserSettings {
	wallpaper: string;
	wallpaperMode: "cover" | "contain" | "stretch";
	animations: boolean;
	proxy: "Ultraviolet" | "Scramjet";
	transport: string;
	wispServer: string | null;
	"battery-percent": boolean;
	accent: string;
	windowOptimizations?: boolean;
	showFPS?: boolean;
	notificationMode: "all" | "dnd" | "snooze-10" | "allow-apps";
	notificationAllowList?: string[];
	notificationSnoozeUntil?: number;
	times: {
		format: "12h" | "24h";
		internet: boolean;
		showSeconds: boolean;
	};
	window: {
		winAccent: string;
		blurlevel: number;
		alwaysMaximized: boolean;
		alwaysFullscreen: boolean;
	};
	[key: string]: any;
}

export interface SystemAPI {
	version(): string | number;
	instance: any;
	openApp(pkg: string, options?: Partial<WindowConfig>): Promise<void>;
	download(url: string, location: string): Promise<void>;
	exportfs(startPath?: string, filename?: string): Promise<string>;
	scanintegrity(): Promise<string[]>;
	TSLParser: any;

	users: {
		list(): Promise<string[]>;
		add(user: User): Promise<boolean>;
		remove(id: string): Promise<boolean>;
		update(user: User): Promise<void>;
		renameUser(olduser: string, newuser: string): Promise<void>;
	};

	bootmenu: {
		addEntry(name: string, file: string): Promise<void>;
		removeEntry(name: string): Promise<void>;
	};

	startup: {
		addProc(pkgorname: string, target: "System" | "User", cmd?: string): Promise<void>;
		removeProc(pkgorname: string, target: "System" | "User"): Promise<void>;
		enable(pkgorname: string, target: "System" | "User"): Promise<void>;
		disable(pkgorname: string, target: "System" | "User"): Promise<void>;
		list(): Promise<any[]>;
	};
}

// ============================================================================
// Libcurl Types
// ============================================================================

export interface LibcurlAPI {
	fetch(url: string, options?: RequestInit): Promise<Response>;
	set_websocket(url: string): void;
	[key: string]: any;
}

// ============================================================================
// VFS Types
// ============================================================================

export interface ServerInfo {
	name: string;
	url: string;
	username?: string;
	password?: string;
	[key: string]: any;
}

export interface VFSAPI {
	[key: string]: any;
}

// ============================================================================
// TAuth Types
// ============================================================================

export interface TAuthAPI {
	client: any;
	signIn(): Promise<any>;
	signOut(): Promise<void>;
	isTACC(username?: string): Promise<boolean>;
	updateInfo(data: any): Promise<void>;
	reauth(): Promise<void>;
	sync: {
		retreive(): Promise<void>;
		upload(): Promise<void>;
		isSyncing: boolean;
	};
	getInfo(username?: string): Promise<any>;
}

// ============================================================================
// Platform API
// ============================================================================

export interface PlatformAPI {
	getPlatform(): Promise<"desktop" | "mobile">;
}

// ============================================================================
// Process Types
// ============================================================================

export interface ProcInf {
	name: string;
	size: { width: number | string; height: number | string };
	icon: string;
	pid: number;
	src: string;
	type: "window" | "runtime";
	onKill?: () => void;
}

export interface ProcessAPI {
	procs: Record<number, ProcInf>;
	kill(config: string | number | any): void;
	list(): Record<number, ProcInf>;
	create(type: "window" | "runtime", config: any): void;
	parse: {
		build(src: string): void;
	};
}

// ============================================================================
// Screen API
// ============================================================================

export interface ScreenAPI {
	captureScreen(): Promise<void>;
}

// ============================================================================
// Media Player Types
// ============================================================================

export interface MediaProps {
	artist?: string;
	track_name?: string;
	creator?: string;
	video_name?: string;
	album?: string;
	time?: number;
	background?: string;
	endtime: number;
	onPausePlay: () => void;
	onSeek?: () => void;
	onNext?: () => void;
	onBack?: () => void;
}

export interface MediaPlayerAPI {
	music(props: MediaProps): void;
	video(props: MediaProps): void;
	hide(): void;
	pauseplay(): void;
	isExisting(): void | boolean | Promise<boolean>;
}

// ============================================================================
// File Handler Types
// ============================================================================

export interface FileAPI {
	handler: {
		openFile(path: string, type: string): void;
		addHandler(app: string, ext: string): void;
		removeHandler(ext: string): void;
	};
	icons: {
		get(ext: string): Promise<string>;
		set(ext: string, iconPath: string): Promise<boolean>;
		remove(ext: string): Promise<boolean>;
	};
}

// ============================================================================
// Node/Dusk Types
// ============================================================================

export interface NodeAPI {
	webContainer: any;
	servers: Map<number, string>;
	isReady: boolean;
	start(): Promise<void>;
	stop(): boolean;
}

export interface DuskAPI {
	runtime: any;
	processManager: any;
	isReady: boolean;
	servers: Map<number, string>;
	start(): Promise<void>;
	stop(): Promise<void>;
}

// ============================================================================
// Main API Interface
// ============================================================================

export interface TerbiumAPI {
	// Environment detection
	isTerbium: boolean;
	env: Environment;
	version: string;
	ready: Promise<void>;

	// Core APIs
	registry: any;
	sh: ShellAPI;
	buffer: BufferAPI;
	fs: FileSystemAPI;
	storage: StorageAPI;

	// UI APIs
	notification: NotificationAPI;
	dialog: DialogAPI;
	window: WindowAPI;
	contextmenu: ContextMenuAPI;

	// Desktop APIs
	battery: BatteryAPI;
	launcher: LauncherAPI;
	theme: ThemeAPI;
	desktop: DesktopAPI;

	// User & System
	user: UserAPI;
	proxy: ProxyAPI;
	system: SystemAPI;

	// Network & Storage
	libcurl: LibcurlAPI;
	fflate: any;
	vfs: VFSAPI;

	// Authentication
	tauth: TAuthAPI;
	crypto(pass: string, file: string): Promise<string>;

	// Platform & Media
	platform: PlatformAPI;
	process: ProcessAPI;
	screen: ScreenAPI;
	mediaplayer: MediaPlayerAPI;
	file: FileAPI;

	// Runtime
	node: NodeAPI;
	dusk: DuskAPI;
}

// ============================================================================
// Configuration Options
// ============================================================================

export interface TerbiumConfig {
	useBrowserFallbacks?: boolean;
	storageBackend?: "terbium" | "localStorage" | "indexedDB";
	notificationBackend?: "terbium" | "browser";
	debug?: boolean;
}

// ============================================================================
// Event Types
// ============================================================================

export interface TerbiumEvent {
	type: string;
	data?: any;
}

export type TerbiumEventListener = (event: TerbiumEvent) => void;
