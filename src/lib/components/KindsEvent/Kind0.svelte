<script lang="ts">
	import type { Display, Status, UserProfile } from 'nostr-web-components/index.js';
	import Content from '../content/Content.svelte';

	import UserAvatar from '../Layout/UserAvatar.svelte';
	import ProfileLayout1 from '../Layout/ProfileLayout1.svelte';
	import ProfileLayoutCompact from '../Layout/ProfileLayoutCompact.svelte';
	import Link from '../content/Link.svelte';

	interface Props {
		profile: UserProfile | null;
		className: string;
		themeClass: string;
		noLink: boolean;
		height?: string | undefined;
		display: Display;
		linkUrl: string | undefined;
		target: string;

		status: Status;
	}

	let { profile, className, themeClass, noLink, height, display, linkUrl, target, status }: Props =
		$props();
</script>

{#if display === 'card'}
	<div class="nostr-wrapper">
		<ProfileLayout1
			class={`${className}`}
			{themeClass}
			{noLink}
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

			{#snippet name()}{profile?.display_name || ''}@{profile?.name || 'no name'}
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
		class={className}
		{themeClass}
		{noLink}
		showPlaceholders={status === 'loading' || !profile}
	>
		{#snippet avatar()}
			<UserAvatar src={profile?.picture} />
		{/snippet}

		{#snippet name()}
			{profile?.display_name || ''}@{profile?.name || 'no name'}
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
	{profile?.name || profile?.display_name || 'Unknown User'}<UserAvatar
		src={profile?.picture}
		size={20}
	/>
{:else}<Link {themeClass} href={linkUrl}
		>{profile?.name || profile?.display_name || 'Unknown User'}<UserAvatar
			src={profile?.picture}
			size={20}
		/></Link
	>{/if}
