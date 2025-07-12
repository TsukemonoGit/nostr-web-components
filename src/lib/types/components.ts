import { type Event as NostrEvent } from 'nostr-typedef';
// src/types/components.ts
export interface NostrComponentConfig {
	relays?: string[];
	timeout?: number;
	cache?: boolean;
	retryCount?: number;
	styled?: boolean;
}

export interface NostrContainerElement extends HTMLElement {
	getClient(): import('nostr-web-components/core/NostrClient.ts').NostrClient | null;
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
		client: import('nostr-web-components/core/NostrClient.ts').NostrClient;
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
