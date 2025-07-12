import type { NostrClient } from 'nostr-web-components/core/NostrClient.js';
import { writable } from 'svelte/store';

export const nostrClient = writable<NostrClient | null>(null);
