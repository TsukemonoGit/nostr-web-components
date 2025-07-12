<!-- svelte-ignore options_missing_custom_element -->
<svelte:options customElement="nostr-note" />

<script lang="ts">
	import 'nostr-web-components/style.css';
	import type { NostrEvent } from 'nostr-tools';
	import { ensureClient } from 'nostr-web-components/utils/ensureClient.js';
	import { resolveUrl } from 'nostr-web-components/utils/urlUtils.js';
	import NoteLayout1 from './Layout/NoteLayout1.svelte';
	import NameDisplay from './Layout/NameDisplay.svelte';
	import UserAvatar from './Layout/UserAvatar.svelte';
	import Content from './content/Content.svelte';

	export let id: string = '';
	export let relays: string[] = [];
	export let href: string | null = null;
	export let target: string = '_blank';
	export let noLink: boolean = false;
	export let className: string = '';
	export let theme: 'light' | 'dark' | 'auto' = 'auto';
	$: themeClass = theme === 'dark' ? 'theme-dark' : theme === 'light' ? 'theme-light' : '';

	let loading = true;
	let error: string | null = null;
	let note: NostrEvent | null = null;
	let metadata: { name?: string; picture?: string } | null = null;
	let metadataLoading = false;

	async function loadNote() {
		if (!id) {
			error = 'Note ID or nevent is required';
			loading = false;
			return;
		}

		loading = true;
		error = null;
		note = null;
		metadata = null;

		const client = await ensureClient(relays);
		if (!client) {
			error = 'Nostr client not available';
			loading = false;
			return;
		}

		try {
			// 1. まずnoteを取得
			const fetchedNote = await client.fetchNote(id, relays);
			if (!fetchedNote) {
				error = 'Note not found';
				note = null;
				loading = false;
				return;
			}

			note = fetchedNote;
			loading = false;

			// 2. noteが取得できたら、metadataを非同期で取得
			loadMetadata(fetchedNote.pubkey);
		} catch (e: any) {
			error = e.message || 'Error loading note';
			note = null;
			loading = false;
		}
	}

	async function loadMetadata(pubkey: string) {
		if (metadataLoading) return;
		metadataLoading = true;

		try {
			const client = await ensureClient(relays);
			if (!client) return;

			// metadataを取得（kind 0イベント）
			metadata = await client.fetchProfile(pubkey, relays);
		} catch (e) {
			console.warn('Failed to load metadata:', e);
		} finally {
			metadataLoading = false;
		}
	}

	$: if (id) {
		loadNote();
	}

	$: linkUrl = resolveUrl(href, id, 'https://njump.me/{id}');
</script>

<NoteLayout1 class={className} {themeClass} {noLink} showPlaceholders={loading || !note}>
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

	{#snippet avatar()}
		<UserAvatar src={metadata?.picture} />
	{/snippet}

	{#snippet name()}
		<NameDisplay name={metadata?.name} />
	{/snippet}

	{#snippet createdAt()}
		{#if note}
			<span class="timestamp">{new Date(note.created_at * 1000).toLocaleString()}</span>
		{/if}
	{/snippet}

	{#snippet content()}
		{#if note}<Content text={note.content} {themeClass} tags={note.tags} />
		{/if}
	{/snippet}

	{#snippet error()}
		<span>Error: {error}</span>
	{/snippet}
</NoteLayout1>

<style>
	:host {
		--bg-color: #fff;
		--text-color: #222;
		--border-color: #ddd;
		--name-color: #333;
		--time-color: #888;
		--placeholder-color: #e0e0e0;
		--error-bg: #f8d7da;
		--error-border: #f5c2c7;
		--error-text: #842029;

		/* 追加: リンクカラー */
		--link-color: #1a0dab;
		--link-hover-color: #551a8b;
	}

	.theme-dark,
	:host(.dark) {
		--bg-color: #1e1e1e;
		--text-color: #ddd;
		--border-color: #444;
		--name-color: #eee;
		--time-color: #aaa;
		--placeholder-color: #333;
		--error-bg: #4b1c1f;
		--error-border: #8a1f2e;
		--error-text: #ffb3b3;

		/* 追加: ダークテーマ用リンクカラー */
		--link-color: #8ab4f8;
		--link-hover-color: #a3d0ff;
	}

	:host(.theme-light),
	:host(.light) {
		--bg-color: #fff;
		--text-color: #222;
		--border-color: #ddd;
		--name-color: #333;
		--time-color: #888;
		--placeholder-color: #e0e0e0;
		--error-bg: #f8d7da;
		--error-border: #f5c2c7;
		--error-text: #842029;

		/* ライトテーマ用リンクカラー */
		--link-color: #1a0dab;
		--link-hover-color: #551a8b;
	}

	.external-link {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		border: none;
		background: transparent;
		color: #007aff;
		text-decoration: none;
		cursor: pointer;
	}
	.external-link svg {
		width: 20px;
		height: 20px;
		stroke-width: 2;
	}
	.external-link:hover {
		background-color: rgba(0, 0, 0, 0.05);
		border-radius: 4px;
	}
</style>
