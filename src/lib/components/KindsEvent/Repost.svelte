<script lang="ts">
	import * as Nostr from 'nostr-typedef';

	import { encodeNpub, resolveUrl } from 'nostr-web-components/utils/urlUtils.js';
	import type { Display, Theme, UserProfile } from 'nostr-web-components/types/index.ts';

	import NameDisplay from 'nostr-web-components/components/Layout/NameDisplay.svelte';
	import UserAvatar from 'nostr-web-components/components/Layout/UserAvatar.svelte';
	import { repostedId } from 'nostr-web-components/utils/utils';
	import Note from 'nostr-web-components/components/Data/Note.svelte';
	import Profile from '../Data/Profile.svelte';
	import NoteEventRenderer from './NoteEventRenderer.svelte';

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
		className: string;
	}

	let {
		note,
		class: className = '',
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

<div class="repost-container {themeClass} {className}">
	{#if !repoId || !repoId.tag}
		<div class="error-container">
			<span class="error-text">Error: Invalid repost tag</span>
		</div>
	{:else}
		<Note id={repoId.tag[1]} {relays} let:note={repostedNote} let:status={repostStatus}>
			<Profile
				pubkey={repostedNote?.pubkey}
				{relays}
				let:profile={repostedMetadata}
				let:status={repoStatus}
			>
				{@const encodedRepostNpub = repostedNote ? encodeNpub(repostedNote.pubkey) : ''}
				{@const userRepostUrl = resolveUrl(href, encodedRepostNpub, 'https://njump.me/{id}')}
				<div class="repost-header">
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
					</span><UserAvatar src={profile?.picture} size={20} />

					<NameDisplay
						{themeClass}
						href={userRepostUrl}
						name={`${profile?.display_name || ''}@${profile?.name || 'no name'}`}
					/>

					{#if !noLink}
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
					{/if}
				</div>

				<NoteEventRenderer
					note={repostedNote}
					profile={repostedMetadata}
					{themeClass}
					{height}
					{noLink}
					{linkUrl}
					{display}
					{className}
					{target}
					{href}
					{theme}
				/>
			</Profile>
		</Note>
	{/if}
</div>

<style>
	.repost-container {
		border: 1px solid var(--border-color);
		border-radius: 8px;
		padding: 6px;
		background-color: var(--bg-color);
		color: var(--text-color);
		position: relative;
	}

	.repost-header {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 2px;
		padding-bottom: 8px;
		font-size: smaller;
	}

	.repost-indicator {
		display: flex;
		align-items: center;
		gap: 4px;
		font-size: 0.875rem;
		color: var(--text-color);
		opacity: 0.7;
	}

	.timestamp {
		font-size: 0.75rem;
		color: var(--text-color);
		opacity: 0.6;
	}

	.reposted-content {
		border: 1px solid var(--border-color);
		border-radius: 6px;
		padding: 12px;
		background-color: var(--bg-color);
		opacity: 0.95;
	}

	.original-note-header {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 8px;
	}

	.original-author-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.original-timestamp {
		font-size: 0.75rem;
		color: var(--text-color);
		opacity: 0.6;
	}

	.original-content {
		margin-top: 8px;
	}

	.external-link {
		position: absolute;
		top: 0;
		right: 0;
		overflow: visible;
		text-decoration: none;
		color: var(--external-link-color);
		opacity: 0.8;
		transition: opacity 0.2s;
	}

	.external-link:hover {
		opacity: 1;
	}

	/* プレースホルダー */
	.repost-placeholder {
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	.avatar-placeholder {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background-color: var(--border-color);
	}

	.name-placeholder {
		width: 120px;
		height: 16px;
		border-radius: 4px;
		background-color: var(--border-color);
	}

	.line-placeholder {
		width: 100%;
		height: 16px;
		border-radius: 4px;
		background-color: var(--border-color);
		margin-bottom: 8px;
	}

	.line-placeholder.short {
		width: 70%;
	}

	.reposted-content-placeholder {
		margin-top: 12px;
		padding: 12px;
		border: 1px solid var(--border-color);
		border-radius: 6px;
	}

	.error-container {
		padding: 12px;
		background-color: var(--error-bg);
		border: 1px solid var(--error-border);
		border-radius: 6px;
		color: var(--error-text);
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}
</style>
