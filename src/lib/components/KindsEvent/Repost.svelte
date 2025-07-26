<script lang="ts">
	import * as Nostr from 'nostr-typedef';

	import {
		createTruncatedNpub,
		encodeNpub,
		encodeToNevent,
		resolveUrl
	} from 'nostr-web-components/utils/urlUtils.js';

	import NameDisplay from 'nostr-web-components/components/Layout/NameDisplay.svelte';
	import UserAvatar from 'nostr-web-components/components/Layout/UserAvatar.svelte';
	import { repostedId } from 'nostr-web-components/utils/utils.js';
	import Note from 'nostr-web-components/components/Data/Note.svelte';
	import Profile from '../Data/Profile.svelte';
	import NoteEventRenderer from './NoteEventRenderer.svelte';
	import type { Display, Theme, UserProfile } from 'nostr-web-components/index.js';
	import ReactionDisplay from '../Layout/ReactionDisplay.svelte';

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

	let encodedNpub = $derived(note ? encodeNpub(note.pubkey) : undefined);
	let userUrl = $derived(
		encodedNpub ? resolveUrl(href, encodedNpub, 'https://njump.me/{id}') : undefined
	);
	let truncatedNpub = $derived(createTruncatedNpub(encodedNpub));
</script>

<Note id={repoId.tag?.[1]} {relays} let:note={repostedNote} let:status={repostStatus}>
	<Profile
		pubkey={repostedNote?.pubkey}
		{relays}
		let:profile={repostedMetadata}
		let:status={repoStatus}
	>
		{@const repostUrl = repostedNote
			? resolveUrl(
					href,
					encodeToNevent({
						id: repostedNote.id,
						kind: repostedNote.kind,
						author: repostedNote.pubkey
					}),
					'https://njump.me/{id}'
				)
			: undefined}
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
				<span class="repost-indicator">
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M17 1l4 4-4 4" />
						<path d="M3 11V9a4 4 0 0 1 4-4h14" />
						<path d="M7 23l-4-4 4-4" />
						<path d="M21 13v2a4 4 0 0 1-4 4H3" />
					</svg>
				</span>

				<UserAvatar src={profile?.picture} size={20} />
				{#if profile}
					<NameDisplay
						{themeClass}
						href={userUrl}
						name={`${profile?.display_name || ''}@${profile?.name || 'no name'}`}
					/>{:else}
					{truncatedNpub}
				{/if}
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
							linkUrl={repostUrl}
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
	</Profile>
</Note>

<style>
	.repost-indicator {
		display: flex;
		align-items: center;
		gap: 4px;
		font-size: 0.875rem;
		color: var(--text-color);
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
