<svelte:options customElement="nostr-note" accessors={true} />

<script lang="ts">
	import 'nostr-web-components/style.css';
	import type { NostrEvent } from 'nostr-tools';
	import { ensureClient } from 'nostr-web-components/utils/ensureClient.js';
	import { encodeNpub, resolveUrl } from 'nostr-web-components/utils/urlUtils.js';

	import NoteLayout1 from './Layout/NoteLayout1.svelte';
	import NameDisplay from './Layout/NameDisplay.svelte';
	import UserAvatar from './Layout/UserAvatar.svelte';
	import Content from './content/Content.svelte';

	import { connected } from 'nostr-web-components/core/connected.js'; // initialize呼び出し用アクション
	import type { UserProfile } from 'nostr-web-components/types/index.ts';
	import NoteLayoutCompact from './Layout/NoteLayoutCompact.svelte';

	export let id: string = '';
	export let relays: string[] = [];
	export let href: string | null = null;
	export let target: string = '_blank';
	export let noLink: boolean = false;
	export let className: string = '';
	export let theme: 'light' | 'dark' | 'auto' = 'auto';
	export let height: string | undefined = undefined;
	export let display: 'card' | 'compact' | 'name' = 'card';

	let themeClass = '';
	$: themeClass = theme === 'dark' ? 'theme-dark' : theme === 'light' ? 'theme-light' : '';

	let loading = false;
	let error: string | null = null;
	let note: NostrEvent | null = null;
	let metadata: UserProfile | null = null;
	let metadataLoading = false;
	let mounted = false;

	$: linkUrl = resolveUrl(href, id, 'https://njump.me/{id}');

	function initialize() {
		//console.log('[nostr-note] initialize called');
		//	console.log('[nostr-note] id =', id);

		if (mounted || !id) {
			console.warn('[nostr-note] Skipping initialize: mounted =', mounted, ', id =', id);
			return;
		}
		mounted = true;
		loadNote();
	}

	$: if (mounted && id) {
		//console.log('[nostr-note] reactive loadNote() triggered by id =', id);
		loadNote();
	}

	async function loadNote() {
		if (!id || loading) {
			//	console.warn('[nostr-note] loadNote() skipped: loading =', loading, ', id =', id);
			return;
		}

		//console.log('[nostr-note] Loading note for id:', id);
		loading = true;
		error = null;
		note = null;
		metadata = null;

		try {
			const client = await ensureClient(relays);
			//console.log('[nostr-note] Client obtained:', client);

			if (!client) {
				error = 'Nostr client not available';
				console.error('[nostr-note] Client is null');
				return;
			}

			const fetchedNote = await client.fetchNote(id, relays);
			//	console.log('[nostr-note] Fetched note:', fetchedNote);

			if (!fetchedNote) {
				error = 'Note not found';
				return;
			}

			note = fetchedNote;

			loadMetadata(fetchedNote.pubkey);
		} catch (e: any) {
			error = e.message || 'Error loading note';
			console.error('[nostr-note] Exception:', e);
		} finally {
			loading = false;
			console.log('[nostr-note] loading complete');
		}
	}

	async function loadMetadata(pubkey: string) {
		//	console.log('[nostr-note] Fetching metadata for pubkey:', pubkey);
		if (metadataLoading) return;
		metadataLoading = true;

		try {
			const client = await ensureClient(relays);
			if (!client) {
				console.error('[nostr-note] Metadata client unavailable');
				return;
			}

			metadata = await client.fetchProfile(pubkey, relays);
			//	console.log('[nostr-note] Metadata fetched:', metadata);
		} catch (e) {
			console.warn('[nostr-note] Failed to load metadata:', e);
		} finally {
			metadataLoading = false;
		}
	}

	$: replyUserList = note?.tags
		?.filter((tag) => tag[0] === 'p' && typeof tag[1] === 'string')
		?.map((tag) => tag[1]);
	//$: console.log(replyUserList);
</script>

<!-- Web Components として mount 時に initialize() を実行 -->
<div use:connected={initialize} class="nostr-wrapper {themeClass} {className}">
	{#if display === 'card'}
		<NoteLayout1
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
				{#if note}<span class="timestamp">{new Date(note.created_at * 1000).toLocaleString()}</span
					>{/if}
			{/snippet}
			{#snippet replyUser()}
				{#each replyUserList || [] as user}
					{@const npub = encodeNpub(user)}<nostr-profile display="name" {theme} user={npub}
					></nostr-profile>{/each}
			{/snippet}
			{#snippet content()}
				{#if note}<Content
						text={note.content}
						{display}
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
				{#if note}<span class="timestamp">{new Date(note.created_at * 1000).toLocaleString()}</span
					>{/if}
			{/snippet}
			{#snippet replyUser()}
				{#each replyUserList || [] as user}
					{@const npub = encodeNpub(user)}<nostr-profile display="name" {theme} user={npub}
					></nostr-profile>{/each}
			{/snippet}
			{#snippet content()}
				{#if note}<Content
						text={note.content}
						{display}
						{themeClass}
						{theme}
						tags={note.tags}
					/>{/if}
			{/snippet}
			{#snippet error()}<span>Error: {error}</span>{/snippet}
		</NoteLayoutCompact>
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

		/* ダークテーマ用メンションカラー */
		--mention-line-color: #60a5fa; /* 明るめ青で視認性良 */
		--mention-bg-color: #1e3a8a22; /* 透過感ある青背景 */
		/* 追加: ダークテーマ用リンクカラー */
		--link-color: #8ab4f8;
		--link-hover-color: #a3d0ff;

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
		/* ライトテーマ用リンクカラー */
		--link-color: #1a0dab;
		--link-hover-color: #551a8b;
		/* ライトテーマ用メンションカラー */
		--mention-line-color: #3b82f6;
		--mention-bg-color: #e0f5ff;

		--external-link-color: #1a0dabb7;
		--external-link-hover-color: #541a8bb4;
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
