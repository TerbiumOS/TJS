# Terbium.js (@terbiumos/tjs)

Universal SDK for building applications that work seamlessly in both Terbium OS and standard web browsers.

## Features

- **Environment Detection** - Automatically detects if running in Terbium or browser
- **Automatic Fallbacks** - Uses browser APIs when Terbium APIs are unavailable
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
  await tb.fs.writeFile('hello.txt', content);
}

// Check environment
if (tb.isTerbium) {
  console.log('Running in Terbium OS!');
} else {
  console.log('Running in standard browser');
}
```

## API Overview

### File System

```typescript
// Write a file
await tb.fs.writeFile('/path/to/file.txt', 'Hello, Terbium!');

// Read a file
const content = await tb.fs.readFile('/path/to/file.txt');

// List directory
const files = await tb.fs.readdir('/home');

// Check if file exists
const exists = await tb.fs.exists('/path/to/file.txt');
```

### Storage

```typescript
// Set data
await tb.storage.set('key', 'value');

// Get data
const value = await tb.storage.get('key');

// Remove data
await tb.storage.remove('key');
```

### Notifications

```typescript
// Show a notification
tb.notification.show({
  title: 'Hello!',
  message: 'This is a test notification',
  type: 'success'
});
```

### Dialogs

```typescript
// Show an alert
await tb.dialog.alert('Hello, world!');

// Show a confirm dialog
const confirmed = await tb.dialog.confirm('Are you sure?');

// Show a prompt
const input = await tb.dialog.prompt('Enter your name:');
```

### Window Management (Terbium only)

```typescript
// Create a new window
tb.window.create({
  title: 'My App',
  src: '/app.html',
  width: 800,
  height: 600
});

// Get current window ID
const windowId = tb.window.getId();

// Close current window
tb.window.close();
```

## Environment Detection

Terbium.js automatically detects the runtime environment:

```typescript
import { tb } from '@terbiumos/tjs';

// Check if running in Terbium
if (tb.isTerbium) {
  // Use Terbium-specific features
  tb.window.create({ ... });
} else {
  // Use browser-specific fallbacks
  window.open('/app.html');
}

// Get environment info
console.log(tb.env); // 'terbium' | 'browser'
```

## Fallback Behavior

When running outside Terbium, APIs automatically fall back to browser equivalents:

| API | Terbium | Browser Fallback |
|-----|---------|------------------|
| `tb.fs.writeFile` | TFS (OPFS) | File System Access API / Download |
| `tb.fs.readFile` | TFS (OPFS) | File System Access API / Upload |
| `tb.storage` | Terbium Settings | localStorage |
| `tb.notification` | Terbium Notifications | Browser Notifications API |
| `tb.dialog` | Terbium Dialogs | Browser native dialogs |
| `tb.window` | AliceWM | browser window.open |

## TypeScript Support

Terbium.js is written in TypeScript and provides full type definitions:

```typescript
import { tb, type TerbiumAPI } from '@terbiumos/tjs';

// All APIs are fully typed
const files: string[] = await tb.fs.readdir('/home');

// Type-safe configuration
const window = tb.window.create({
  title: 'My App',  // ✓ Type-checked
  width: 800,       // ✓ Type-checked
  invalid: 'prop'   // ✗ Type error
});
```

## Examples

See the [examples](./examples) directory for complete working examples:

- [Basic Usage](./examples/basic)
- [File Management](./examples/file-manager)
- [Cross-Environment App](./examples/universal-app)
- [React Integration](./examples/react-app)
- [Vue Integration](./examples/vue-app)

## License

Apache 2.0
