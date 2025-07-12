# Nostr Web Components

A lightweight, easy-to-use Web Components library for integrating Nostr protocol functionality into web applications.

## Installation

```bash
npm install nostr-web-components
```

## Usage

### Basic Setup

```html
<script type="module">
	import 'nostr-web-components';
</script>

<nostr-container relays='["wss://relay.damus.io", "wss://nos.lol"]'>
	<nostr-note id="note1abc..."></nostr-note>
	<nostr-profile id="npub1xyz..."></nostr-profile>
</nostr-container>
```

### Individual Components

```html
<nostr-note id="note1abc..." relays='["wss://relay.damus.io"]'></nostr-note>
<nostr-profile id="npub1xyz..." relays='["wss://nos.lol"]'></nostr-profile>
```

### JavaScript API

```javascript
import { NostrClient } from 'nostr-web-components';

const client = new NostrClient({
	relays: ['wss://relay.damus.io', 'wss://nos.lol']
});

const note = await client.fetchNote('note1abc...');
const profile = await client.fetchProfile('npub1xyz...');
```

## Components

### `<nostr-container>`

Container component that provides relay configuration to child components.

**Attributes:**

- `relays`: JSON array of relay URLs

### `<nostr-note>`

Displays a Nostr note.

**Attributes:**

- `id`: Note ID (note1... or nevent1... format)
- `nevent`: Alternative to id for nevent format
- `relays`: Optional relay configuration (overrides container)

### `<nostr-profile>`

Displays a Nostr profile.

**Attributes:**

- `id`: Profile ID (npub1... format)
- `relays`: Optional relay configuration (overrides container)
- `href`: Custom URL template (use `{id}` placeholder for dynamic URLs)
- `target`: Link target attribute (default: `_blank`)
- `onclick`: JavaScript code to execute on click
- `noLink`: Boolean to disable link functionality
- `display`: Display mode - `card` (default), `compact`, or `name`

**Examples:**

```html
<!-- Basic profile card -->
<nostr-profile id="npub1xyz..."></nostr-profile>

<!-- Custom URL template -->
<nostr-profile id="npub1xyz..." href="https://primal.net/p/{id}"></nostr-profile>

<!-- Different display modes -->
<nostr-profile id="npub1xyz..." display="compact"></nostr-profile>
<nostr-profile id="npub1xyz..." display="name"></nostr-profile>

<!-- No link functionality -->
<nostr-profile id="npub1xyz..." noLink="true"></nostr-profile>

<!-- Custom click handler -->
<nostr-profile id="npub1xyz..." onclick="console.log('Profile clicked')"></nostr-profile>
```

## Development

```bash
npm install
npm run build
npm run dev    # Watch mode
npm run serve  # Development server
```

## License

MIT
