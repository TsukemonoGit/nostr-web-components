// lib/index.ts
import NostrContainer from 'nostr-web-components/components/NostrContainer.svelte';
import NostrNote from 'nostr-web-components/components/NostrNote.svelte';
import NostrProfile from 'nostr-web-components/components/NostrProfile.svelte';
import NostrEventList from './components/NostrEventList.svelte';
import NostrNaddr from 'nostr-web-components/components/NostrNaddr.svelte';

export * from 'nostr-web-components/types/index.js';
export { NostrContainer, NostrNote, NostrProfile, NostrEventList, NostrNaddr };

export interface NostrClientConfig {
	relays: string[];
	timeout?: number;
	maxConnections?: number;
}
