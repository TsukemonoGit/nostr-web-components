<svelte:options customElement="nostr-list" accessors={true} />

<script lang="ts">
	import 'nostr-web-components/style.css';
	import type { NostrEvent, Filter as NostrFilter } from 'nostr-tools';
	import { ensureClient } from 'nostr-web-components/utils/ensureClient.js';
	import { connected } from 'nostr-web-components/core/connected.js';
	import NoteLayout1 from './Layout/NoteLayout1.svelte';
	import { encodeNpub, resolveUrl, encodeNevent } from 'nostr-web-components/utils/urlUtils.js';
	import UserAvatar from './Layout/UserAvatar.svelte';
	import NameDisplay from './Layout/NameDisplay.svelte';
	import Content from './content/Content.svelte';
	import type { UserProfile } from 'nostr-web-components/types';
	import NoteLayoutCompact from './Layout/NoteLayoutCompact.svelte';

	export let filters: string = '[]';
	export let relays: string[] = [];
	export let className: string = '';
	export let theme: 'light' | 'dark' | 'auto' = 'auto';
	export let limit: any = 50;
	export let height: string | undefined = undefined;
	export let href: string | null = null;
	export let target: string = '_blank';
	export let noLink: boolean = false;
	export let display: 'card' | 'compact' | 'name' = 'card';

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
	$: themeClass = theme === 'dark' ? 'theme-dark' : theme === 'light' ? 'theme-light' : '';

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

		console.log('[nostr-list] Loading events with filters:', filters);
		loading = true;
		error = null;
		events = [];
		metadataMap.clear();

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

			events = fetchedEvents.sort((a, b) => b.created_at - a.created_at);
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
			console.log('[nostr-list] loading complete');
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

<div use:connected={initialize} class="nostr-wrapper {themeClass} {className}">
	{#if loading}
		<div class="loading">Loading events...</div>
	{:else if error}
		<div class="error">Error: {error}</div>
	{:else if events.length === 0}
		<div class="empty">No events found</div>
	{:else}
		<div class="nostr-wrapper {themeClass} {className}">
			{#each events as note (note.id)}
				{@const replyUserList = note?.tags
					?.filter((tag) => tag[0] === 'p' && typeof tag[1] === 'string')
					?.map((tag) => tag[1])}
				{@const metadata = getMetadata(note.pubkey)}
				{@const nevent = encodeNevent(note)}
				{@const linkUrl = nevent ? resolveUrl(href, nevent, 'https://njump.me/{id}') : undefined}
				{#if display === 'card'}
					<NoteLayout1
						class={className}
						{themeClass}
						{noLink}
						{height}
						showPlaceholders={loading || !note}
					>
						{#snippet link()}
							{#if linkUrl}
								<!-- svelte-ignore a11y_consider_explicit_label -->
								<a
									href={linkUrl}
									{target}
									referrerpolicy="no-referrer"
									class="external-link"
									title="Open in new tab"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="lucide lucide-external-link-icon lucide-external-link"
									>
										<path d="M15 3h6v6" />
										<path d="M10 14 21 3" />
										<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
									</svg>
								</a>
							{/if}
						{/snippet}

						{#snippet avatar()}<UserAvatar src={metadata?.picture} />{/snippet}
						{#snippet name()}
							{@const encodedNpub = note ? encodeNpub(note.pubkey) : undefined}
							{@const userUrl = encodedNpub
								? resolveUrl(href, encodedNpub, 'https://njump.me/{id}')
								: undefined}
							<NameDisplay
								{themeClass}
								href={userUrl}
								name={`${metadata?.display_name || ''}@${metadata?.name || 'no name'}`}
							/>{/snippet}
						{#snippet createdAt()}
							{#if note}<span class="timestamp"
									>{new Date(note.created_at * 1000).toLocaleString()}</span
								>{/if}
						{/snippet}
						{#snippet replyUser()}
							{#each replyUserList || [] as user}
								{@const npub = encodeNpub(user)}<nostr-profile display="name" {theme} user={npub}
								></nostr-profile>{/each}
						{/snippet}
						{#snippet content()}
							{#if note}<Content
									{display}
									text={note.content}
									{themeClass}
									{theme}
									tags={note.tags}
								/>{/if}
						{/snippet}
						{#snippet error()}<span>Error: {error}</span>{/snippet}
					</NoteLayout1>
				{:else if display === 'compact'}
					<NoteLayoutCompact
						class={className}
						{themeClass}
						{noLink}
						{height}
						showPlaceholders={loading || !note}
					>
						{#snippet link()}
							<!-- svelte-ignore a11y_consider_explicit_label -->
							<a
								href={linkUrl}
								{target}
								referrerpolicy="no-referrer"
								class="external-link"
								title="Open in new tab"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="lucide lucide-external-link-icon lucide-external-link"
								>
									<path d="M15 3h6v6" />
									<path d="M10 14 21 3" />
									<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
								</svg>
							</a>
						{/snippet}

						{#snippet avatar()}<UserAvatar src={metadata?.picture} />{/snippet}
						{#snippet name()}
							{@const encodedNpub = note ? encodeNpub(note.pubkey) : undefined}
							{@const userUrl = encodedNpub
								? resolveUrl(href, encodedNpub, 'https://njump.me/{id}')
								: undefined}
							<NameDisplay
								{themeClass}
								href={userUrl}
								name={`${metadata?.display_name || ''}@${metadata?.name || 'no name'}`}
							/>{/snippet}
						{#snippet createdAt()}
							{#if note}<span class="timestamp"
									>{new Date(note.created_at * 1000).toLocaleString()}</span
								>{/if}
						{/snippet}
						{#snippet replyUser()}
							{#each replyUserList || [] as user}
								{@const npub = encodeNpub(user)}<nostr-profile display="name" {theme} user={npub}
								></nostr-profile>{/each}
						{/snippet}
						{#snippet content()}
							{#if note}<Content
									{display}
									text={note.content}
									{themeClass}
									{theme}
									tags={note.tags}
								/>{/if}
						{/snippet}
						{#snippet error()}<span>Error: {error}</span>{/snippet}
					</NoteLayoutCompact>
				{/if}
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
		/* 追加: ダークテーマ用リンクカラー */
		--link-color: #8ab4f8;
		--link-hover-color: #a3d0ff;
		/* ダークテーマ用メンションカラー */
		--mention-line-color: #60a5fa; /* 明るめ青で視認性良 */
		--mention-bg-color: #1e3a8a22; /* 透過感ある青背景 */

		--external-link-color: #8ab4f8c4;
		--external-link-hover-color: #a3cfffd2;
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
		/* 追加: リンクカラー */
		--link-color: #1a0dab;
		--link-hover-color: #551a8b;
		/* ライトテーマ用メンションカラー */
		--link-color: #1a0dab;
		--link-hover-color: #551a8b;

		--external-link-color: #1a0dabb7;
		--external-link-hover-color: #541a8bb4;
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
