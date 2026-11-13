# Terbium.js (@terbiumos/tjs)

Universal SDK for building applications that work seamlessly in both Terbium OS and standard web browsers.

## Features

- **Complete 1:1 Terbium API** - Full implementation of the entire Terbium OS API surface
- **Environment Detection** - Automatically detects if running in Terbium or browser
- **Intelligent Fallbacks** - Uses browser APIs when Terbium APIs are unavailable
- **Zero Configuration** - No setup required, works out of the box
- **Type-Safe** - Full TypeScript support with comprehensive type definitions
- **Lightweight** - Minimal overhead, tree-shakeable
- **Universal** - Write once, run everywhere

## Installation

### NPM

```bash
npm install @terbiumos/tjs
```

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@terbiumos/tjs@latest/dist/index.min.js"></script>
```

## Quick Start

```typescript
import { tb } from '@terbiumos/tjs';

// Works in both Terbium and browsers
async function saveFile(content: string) {
  // In Terbium: uses tb.fs API
  // In browser: uses File System Access API or downloads
  await tb.fs.promises.writeFile('hello.txt', content);
}

// Check environment
if (tb.isTerbium) {
  console.log('Running in Terbium OS!');
} else {
  console.log('Running in standard browser');
}
```

## Complete API Coverage

TJS provides **100% API coverage** of the Terbium OS API, including:

### Core APIs
- ✅ **Registry** - System registry access
- ✅ **Shell (sh)** - Shell command execution
- ✅ **Buffer** - Buffer operations
- ✅ **File System (fs)** - Complete file system API with promises and callbacks
- ✅ **Storage** - Persistent key-value storage

### UI APIs
- ✅ **Notifications** - Message, Toast, and Installing notifications
- ✅ **Dialogs** - Alert, Message, Select, Auth, Permissions, FileBrowser, DirectoryBrowser, SaveFile, Cropper, WebAuth
- ✅ **Window** - Window management, titlebar, island controls
- ✅ **Context Menu** - Custom context menus

### Desktop APIs
- ✅ **Battery** - Battery status and controls
- ✅ **Launcher** - App launcher management
- ✅ **Theme** - Theme management (deprecated API)
- ✅ **Desktop** - Preferences, wallpaper, dock management

### System & User
- ✅ **User** - User management and authentication
- ✅ **Proxy** - Proxy configuration (Ultraviolet/Scramjet)
- ✅ **System** - Version, app launching, downloads, exportfs, integrity scanning, user management, boot menu, startup processes

### Network & Storage
- ✅ **Libcurl** - HTTP client with fetch API
- ✅ **fflate** - Compression/decompression
- ✅ **VFS** - Virtual file system (WebDAV)

### Authentication & Security
- ✅ **TAuth** - Terbium Cloud authentication and sync
- ✅ **Crypto** - Password hashing and encryption

### Platform & Media
- ✅ **Platform** - Platform detection (desktop/mobile)
- ✅ **Process** - Process management
- ✅ **Screen** - Screen capture
- ✅ **Media Player** - System-wide media controls
- ✅ **File** - File handlers and custom icons

### Runtime
- ✅ **Node** - WebContainer compatibility
- ✅ **Dusk** - Dusk runtime access

## API Documentation

### File System

```typescript
// Promise-based API
await tb.fs.promises.writeFile('/path/to/file.txt', 'Hello, Terbium!');
const content = await tb.fs.promises.readFile('/path/to/file.txt', 'utf8');
const files = await tb.fs.promises.readdir('/home');
const exists = await tb.fs.promises.exists('/path/to/file.txt');
await tb.fs.promises.mkdir('/path/to/dir', { recursive: true });
await tb.fs.promises.unlink('/path/to/file.txt');
await tb.fs.promises.rmdir('/path/to/dir', { recursive: true });
await tb.fs.promises.rename('/old/path', '/new/path');
await tb.fs.promises.copyFile('/src', '/dest');
await tb.fs.promises.symlink('/target', '/link');
const link = await tb.fs.promises.readlink('/link');
const stats = await tb.fs.promises.stat('/path');

// Callback-based API
tb.fs.exists('/path', (exists) => console.log(exists));
tb.fs.readdir('/path', (err, files) => console.log(files));
tb.fs.stat('/path', (err, stats) => console.log(stats));
```

### Shell

```typescript
// Promise-based API
await tb.sh.promises.rm('/path', { recursive: true, force: true });
await tb.sh.promises.cp('/src', '/dest', { recursive: true });
await tb.sh.promises.mv('/old', '/new');
const { stdout, stderr, exitCode } = await tb.sh.promises.exec('ls -la');

// Callback-based API
tb.sh.rm('/path', {}, (err) => {});
tb.sh.cp('/src', '/dest', {}, (err) => {});
tb.sh.mv('/old', '/new', (err) => {});
tb.sh.exec('command', (err, result) => {});
```

### Buffer

```typescript
const buf = tb.buffer.from('Hello', 'utf8');
const buf2 = tb.buffer.from([1, 2, 3, 4]);
const buf3 = tb.buffer.alloc(10, 0);
const combined = tb.buffer.concat([buf, buf2]);
const isBuffer = tb.buffer.isBuffer(buf);
```

### Storage

```typescript
await tb.storage.set('key', { data: 'value' });
const value = await tb.storage.get('key');
await tb.storage.remove('key');
await tb.storage.clear();
const keys = await tb.storage.keys();
```

### Notifications

```typescript
// Message notification
tb.notification.Message({
  application: 'My App',
  message: 'Hello, world!',
  iconSrc: '/icon.png',
  time: 5000,
  onOk: () => console.log('Clicked!'),
});

// Toast notification
tb.notification.Toast({
  application: 'My App',
  message: 'Quick notification',
  iconSrc: '/icon.png',
});

// Installing notification with progress
await tb.notification.Installing(
  { application: 'My App', message: 'Installing...', iconSrc: '/icon.png' },
  async () => {
    // Your async task here
    await doSomething();
  },
  { message: 'Installation complete!' },
  { message: 'Installation failed!' }
);
```

### Dialogs

```typescript
// Alert
tb.dialog.Alert({
  title: 'Alert',
  message: 'This is an alert',
  onOk: () => console.log('OK clicked'),
});

// Confirm
tb.dialog.Message({
  title: 'Confirm',
  message: 'Are you sure?',
  onOk: (result) => console.log('Confirmed:', result),
  onCancel: () => console.log('Cancelled'),
});

// Select
tb.dialog.Select({
  title: 'Choose',
  message: 'Select an option',
  options: [
    { text: 'Option 1', value: '1' },
    { text: 'Option 2', value: '2' },
  ],
  onOk: (value) => console.log('Selected:', value),
});

// File browser
tb.dialog.FileBrowser({
  title: 'Open File',
  filter: '.txt,.js',
  onOk: (path) => console.log('Selected:', path),
});

// Auth dialog
tb.dialog.Auth({
  title: 'Login',
  message: 'Please authenticate',
  onOk: (username, password) => console.log('Login:', username),
}, { sudo: false });
```

### Window Management

```typescript
// Create window
tb.window.create({
  title: 'My App',
  src: '/app.html',
  icon: '/icon.png',
  size: { width: 800, height: 600 },
  resizable: true,
  maximizable: true,
  minimizable: true,
});

// Get window ID
const id = tb.window.getId();

// Window controls
tb.window.minimize();
tb.window.maximize();
tb.window.reload();
tb.window.close();
tb.window.changeSrc('/new-page.html');

// Content management
const content = await tb.window.content.get();
tb.window.content.set('<div>New content</div>');

// Titlebar customization
tb.window.titlebar.setText('New Title');
tb.window.titlebar.setColor('#ff0000');
tb.window.titlebar.setBackgroundColor('#000000');

// App Island controls
tb.window.island.addControl({
  text: 'Play',
  appname: 'Music Player',
  id: 'play-btn',
  click: () => console.log('Play clicked'),
});
tb.window.island.removeControl('play-btn');
```

### System API

```typescript
// Version info
const version = tb.system.version();

// Open app
await tb.system.openApp('files', { title: 'Files' });

// Download file
await tb.system.download('https://example.com/file.zip', '/downloads/file.zip');

// Export filesystem
await tb.system.exportfs('/', 'backup.zip');

// Scan integrity
const invalid = await tb.system.scanintegrity();

// User management
const users = await tb.system.users.list();
await tb.system.users.add({
  id: 'user1',
  username: 'User 1',
  password: 'pass',
  pfp: '/avatar.png',
  perm: ['user'],
});
await tb.system.users.remove('user1');
await tb.system.users.update({ id: 'user1', username: 'Updated' });
await tb.system.users.renameUser('oldname', 'newname');

// Boot menu
await tb.system.bootmenu.addEntry('Custom Boot', '/boot.js');
await tb.system.bootmenu.removeEntry('Custom Boot');

// Startup processes
await tb.system.startup.addProc('myapp', 'User', 'npm start');
await tb.system.startup.removeProc('myapp', 'User');
await tb.system.startup.enable('myapp', 'User');
await tb.system.startup.disable('myapp', 'User');
const procs = await tb.system.startup.list();
```

### Desktop API

```typescript
// Preferences
await tb.desktop.preferences.setTheme('dark');
const theme = await tb.desktop.preferences.theme();
await tb.desktop.preferences.setAccent('#ff0000');
const accent = await tb.desktop.preferences.getAccent();

// Wallpaper
await tb.desktop.wallpaper.set('/wallpapers/bg.png');
await tb.desktop.wallpaper.cover();
await tb.desktop.wallpaper.contain();
await tb.desktop.wallpaper.stretch();
const mode = await tb.desktop.wallpaper.fillMode();

// Dock
await tb.desktop.dock.pin({
  title: 'My App',
  icon: '/icon.png',
  src: '/app.html',
});
await tb.desktop.dock.unpin('My App');
```

### Context Menu

```typescript
tb.contextmenu.create({
  x: 100,
  y: 200,
  titlebar: 'Menu',
  options: [
    {
      text: 'Copy',
      click: () => console.log('Copy clicked'),
    },
    {
      text: 'Paste',
      color: '#ff0000',
      click: () => console.log('Paste clicked'),
    },
  ],
  iframe: false,
});

tb.contextmenu.close();
```

### Media Player

```typescript
// Music
tb.mediaplayer.music({
  artist: 'Artist Name',
  track_name: 'Song Title',
  album: 'Album Name',
  background: '/cover.jpg',
  endtime: 240,
  onPausePlay: () => console.log('Play/Pause'),
  onNext: () => console.log('Next'),
  onBack: () => console.log('Previous'),
});

// Video
tb.mediaplayer.video({
  creator: 'Creator',
  video_name: 'Video Title',
  background: '/thumbnail.jpg',
  endtime: 300,
  onPausePlay: () => console.log('Play/Pause'),
});

// Hide
tb.mediaplayer.hide();
```

### Platform & Screen

```typescript
// Detect platform
const platform = await tb.platform.getPlatform(); // 'desktop' | 'mobile'

// Screen capture
await tb.screen.captureScreen();
```

### File Handlers

```typescript
// Get file icon
const icon = await tb.file.icons.get('pdf');

// Set custom icon
await tb.file.icons.set('custom', '/icons/custom.png');

// Remove icon
await tb.file.icons.remove('custom');

// Open file with handler
tb.file.handler.openFile('/path/to/file.pdf', 'pdf');

// Add handler
tb.file.handler.addHandler('myapp', 'custom');

// Remove handler
tb.file.handler.removeHandler('custom');
```

## Environment Detection

```typescript
import { tb, isTerbiumEnvironment, getEnvironment } from '@terbiumos/tjs';

// Check if running in Terbium
if (tb.isTerbium) {
  // Use Terbium-specific features
}

// Get environment info
console.log(tb.env); // 'terbium' | 'browser'

// Use utility functions
const isTerbium = isTerbiumEnvironment();
const env = getEnvironment();
```

## Fallback Behavior

When running outside Terbium, APIs automatically fall back to browser equivalents:

| API | Terbium | Browser Fallback |
|-----|---------|------------------|
| `fs.promises.*` | TFS (OPFS) | File System Access API / Download |
| `sh.promises.*` | System shell | Not supported (warnings) |
| `buffer.*` | Terbium buffer | Uint8Array operations |
| `storage.*` | Terbium Settings | localStorage |
| `notification.*` | Terbium Notifications | Browser Notifications API |
| `dialog.*` | Terbium Dialogs | Native dialogs + custom modals |
| `window.*` | AliceWM | browser window.open |
| `contextmenu.*` | Terbium context menu | Custom DOM context menu |
| `mediaplayer.*` | Terbium media island | Media Session API |
| `screen.*` | Terbium screen capture | Media Capture API |
| `platform.*` | Terbium platform | User agent detection |
| `system.*` | Full system access | Limited or not supported |
| `libcurl.*` | Terbium HTTP client | Standard fetch API |
| `tauth.*` | Terbium Cloud | Not supported |
| `dusk.*` | Dusk runtime | Not supported |

## TypeScript Support

Terbium.js is written in TypeScript and provides full type definitions:

```typescript
import { tb, type TerbiumAPI, type WindowConfig } from '@terbiumos/tjs';

// All APIs are fully typed
const files: string[] = await tb.fs.promises.readdir('/home');

// Type-safe configuration
const config: WindowConfig = {
  title: 'My App',
  width: 800,
  height: 600,
};

tb.window.create(config);
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Watch mode
npm run dev
```

## License

Apache 2.0

---

- **Made with ❤️ for the Terbium OS ecosystem**
- &copy; Copyright 2027 TerbiumOS Development
