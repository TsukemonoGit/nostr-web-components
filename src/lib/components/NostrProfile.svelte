<svelte:options customElement="nostr-profile" accessors={true} />

<script lang="ts">
	import type { Display, Theme } from 'nostr-web-components/index.js';
	import { resolveUrl } from 'nostr-web-components/utils/urlUtils.js';

	import ProfileLayout1 from './Layout/ProfileLayout1.svelte';
	import Content from './content/Content.svelte';
	import Link from './content/Link.svelte';
	import UserAvatar from './Layout/UserAvatar.svelte';
	import { connected } from 'nostr-web-components/core/connected.js';
	import ProfileLayoutCompact from './Layout/ProfileLayoutCompact.svelte';
	import Profile from './Data/Profile.svelte';
	import { resolveToPubkey } from 'nostr-web-components/utils/utils';

	//export let id: string = '';
	// Nostrの識別子（npub1~、nevent1~、またはNIP-05アドレス）
	export let user: string = '';
	export let relays: string[] = [];
	export let href: string | null = null;
	export let target: string = '_blank';
	export let noLink: boolean = false;
	export let display: Display = 'card';
	export let className: string = '';
	export let theme: Theme = 'auto';

	let mounted = false;

	let themeClass = '';
	$: themeClass = theme === 'dark' ? 'theme-dark' : theme === 'light' ? 'theme-light' : '';

	// 接続時の初期化処理（onMountの代替）
	function initialize() {
		if (mounted || !user) return;
		mounted = true;
	}

	let linkUrl: string | undefined = undefined;
	$: linkUrl = resolveUrl(href, user, 'https://njump.me/{id}');
</script>

<div use:connected={initialize} class="profile {themeClass} {className}">
	{#await resolveToPubkey(user) then pubkey}
		<Profile pubkey={pubkey || undefined} {relays} let:profile let:status>
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
				>{/if}</Profile
		>{/await}
</div>

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

		--external-link-color: #1a0dabb7;
		--external-link-hover-color: #541a8bb4;
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

		--external-link-color: #8ab4f8c4;
		--external-link-hover-color: #a3cfffd2;
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

		--external-link-color: #1a0dabb7;
		--external-link-hover-color: #541a8bb4;
	}

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
	.profile {
		width: fit-content;
	}
</style>
