<script lang="ts">
	import * as Nostr from 'nostr-typedef';

	import { encodeNpub, resolveUrl } from 'nostr-web-components/utils/urlUtils.js';

	import NameDisplay from 'nostr-web-components/components/Layout/NameDisplay.svelte';
	import UserAvatar from 'nostr-web-components/components/Layout/UserAvatar.svelte';
	import { repostedId } from 'nostr-web-components/utils/utils.js';
	import Note from 'nostr-web-components/components/Data/Note.svelte';
	import Profile from '../Data/Profile.svelte';
	import NoteEventRenderer from './NoteEventRenderer.svelte';
	import type { Display, Theme, UserProfile } from 'nostr-web-components/index.js';
	import ReactionDisplay from '../Layout/ReactionDisplay.svelte';
	import ReactionIcon from './ReactionIcon.svelte';

	interface Props {
		note: Nostr.Event | null;
		profile: UserProfile | null;
		class?: string;
		themeClass?: string;
		noLink?: boolean;
		height?: string;
		relays?: string[];
		href?: string | null;
		target?: string;
		theme?: Theme;
		linkUrl: string | undefined;
		display: Display;
	}

	let {
		note,

		themeClass = '',
		noLink = false,
		height,
		relays = [],
		href = null,
		target = '_blank',
		theme = 'auto',
		profile,
		linkUrl,
		display
	}: Props = $props();

	let repoId: {
		tag: string[] | undefined;
		kind: number | undefined;
	} = $derived(note ? repostedId(note.tags) : { tag: undefined, kind: undefined });
</script>

<ReactionDisplay {themeClass} {noLink} hasError={!repoId || !repoId.tag}>
	{#snippet error()}
		<span class="error-text">Error: Invalid repost tag</span>
	{/snippet}

	{#snippet link()}
		<!-- svelte-ignore a11y_consider_explicit_label -->
		<a
			href={linkUrl}
			{target}
			referrerpolicy="no-referrer"
			class="external-link"
			title="Open repost in new tab"
		>
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<path d="M15 3h6v6" />
				<path d="M10 14 21 3" />
				<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
			</svg>
		</a>
	{/snippet}

	{#snippet header()}
		<Note id={repoId.tag?.[1]} {relays} let:note={repostedNote} let:status={repostStatus}>
			<Profile
				pubkey={repostedNote?.pubkey}
				{relays}
				let:profile={repostedMetadata}
				let:status={repoStatus}
			>
				{@const encodedRepostNpub = repostedNote ? encodeNpub(repostedNote.pubkey) : ''}
				{@const userRepostUrl = resolveUrl(href, encodedRepostNpub, 'https://njump.me/{id}')}
				{#if note}
					<span class="repost-indicator">
						<ReactionIcon event={note} />
					</span>{/if}

				<UserAvatar src={profile?.picture} size={20} />

				<NameDisplay
					{themeClass}
					href={userRepostUrl}
					name={`${profile?.display_name || ''}@${profile?.name || 'no name'}`}
				/>
			</Profile>
		</Note>
	{/snippet}

	{#snippet content()}
		<Note id={repoId.tag?.[1]} {relays} let:note={repostedNote} let:status={repostStatus}>
			<Profile
				pubkey={repostedNote?.pubkey}
				{relays}
				let:profile={repostedMetadata}
				let:status={repoStatus}
			>
				<NoteEventRenderer
					note={repostedNote}
					profile={repostedMetadata}
					{themeClass}
					{height}
					{noLink}
					{linkUrl}
					{display}
					{target}
					{href}
					{theme}
					status={repostStatus}
				/>
			</Profile>
		</Note>
	{/snippet}
</ReactionDisplay>

<style>
	.repost-indicator {
		display: flex;
		align-items: center;
		gap: 4px;
		font-size: 0.875rem;
		color: var(--text-color);
		opacity: 0.7;
	}

	.external-link {
		text-decoration: none;
		color: var(--external-link-color);
		opacity: 0.8;
		transition: opacity 0.2s;
	}

	.external-link:hover {
		opacity: 1;
	}
</style>
