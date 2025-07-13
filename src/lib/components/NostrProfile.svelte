<svelte:options customElement="nostr-profile" accessors={true} />

<script lang="ts">
	import type { UserProfile } from 'nostr-web-components/types/index.ts';
	import { ensureClient } from 'nostr-web-components/utils/ensureClient.js';
	import { resolveUrl } from 'nostr-web-components/utils/urlUtils.js';

	import ProfileLayout1 from './Layout/ProfileLayout1.svelte';
	import Content from './content/Content.svelte';
	import Link from './content/Link.svelte';
	import UserAvatar from './Layout/UserAvatar.svelte';
	import { connected } from 'nostr-web-components/core/connected.js';

	export let id: string = '';
	export let relays: string[] = [];
	export let href: string | null = null;
	export let target: string = '_blank';
	export let noLink: boolean = false;
	export let display: 'card' /*  | 'compact' */ | 'name' = 'card';
	export let className: string = '';
	export let theme: 'light' | 'dark' | 'auto' = 'auto';

	let loading = false;
	let profile: UserProfile | null = null;
	let error: string | null = null;

	let mounted = false;

	let themeClass = '';
	$: themeClass = theme === 'dark' ? 'theme-dark' : theme === 'light' ? 'theme-light' : '';

	// 接続時の初期化処理（onMountの代替）
	function initialize() {
		if (mounted || !id) return;
		mounted = true;
		loadProfile();
	}

	// IDが変化したときにも再読込
	$: if (mounted && id) {
		loadProfile();
	}

	async function loadProfile() {
		if (loading || !id) return;

		loading = true;
		error = null;

		try {
			const client = await ensureClient(relays);
			profile = await client.fetchProfile(id, relays);
			if (!profile) {
				error = 'Profile not found';
			}
		} catch (e: any) {
			error = e?.message || 'Error loading profile';
		} finally {
			loading = false;
		}
	}

	let linkUrl: string | null = null;
	$: linkUrl = resolveUrl(href, id, 'https://njump.me/{id}');
</script>

<div use:connected={initialize} class="profile {themeClass} {className}">
	{#if display === 'card'}
		<div class="nostr-wrapper">
			<ProfileLayout1
				class={`${className}`}
				{themeClass}
				{noLink}
				showPlaceholders={loading || !profile}
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

				{#snippet avatar()}
					<UserAvatar src={profile?.picture} />
				{/snippet}

				{#snippet name()}
					{#if profile?.name}
						<span class="username">{profile.name}</span>
					{/if}
				{/snippet}

				{#snippet about()}
					{#if profile}
						<Content text={profile.about || ''} tags={profile.tags} />
					{/if}
				{/snippet}

				{#snippet error()}
					<span>Error: {error}</span>
				{/snippet}
			</ProfileLayout1>
		</div>
		<!--{:else if display === 'compact'}
		-->
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

	.nostr-wrapper {
		border: 1px solid var(--border-color);
		border-radius: 6px;
		padding: 12px;
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
		color: var(--link-color);
	}
	.external-link:hover {
		color: var(--link-hover-color);
	}
	.profile {
		width: fit-content;
	}
</style>
