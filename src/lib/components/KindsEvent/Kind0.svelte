<script lang="ts">
	import type { Display, Status, UserProfile } from 'nostr-web-components/index.js';
	import Content from '../content/Content.svelte';

	import UserAvatar from '../Layout/UserAvatar.svelte';
	import ProfileLayout1 from '../Layout/ProfileLayout1.svelte';
	import ProfileLayoutCompact from '../Layout/ProfileLayoutCompact.svelte';
	import Link from '../content/Link.svelte';
	import { createTruncatedNpub, encodeNpub } from 'nostr-web-components/utils/urlUtils.js';

	interface Props {
		pubkey: string | null;
		profile: UserProfile | null;

		themeClass: string;
		noLink: boolean;
		height?: string | undefined;
		display: Display;
		linkUrl: string | undefined;
		target: string;

		status: Status;
	}

	let { profile, themeClass, noLink, height, display, linkUrl, target, status, pubkey }: Props =
		$props();

	let pub = $derived(pubkey ? encodeNpub(pubkey) : undefined);
	let truncatedNpub = $derived(createTruncatedNpub(pub));
</script>

{#if display === 'card'}
	<div class="nostr-wrapper">
		<ProfileLayout1
			{themeClass}
			{noLink}
			{height}
			showPlaceholders={status === 'loading' || !profile}
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

			{#snippet avatar()}
				<UserAvatar src={profile?.picture} />
			{/snippet}

			{#snippet name()}{#if profile}{profile?.display_name || ''}@{profile?.name || 'no name'}
				{:else}
					{truncatedNpub}
				{/if}
			{/snippet}

			{#snippet about()}
				{#if profile}
					<Content {display} text={profile.about || ''} tags={profile.tags} />
				{/if}
			{/snippet}

			{#snippet error()}
				<span>Error: {error}</span>
			{/snippet}
		</ProfileLayout1>
	</div>
{:else if display === 'compact'}
	<ProfileLayoutCompact
		{themeClass}
		{noLink}
		{height}
		showPlaceholders={status === 'loading' || !profile}
	>
		{#snippet avatar()}
			<UserAvatar src={profile?.picture} />
		{/snippet}

		{#snippet name()}
			{#if profile}{profile?.display_name || ''}@{profile?.name || 'no name'}
			{:else}
				{truncatedNpub}
			{/if}
		{/snippet}

		{#snippet about()}
			{#if profile}
				<Content {display} text={profile.about || ''} tags={profile.tags} />
			{/if}
		{/snippet}

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
	</ProfileLayoutCompact>
{:else if noLink}
	{profile?.name || profile?.display_name || truncatedNpub}<UserAvatar
		src={profile?.picture}
		size={20}
	/>
{:else}<Link {themeClass} href={linkUrl}
		>{profile?.name || profile?.display_name || truncatedNpub}<UserAvatar
			src={profile?.picture}
			size={20}
		/></Link
	>{/if}

<style>
	.nostr-wrapper {
		border: 1px solid var(--border-color);
		border-radius: 6px;
		padding: 6px;
		background-color: var(--bg-color);
		color: var(--text-color);
		font-family: sans-serif;
		position: relative;
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
