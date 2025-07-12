<svelte:options customElement="nostr-list" accessors={true} />

<script lang="ts">
	import 'nostr-web-components/style.css';
	import type { NostrEvent, Filter as NostrFilter } from 'nostr-tools';
	import { ensureClient } from 'nostr-web-components/utils/ensureClient.js';
	import { connected } from 'nostr-web-components/core/connected.js';

	export let filters: string = '[]';
	export let relays: string[] = [];
	export let className: string = '';
	export let theme: 'light' | 'dark' | 'auto' = 'auto';
	export let limit: number = 50;

	let themeClass = '';
	$: themeClass = theme === 'dark' ? 'theme-dark' : theme === 'light' ? 'theme-light' : '';

	let events: NostrEvent[] = [];
	let loading = false;
	let error: string | null = null;
	let mounted = false;

	function initialize() {
		console.log('[nostr-list] initialize called');
		console.log('[nostr-list] filters =', filters);

		if (mounted) {
			console.warn('[nostr-list] Skipping initialize: already mounted');
			return;
		}
		mounted = true;
		loadEvents();
	}

	$: if (mounted && filters) {
		console.log('[nostr-list] reactive loadEvents() triggered by filters =', filters);
		loadEvents();
	}

	async function loadEvents() {
		if (loading) {
			console.warn('[nostr-list] loadEvents() skipped: already loading');
			return;
		}

		console.log('[nostr-list] Loading events with filters:', filters);
		loading = true;
		error = null;
		events = [];

		let parsedFilters: NostrFilter[];

		try {
			const f = JSON.parse(filters);
			if (!Array.isArray(f)) throw new Error('filters must be an array');
			parsedFilters = f;
		} catch (err: any) {
			error = `Invalid filters: ${err.message}`;
			loading = false;
			return;
		}

		try {
			const client = await ensureClient(relays);
			console.log('[nostr-list] Client obtained:', client);

			if (!client) {
				error = 'Nostr client not available';
				console.error('[nostr-list] Client is null');
				return;
			}

			// limitを各filterに適用
			const limitedFilters = parsedFilters.map((filter) => ({
				...filter,
				limit: filter.limit || limit
			}));

			const fetchedEvents = await client.fetchByFilters(limitedFilters, relays);
			console.log('[nostr-list] Fetched events:', fetchedEvents);

			if (!fetchedEvents) {
				error = 'Failed to fetch events';
				return;
			}

			// 重複を除去し、created_atで降順ソート
			const uniqueEvents = fetchedEvents
				.filter((event, index, self) => index === self.findIndex((e) => e.id === event.id))
				.slice(0, limit);

			events = uniqueEvents.sort((a, b) => b.created_at - a.created_at);
			console.log('[nostr-list] Processed events:', events.length);
		} catch (e: any) {
			error = e?.message || 'Failed to fetch events';
			console.error('[nostr-list] Exception:', e);
		} finally {
			loading = false;
			console.log('[nostr-list] loading complete');
		}
	}
</script>

<div use:connected={initialize} class="nostr-list-wrapper {themeClass} {className}">
	{#if loading}
		<div class="loading">Loading events...</div>
	{:else if error}
		<div class="error">Error: {error}</div>
	{:else if events.length === 0}
		<div class="empty">No events found</div>
	{:else}
		<div class="events-container">
			{#each events as event (event.id)}
				<nostr-note id={event.id} {relays} {theme}></nostr-note>
			{/each}
		</div>
	{/if}
</div>

<style>
	:host {
		--bg-color: #fff;
		--text-color: #222;
		--border-color: #ddd;
		--error-bg: #f8d7da;
		--error-border: #f5c2c7;
		--error-text: #842029;
		--loading-color: #666;
		--empty-color: #888;

		/* メンション用カラー */
		--mention-line-color: #3b82f6; /* 明るめ青 */
		--mention-bg-color: #e0f5ff; /* 薄い青系背景 */
	}

	.theme-dark {
		--bg-color: #1e1e1e;
		--text-color: #ddd;
		--border-color: #444;
		--error-bg: #4b1c1f;
		--error-border: #8a1f2e;
		--error-text: #ffb3b3;
		--loading-color: #aaa;
		--empty-color: #999;

		/* ダークテーマ用メンションカラー */
		--mention-line-color: #60a5fa; /* 明るめ青で視認性良 */
		--mention-bg-color: #1e3a8a22; /* 透過感ある青背景 */
	}

	.theme-light {
		--bg-color: #fff;
		--text-color: #222;
		--border-color: #ddd;
		--error-bg: #f8d7da;
		--error-border: #f5c2c7;
		--error-text: #842029;
		--loading-color: #666;
		--empty-color: #888;

		/* ライトテーマ用メンションカラー */
		--mention-line-color: #3b82f6;
		--mention-bg-color: #e0f5ff;
	}
	.nostr-list-wrapper {
		width: 100%;
		background-color: var(--bg-color);
		color: var(--text-color);
	}

	.loading {
		padding: 20px;
		text-align: center;
		color: var(--loading-color);
		font-style: italic;
	}

	.error {
		padding: 15px;
		background-color: var(--error-bg);
		border: 1px solid var(--error-border);
		border-radius: 4px;
		color: var(--error-text);
		margin: 10px 0;
	}

	.empty {
		padding: 20px;
		text-align: center;
		color: var(--empty-color);
		font-style: italic;
	}

	.events-container {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.event-item:last-child {
		border-bottom: none;
	}
</style>
