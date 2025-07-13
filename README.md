[EN/[JA](./README-ja.md)]

# Nostr Web Components

A lightweight, easy-to-use Web Components library for integrating Nostr protocol functionality into web applications.

## Installation

### Option 1: CDN (Recommended for quick start)

```html
<script src="https://cdn.jsdelivr.net/npm/@konemono/nostr-web-components@latest/dist/nostr-web-components.iife.min.js"></script>
```

### Option 2: NPM Package

```bash
npm install @konemono/nostr-web-components
```

Then import in your JavaScript:

```javascript
import '@konemono/nostr-web-components';
```

## Usage

### Basic Setup with `<nostr-container>`

The `<nostr-container>` component provides a way to share relay configuration to all child components.

#### Using CDN

```html
<!DOCTYPE html>
<html>
	<head>
		<script src="https://cdn.jsdelivr.net/npm/@konemono/nostr-web-components@latest/dist/nostr-web-components.iife.min.js"></script>
	</head>
	<body>
		<nostr-container relays='["wss://relay.damus.io", "wss://nos.lol"]'>
			<nostr-note id="note1abc..."></nostr-note>
			<nostr-profile id="npub1xyz..."></nostr-profile>
			<nostr-list filters='[{"kinds":[1],"limit":10}]'></nostr-list>
		</nostr-container>
	</body>
</html>
```

#### Using NPM

```javascript
// main.js
import '@konemono/nostr-web-components';

// Now you can use the components in your HTML
```

```html
<nostr-container relays='["wss://relay.damus.io", "wss://nos.lol"]'>
	<nostr-note id="note1abc..."></nostr-note>
	<nostr-profile id="npub1xyz..."></nostr-profile>
	<nostr-list filters='[{"kinds":[1],"limit":10}]'></nostr-list>
</nostr-container>
```

### Using Individual Components Without `<nostr-container>`

Each component works independently by accessing a **shared global client instance** internally. Therefore, `<nostr-container>` is **optional**. For example, to display a single note:

```html
<nostr-note id="note1abc..."></nostr-note>
```

In this case, the note will be fetched using the default relay list internally managed by the global client.

### Overriding Relays per Component

You can also specify the relays attribute on individual components to override the container or global relay settings temporarily:

```html
<nostr-note id="note1abc..." relays='["wss://relay.damus.io"]'></nostr-note>
<nostr-profile id="npub1xyz..." relays='["wss://nos.lol"]'></nostr-profile>
<nostr-list filters='[{"kinds":[1],"limit":10}]' relays='["wss://relay.damus.io"]'></nostr-list>
```

### Important Notes About `<nostr-container>`

- Multiple `<nostr-container>` instances can exist, but **all components share a single global client internally**.
- The container mainly serves to propagate relay configuration via context to child components.
- Relay configuration in a container does **not** create separate or isolated Nostr clients.
- For advanced use cases requiring isolated clients or multiple relay sets, consider managing clients programmatically with the JavaScript API.

---

## Components

### `<nostr-container>`

Container component that provides relay configuration to child components via context. This is **optional** and mainly used to avoid repeating relay configuration on multiple child components.

Attributes:

- relays: JSON array of relay URLs

### `<nostr-note>`

Displays a Nostr note.

Attributes:

- id: Note ID (note1... or nevent1... format)
- nevent: Alternative to id for nevent format
- relays: Optional relay configuration (overrides container)
- href: Custom URL template (use {id} placeholder)
- target: Link target attribute (default: \_blank)
- noLink: Boolean to disable link functionality
- theme: Theme mode - light, dark, or auto (default)
- height: Custom height for the note container

Examples:

Basic note

```html
<nostr-note id="note1abc..."></nostr-note>
```

Custom URL template

```html
<nostr-note id="note1abc..." href="https://njump.me/{id}"></nostr-note>
```

Dark theme

```html
<nostr-note id="note1abc..." theme="dark"></nostr-note>
```

No link functionality

```html
<nostr-note id="note1abc..." noLink="true"></nostr-note>
```

### `<nostr-profile>`

Displays a Nostr profile.

Attributes:

- id: Profile ID (npub1... format)
- relays: Optional relay configuration (overrides container)
- href: Custom URL template (use {id} placeholder for dynamic URLs)
- target: Link target attribute (default: \_blank)
- onclick: JavaScript code to execute on click
- noLink: Boolean to disable link functionality
- display: Display mode - card (default), compact, or name

Examples:

Basic profile card

```html
<nostr-profile id="npub1xyz..."></nostr-profile>
```

Custom URL template

```html
<nostr-profile id="npub1xyz..." href="https://primal.net/p/{id}"></nostr-profile>
```

Different display modes

```html
<nostr-profile id="npub1xyz..." display="compact"></nostr-profile>
<nostr-profile id="npub1xyz..." display="name"></nostr-profile>
```

No link functionality

```html
<nostr-profile id="npub1xyz..." noLink="true"></nostr-profile>
```

Custom click handler

```html
<nostr-profile id="npub1xyz..." onclick="console.log('Profile clicked')"></nostr-profile>
```

### `<nostr-list>`

Displays a list of Nostr events based on filters.

Attributes:

- filters: JSON string of Nostr filters array
- relays: Optional relay configuration (overrides container)
- theme: Theme mode - light, dark, or auto (default)
- limit: Maximum number of events to fetch (default: 50)

Examples:

Basic timeline

```html
<nostr-list filters='[{"kinds":[1],"limit":10}]'></nostr-list>
```

Posts from specific author

```html
<nostr-list filters='[{"kinds":[1],"authors":["npub1xyz..."],"limit":5}]'></nostr-list>
```

Multiple filters

```html
<nostr-list filters='[{"kinds":[1],"limit":10},{"kinds":[6],"limit":5}]'> </nostr-list>
```

Custom relays and theme

```html
<nostr-list
	filters='[{"kinds":[1],"limit":20}]'
	relays='["wss://relay.damus.io"]'
	theme="dark"
	limit="30"
>
</nostr-list>
```

## Filter Examples

Common filter patterns for `<nostr-list>`:

```js
// Text notes (kind 1)
'[{"kinds":[1],"limit":10}]';

// Posts from specific authors
'[{"kinds":[1],"authors":["npub1...","npub2..."],"limit":5}]';

// Posts with specific hashtags
'[{"kinds":[1],"#t":["nostr","bitcoin"],"limit":10}]';

// Posts from the last hour
'[{"kinds":[1],"since":' + (Math.floor(Date.now() / 1000) - 3600) + ',"limit":20}]';

// Replies to a specific note
('[{"kinds":[1],"#e":["note1abc..."],"limit":10}]');

// Multiple kinds
('[{"kinds":[1,6,7],"limit":15}]');
```

## Development

```bash
npm install
npm run build
npm run dev # Watch mode
npm run serve # Development server
```

## License

MIT
