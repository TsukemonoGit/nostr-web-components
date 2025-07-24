<svelte:options customElement="nostr-list" accessors={true} />

<script lang="ts">
	import 'nostr-web-components/style.css';
	import type { NostrEvent, Filter as NostrFilter } from 'nostr-tools';
	import { ensureClient } from 'nostr-web-components/utils/ensureClient.js';
	import { connected } from 'nostr-web-components/core/connected.js';
	import { encodeEventToNevent, resolveUrl } from 'nostr-web-components/utils/urlUtils.js';

	import NoteEventRenderer from './KindsEvent/NoteEventRenderer.svelte';
	import type { Display, Theme, UserProfile } from 'nostr-web-components/index.js';

	export let filters: string = '[]';
	export let relays: string[] = [];
	export let theme: Theme = 'auto';
	export let limit: any = 50;
	export let height: string | undefined = undefined;
	export let href: string | null = null;
	export let target: string = '_blank';
	export let noLink: boolean = false;
	export let display: Display = 'card';

	// 変換された数値を格納する変数
	let parsedLimit = 50;
	$: {
		try {
			const n = Number(limit);
			parsedLimit = Number.isFinite(n) && n > 0 ? Math.floor(n) : 50;
		} catch {
			parsedLimit = 50;
		}
	}
	let themeClass = '';

	$: if (theme === 'auto') {
		const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
		themeClass = prefersDark ? 'theme-dark' : 'theme-light';
	} else {
		themeClass = theme === 'dark' ? 'theme-dark' : 'theme-light';
	}

	let events: NostrEvent[] = [];
	let metadataMap: Map<string, UserProfile> = new Map();
	let loading = false;
	let error: string | null = null;
	let mounted = false;

	function initialize() {
		if (mounted) {
			return;
		}
		mounted = true;
		loadEvents();
	}

	$: if (mounted && filters) {
		loadEvents();
	}

	async function loadEvents() {
		if (loading) {
			console.warn('[nostr-list] loadEvents() skipped: already loading');
			return;
		}

		//console.log('[nostr-list] Loading events with filters:', filters);
		loading = true;
		error = null;
		events = [];
		metadataMap.clear();

		let parsedFilters: NostrFilter[];

		try {
			const f = JSON.parse(filters);
			if (!Array.isArray(f)) throw new Error('filters must be an array');

			parsedFilters = f.map((filter) => ({
				...filter,
				limit: filter.limit ?? parsedLimit
			}));
		} catch (err: any) {
			error = `Invalid filters: ${err.message}`;
			loading = false;
			return;
		}

		try {
			const client = await ensureClient(relays);

			if (!client) {
				error = 'Nostr client not available';
				console.error('[nostr-list] Client is null');
				return;
			}

			// limitを各filterに適用
			const limitedFilters = parsedFilters.map((filter) => ({
				...filter,
				limit: filter.limit || parsedLimit
			}));

			const fetchedEvents = await client.fetchByFilters(limitedFilters, relays, false);

			if (!fetchedEvents) {
				error = 'Failed to fetch events';
				return;
			}

			events = fetchedEvents.sort((a, b) => b.created_at - a.created_at).slice(0, limit);
			if (parsedLimit > 0) {
				events = events.slice(0, parsedLimit);
			}

			// メタデータを並行して取得
			await loadMetadata();
		} catch (e: any) {
			error = e?.message || 'Failed to fetch events';
			console.error('[nostr-list] Exception:', e);
		} finally {
			loading = false;
			//console.log('[nostr-list] loading complete');
		}
	}

	async function loadMetadata() {
		try {
			const client = await ensureClient(relays);
			if (!client) return;

			// 重複を除去してpubkeyを取得
			const uniquePubkeys = [...new Set(events.map((event) => event.pubkey))];

			if (uniquePubkeys.length === 0) return;

			// 並行してメタデータを取得
			const metadataPromises = uniquePubkeys.map(async (pubkey) => {
				try {
					const metadata = await client.fetchProfile(pubkey, relays);
					if (metadata) {
						metadataMap.set(pubkey, metadata);
					}
				} catch (e) {
					console.warn(`[nostr-list] Failed to fetch metadata for ${pubkey}:`, e);
				}
			});

			await Promise.allSettled(metadataPromises);

			// リアクティブ更新をトリガー
			metadataMap = metadataMap;
		} catch (e: any) {
			console.error('[nostr-list] Failed to load metadata:', e);
		}
	}

	function getMetadata(pubkey: string) {
		return metadataMap.get(pubkey);
	}
</script>

<div use:connected={initialize} class="nostr-wrapper {themeClass} ">
	{#if loading}
		<div class="loading">Loading events...</div>
	{:else if error}
		<div class="error">Error: {error}</div>
	{:else if events.length === 0}
		<div class="empty">No events found</div>
	{:else}
		<div class="nostr-wrapper {themeClass} ">
			{#each events as note (note.id)}
				{@const metadata = getMetadata(note.pubkey)}
				{@const nevent = encodeEventToNevent(note)}
				{@const linkUrl = nevent ? resolveUrl(href, nevent, 'https://njump.me/{id}') : undefined}
				<NoteEventRenderer
					{note}
					profile={metadata || null}
					{themeClass}
					{height}
					{noLink}
					{linkUrl}
					{display}
					{target}
					{href}
					{theme}
					status={'success'}
				/>
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
		/* 追加: リンクカラー */
		--link-color: #1a0dab;
		--link-hover-color: #551a8b;
		/* メンション用カラー */
		--mention-line-color: #3b82f6; /* 明るめ青 */
		--mention-bg-color: #e0f5ff; /* 薄い青系背景 */

		--external-link-color: #1a0dabb7;
		--external-link-hover-color: #541a8bb4;

		/* ページネーションアクティブ用カラー */
		--pagination-active-bg: #3b82f6;
		--pagination-active-text: #fff;
		--pagination-active-border: #3b82f6;
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
		/* 追加: ダークテーマ用リンクカラー */
		--link-color: #8ab4f8;
		--link-hover-color: #a3d0ff;

		--external-link-color: #8ab4f8c4;
		--external-link-hover-color: #a3cfffd2;

		--pagination-active-bg: #60a5fa;
		--pagination-active-text: #000;
		--pagination-active-border: #60a5fa;
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
		/* ライトテーマ用リンクカラー */
		--link-color: #1a0dab;
		--link-hover-color: #551a8b;
		/* ライトテーマ用メンションカラー */
		--mention-line-color: #3b82f6;
		--mention-bg-color: #e0f5ff;

		--external-link-color: #1a0dabb7;
		--external-link-hover-color: #541a8bb4;
		--pagination-active-bg: #3b82f6;
		--pagination-active-text: #fff;
		--pagination-active-border: #3b82f6;
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
	}

	.event-item:last-child {
		border-bottom: none;
	}
	.external-link {
		display: flex;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		padding: 0;
		color: var(--external-link-color);
		opacity: 0.8;
		border-radius: 20%;
		transition: all 0.3s ease;
		transform: scale(1);
	}

	.external-link:hover {
		opacity: 1;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		transform: scale(1.1);
	}
</style>
