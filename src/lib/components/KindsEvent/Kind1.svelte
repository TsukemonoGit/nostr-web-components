<script lang="ts">
	import type { Display, Status, Theme, UserProfile } from 'nostr-web-components/types';
	import * as Nostr from 'nostr-typedef';
	import { encodeNpub, resolveUrl } from 'nostr-web-components/utils/urlUtils';
	import Content from '../content/Content.svelte';
	import NameDisplay from '../Layout/NameDisplay.svelte';
	import NoteLayout1 from '../Layout/NoteLayout1.svelte';
	import NoteLayoutCompact from '../Layout/NoteLayoutCompact.svelte';
	import UserAvatar from '../Layout/UserAvatar.svelte';

	interface Props {
		note: Nostr.Event | null;
		profile: UserProfile | null;
		className: string;
		themeClass: string;
		noLink: boolean;
		height: string | undefined;
		display: Display;
		linkUrl: string | undefined;
		target: string;
		href: string | null;
		theme: Theme;
		status: Status;
	}

	let {
		note,
		profile,
		className,
		themeClass,
		noLink,
		height,
		display,
		linkUrl,
		target,
		href,
		theme,
		status
	}: Props = $props();
</script>

{#if display === 'card'}
	<NoteLayout1
		class={className}
		{themeClass}
		{noLink}
		{height}
		showPlaceholders={status === 'loading' || !note}
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
					width="16"
					height="16"
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

		{#snippet avatar()}<UserAvatar src={profile?.picture} />{/snippet}
		{#snippet name()}
			{@const encodedNpub = note ? encodeNpub(note.pubkey) : undefined}
			{@const userUrl = encodedNpub
				? resolveUrl(href, encodedNpub, 'https://njump.me/{id}')
				: undefined}
			<NameDisplay
				{themeClass}
				href={userUrl}
				name={`${profile?.display_name || ''}@${profile?.name || 'no name'}`}
			/>{/snippet}
		{#snippet createdAt()}
			{#if note}<span class="timestamp">{new Date(note.created_at * 1000).toLocaleString()}</span
				>{/if}
		{/snippet}
		{#snippet replyUser()}
			{@const replyUserList = note?.tags
				?.filter((tag) => tag[0] === 'p' && typeof tag[1] === 'string')
				?.map((tag) => tag[1])}
			{#each replyUserList || [] as user}
				{@const npub = encodeNpub(user)}<nostr-profile display="name" {theme} user={npub}
				></nostr-profile>{/each}
		{/snippet}
		{#snippet content()}
			{#if note}<Content text={note.content} {display} {themeClass} {theme} tags={note.tags} />{/if}
		{/snippet}
		{#snippet error()}<span>Error: {error}</span>{/snippet}
	</NoteLayout1>
{:else if display === 'compact'}
	<NoteLayoutCompact
		class={className}
		{themeClass}
		{noLink}
		{height}
		showPlaceholders={status === 'loading' || !note}
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
					width="16"
					height="16"
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

		{#snippet avatar()}<UserAvatar src={profile?.picture} />{/snippet}
		{#snippet name()}
			{@const encodedNpub = note ? encodeNpub(note.pubkey) : undefined}
			{@const userUrl = encodedNpub
				? resolveUrl(href, encodedNpub, 'https://njump.me/{id}')
				: undefined}
			<NameDisplay
				{themeClass}
				href={userUrl}
				name={`${profile?.display_name || ''}@${profile?.name || 'no name'}`}
			/>{/snippet}
		{#snippet createdAt()}
			{#if note}<span class="timestamp">{new Date(note.created_at * 1000).toLocaleString()}</span
				>{/if}
		{/snippet}
		{#snippet replyUser()}
			{@const replyUserList = note?.tags
				?.filter((tag) => tag[0] === 'p' && typeof tag[1] === 'string')
				?.map((tag) => tag[1])}
			{#each replyUserList || [] as user}
				{@const npub = encodeNpub(user)}<nostr-profile display="name" {theme} user={npub}
				></nostr-profile>{/each}
		{/snippet}
		{#snippet content()}
			{#if note}<Content text={note.content} {display} {themeClass} {theme} tags={note.tags} />{/if}
		{/snippet}
		{#snippet error()}<span>Error: {error}</span>{/snippet}
	</NoteLayoutCompact>
{/if}

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
