<!-- svelte-ignore options_missing_custom_element -->
<svelte:options customElement="nostr-profile" />

<script lang="ts">
	import { onMount, tick } from 'svelte';
	import type { UserProfile } from 'nostr-web-components/types/index.ts';
	import { ensureClient } from 'nostr-web-components/utils/ensureClient.js';
	import { resolveUrl } from 'nostr-web-components/utils/urlUtils.js';
	import ProfileLayout1 from './Layout/ProfileLayout1.svelte';
	import Content from './content/Content.svelte';
	import Link from './content/Link.svelte';
	import UserAvatar from './Layout/UserAvatar.svelte';

	export let id: string = ''; // npub
	export let relays: string[] = [];
	export let href: string | null = null;
	export let target: string = '_blank';
	export let noLink: boolean = false;
	export let display: 'card' | 'compact' | 'name' = 'card';
	export let className: string = '';
	export let theme: 'light' | 'dark' | 'auto' = 'auto';

	$: themeClass = theme === 'dark' ? 'theme-dark' : theme === 'light' ? 'theme-light' : '';

	let loading = false;
	let profile: UserProfile | null = null;
	let error: string | null = null;
	let mounted = false;

	async function loadProfile() {
		if (loading || !id || !mounted) {
			if (!id) {
				error = 'Profile ID is required';
			}
			return;
		}

		loading = true;
		error = null;

		try {
			const client = await ensureClient(relays);
			if (!client) {
				error = 'Nostr client not available';
				loading = false;
				return;
			}

			//	console.log('Loading profile for:', id);
			profile = await client.fetchProfile(id, relays);
			if (!profile) {
				error = 'Profile not found';
			}
			//console.log('Profile loaded:', profile);
		} catch (e: any) {
			error = e.message || 'Error loading profile';
		} finally {
			loading = false;
		}
	}

	// カスタム要素のマウント処理
	onMount(async () => {
		// カスタム要素の場合、次のティックまで待機
		await tick();
		mounted = true;

		// マウント後にIDが存在する場合はloadProfileを実行
		if (id) {
			loadProfile();
		}
	});

	// IDが変更された場合の処理（マウント後のみ）
	$: if (mounted && id) {
		loadProfile();
	}

	// 動的URLを生成
	$: linkUrl = resolveUrl(href, id, 'https://njump.me/{id}');
</script>

<!-- デバッグ用表示
{#if mounted}
	<div style="font-size: 12px; color: #666; margin-bottom: 8px;">
		ID: {id} | Loading: {loading} | Error: {error} | Profile: {profile ? 'loaded' : 'null'}
	</div>
{/if}
 -->
{#if mounted}
	{#if display === 'card'}
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
	{:else if display === 'compact'}
		<!---->
	{:else if noLink}
		<span>@{profile?.name || profile?.display_name || 'Unknown User'}</span>
	{:else}
		<Link {themeClass} href={linkUrl}
			>@{profile?.name || profile?.display_name || 'Unknown User'}</Link
		>
	{/if}
{:else}
	<div>Initializing...</div>
{/if}

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
		margin: 10px 0;
		background-color: var(--bg-color);
		color: var(--text-color);
		font-family: sans-serif;
		position: relative;
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
