// utils/ensureClient.ts
import { NostrClient } from 'nostr-web-components/core/NostrClient.js';
import { get } from 'svelte/store';
import { nostrClient } from './store.js';
import { defaultRelays } from './utils.js';

export async function ensureClient(relays: string[] = []): Promise<NostrClient> {
	let client = get(nostrClient);

	if (!client) {
		const fallbackRelays = relays.length > 0 ? relays : defaultRelays;
		client = new NostrClient({ relays: fallbackRelays });
		nostrClient.set(client);
	}

	return client;
}
