<script lang="ts">
	import type { Display, Status, Theme, UserProfile } from 'nostr-web-components/index.js';
	import * as Nostr from 'nostr-typedef';
	import { encodeNpub, resolveUrl } from 'nostr-web-components/utils/urlUtils.js';
	import Content from '../content/Content.svelte';
	import NameDisplay from '../Layout/NameDisplay.svelte';
	import NoteLayout1 from '../Layout/NoteLayout1.svelte';
	import NoteLayoutCompact from '../Layout/NoteLayoutCompact.svelte';
	import UserAvatar from '../Layout/UserAvatar.svelte';
	import { getWarningTag } from 'nostr-web-components/utils/utils.js';

	interface Props {
		note: Nostr.Event | null;
		profile: UserProfile | null;

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
	<NoteLayout1 {themeClass} {noLink} {height} showPlaceholders={status === 'loading' || !note}>
		{#snippet link()}
			{#if !noLink && linkUrl}
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
				</a>{/if}
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
