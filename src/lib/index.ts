// lib/index.ts
import NostrContainer from 'nostr-web-components/components/NostrContainer.svelte';
import NostrNote from 'nostr-web-components/components/NostrNote.svelte';
import NostrProfile from 'nostr-web-components/components/NostrProfile.svelte';
export * from 'nostr-web-components/types/index.js';
export { NostrContainer, NostrNote, NostrProfile };
/* 
export function registerComponents() {
	if (!customElements.get('nostr-container')) {
		customElements.define('nostr-container', NostrContainer as unknown as CustomElementConstructor);
	}

	if (!customElements.get('nostr-note')) {
		customElements.define('nostr-note', NostrNote as unknown as CustomElementConstructor);
	}

	if (!customElements.get('nostr-profile')) {
		customElements.define('nostr-profile', NostrProfile as unknown as CustomElementConstructor);
	}
}
registerComponents(); */
// src/types/index.ts

export interface NostrClientConfig {
	relays: string[];
	timeout?: number;
	maxConnections?: number;
}
