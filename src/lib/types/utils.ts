import { type Event as NostrEvent } from 'nostr-typedef';
import type { UserProfile } from 'nostr-web-components/types/index.js';
// src/types/utils.ts

export interface ParsedContent {
	text: string;
	mentions: string[];
	hashtags: string[];
	urls: string[];
	invoices: string[];
}

export interface NostrMetrics {
	likes: number;
	replies: number;
	reposts: number;
	zaps: number;
	zapAmount: number;
}

export interface NostrThreadEvent {
	event: NostrEvent;
	replies: NostrThreadEvent[];
	metrics: NostrMetrics;
	level: number;
}

export interface NostrSearchResult {
	events: NostrEvent[];
	profiles: UserProfile[];
	total: number;
	hasMore: boolean;
}
