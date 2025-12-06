// src/lib/types/components.ts
import { type Event as NostrEvent } from 'nostr-typedef';
import type { NostrClient } from 'nostr-web-components/core/NostrClient.js';

export interface NostrComponentConfig {
	relays?: string[];
	timeout?: number;
	cache?: boolean;
	retryCount?: number;
	styled?: boolean;
}

export interface NostrContainerElement extends HTMLElement {
	getClient(): NostrClient | null;
}

export interface NostrNoteElement extends HTMLElement {
	loadNote(): Promise<void>;
	refresh(): Promise<void>;
}

export interface NostrProfileElement extends HTMLElement {
	loadProfile(): Promise<void>;
	refresh(): Promise<void>;
}

export interface NostrClientReadyEvent extends CustomEvent {
	detail: {
		client: NostrClient;
	};
}

export interface NostrEventLoadedEvent extends CustomEvent {
	detail: {
		event: NostrEvent;
		element: HTMLElement;
	};
}

export interface NostrErrorEvent extends CustomEvent {
	detail: {
		error: Error;
		element: HTMLElement;
	};
}
