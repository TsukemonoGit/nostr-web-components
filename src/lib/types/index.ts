// src/types/index.ts
import { type Event as NostrEvent } from 'nostr-typedef';
export * from 'nostr-web-components/types/components.js';
export * from 'nostr-web-components/types/utils.js';

export interface UserProfile {
	pubkey: string;
	name?: string;
	about?: string;
	picture?: string;
	nip05?: string;
	display_name?: string;
	website?: string;
	banner?: string;
	lud16?: string;
	tags: string[][];
}

export interface NostrClientConfig {
	relays: string[];
	timeout?: number;
	maxConnections?: number;
	reconnectInterval?: number;
	maxRetries?: number;
}

export interface NostrRelay {
	url: string;
	read: boolean;
	write: boolean;
}

export interface NostrPacket {
	type: 'event' | 'notice' | 'eose' | 'ok' | 'auth';
	event?: NostrEvent;
	notice?: string;
	subscriptionId?: string;
	relay?: string;
	eventId?: string;
	accepted?: boolean;
	message?: string;
}
export interface NostrSearchResult {
	events: NostrEvent[];
	profiles: UserProfile[];
	total: number;
	hasMore: boolean;
}
export type Status = 'init' | 'loading' | 'error' | 'success' | 'nodata';
