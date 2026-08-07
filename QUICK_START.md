# Terbium.js Quick Start Guide

## Installation

```bash
npm install @terbiumos/tjs
```

## Package Name

The package is named **`@terbiumos/tjs`** which stands for:
- `@terbiumos` - TerbiumOS organization scope
- `tjs` - Terbium JavaScript SDK (shorter than "terbium.js")

## Basic Usage

### TypeScript/ESM

```typescript
import { tb } from '@terbiumos/tjs';

// Check environment
if (tb.isTerbium) {
  console.log('Running in Terbium OS!');
} else {
  console.log('Running in browser mode');
}

// Use APIs - they work everywhere!
await tb.storage.set('user', { name: 'John' });
const user = await tb.storage.get('user');

tb.notification.show({
  title: 'Welcome',
  message: 'Hello from Terbium.js!',
  type: 'success'
});
```

### CommonJS

```javascript
const { tb } = require('@terbiumos/tjs');

async function init() {
  await tb.ready; // Wait for initialization
  
  // Now use the API
  await tb.fs.writeFile('hello.txt', 'Hello, world!');
}

init();
```

### CDN (Browser)

```html
<script type="module">
  import { tb } from 'https://cdn.jsdelivr.net/npm/@terbiumos/tjs@latest/dist/index.mjs';
  
  // Use tb API
  await tb.dialog.alert('Hello from CDN!');
</script>
```

Or with script tag:

```html
<script src="https://cdn.jsdelivr.net/npm/@terbiumos/tjs@latest/dist/index.min.js"></script>
<script>
  const { tb } = window.TerbiumJS;
  
  tb.dialog.alert('Hello!');
</script>
```

## Environment Detection

Terbium.js automatically detects whether it's running in Terbium OS or a standard browser:

```typescript
import { tb, isTerbiumEnvironment } from '@terbiumos/tjs';

// Method 1: Use the property
if (tb.isTerbium) {
  // Use Terbium-specific features
  tb.window.create({ title: 'My App' });
}

// Method 2: Use the function
if (isTerbiumEnvironment()) {
  // Same as above
}

// Method 3: Check environment string
if (tb.env === 'terbium') {
  // Terbium-specific code
} else {
  // Browser-specific code
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

// Check existence
const exists = await tb.fs.exists('/path/to/file.txt');

// Get file stats (Terbium only)
const stats = await tb.fs.stat('/path/to/file.txt');
```

### Storage (Settings)

```typescript
// Store data
await tb.storage.set('preferences', {
  theme: 'dark',
  language: 'en'
});

// Retrieve data
const prefs = await tb.storage.get('preferences');

// Remove data
await tb.storage.remove('preferences');

// Get all keys
const keys = await tb.storage.keys();

// Clear all
await tb.storage.clear();
```

### Notifications

```typescript
// Show a notification
await tb.notification.show({
  title: 'Success!',
  message: 'Operation completed successfully',
  type: 'success',  // 'success' | 'error' | 'warning' | 'info'
  timeout: 5000,    // milliseconds
});

// Dismiss notification (Terbium only)
await tb.notification.dismiss();
```

### Dialogs

```typescript
// Alert
await tb.dialog.alert('Something happened!', 'Alert Title');

// Confirm
const confirmed = await tb.dialog.confirm(
  'Are you sure you want to delete this?',
  'Confirm Action'
);

if (confirmed) {
  // User clicked Yes/OK
}

// Prompt
const name = await tb.dialog.prompt(
  'Enter your name:',
  'John Doe',  // default value
  'User Input'
);

console.log('User entered:', name);
```

### Window Management

```typescript
// Create a new window
tb.window.create({
  title: 'My App',
  src: '/app.html',
  width: 800,
  height: 600,
  resizable: true,
  maximizable: true,
});

// Get current window ID
const windowId = tb.window.getId();

// Set window title
tb.window.titlebar.setText('New Title');

// Close window
tb.window.close();

// Reload window
tb.window.reload();
```

### Desktop (Terbium only)

```typescript
// Set theme color
await tb.desktop.preferences.setTheme('#1a1a1a');

// Get theme color
const theme = await tb.desktop.preferences.theme();

// Set accent color
await tb.desktop.preferences.setAccent('#32ae62');

// Set wallpaper
await tb.desktop.wallpaper.set('/path/to/image.jpg');

// Pin app to dock
await tb.desktop.dock.pin({
  title: 'My App',
  icon: '/icon.png',
  src: '/app.html'
});
```

### User Info

```typescript
// Get username
const username = await tb.user.username();

// Get profile picture URL
const pfp = await tb.user.pfp();

// Get email (if available)
const email = await tb.user.email();

// Check if guest
const isGuest = await tb.user.isGuest();
```

## Building Cross-Environment Apps

The key advantage of Terbium.js is that you can write code once and it works in both Terbium and browsers:

```typescript
import { tb } from '@terbiumos/tjs';

async function saveUserPreferences(prefs) {
  // In Terbium: saves to user settings.json
  // In browser: saves to localStorage
  await tb.storage.set('userPrefs', prefs);
  
  // In Terbium: shows native notification
  // In browser: uses Notification API
  await tb.notification.show({
    title: 'Saved',
    message: 'Preferences saved successfully',
    type: 'success'
  });
}

// This function works identically in both environments!
saveUserPreferences({ theme: 'dark', lang: 'en' });
```

## TypeScript Support

Terbium.js is fully typed:

```typescript
import { tb, type TerbiumAPI, type WindowConfig } from '@terbiumos/tjs';

// All types are exported
const config: WindowConfig = {
  title: 'My Window',
  width: 800,
  height: 600
};

// API is fully typed
tb.window.create(config);

// Custom function with types
async function createApp(api: TerbiumAPI) {
  await api.storage.set('initialized', true);
}

createApp(tb);
```

## Next Steps

- Read the [full API documentation](./README.md)
- Check out [examples](./examples/)
- Learn about [React/Vue integration](./examples/frameworks/)
- Explore [advanced patterns](./docs/advanced.md)

## Support

- [GitHub Issues](https://github.com/terbiumos/tjs/issues)
- [Discord Community](https://corporate.terbiumon.top/discord)
- [Documentation](https://github.com/TerbiumOS/web-v2/tree/main/docs)
