<svelte:options customElement="nostr-profile" accessors={true} />

<script lang="ts">
	import type { Display, Theme } from 'nostr-web-components/index.js';
	import { resolveUrl } from 'nostr-web-components/utils/urlUtils.js';

	import { connected } from 'nostr-web-components/core/connected.js';

	import Profile from './Data/Profile.svelte';
	import { resolveToPubkey } from 'nostr-web-components/utils/utils.js';
	import Kind0 from './KindsEvent/Kind0.svelte';

	//export let id: string = '';
	// Nostrの識別子（npub1~、nevent1~、またはNIP-05アドレス）
	export let user: string = '';
	export let relays: string[] = [];
	export let href: string | null = null;
	export let target: string = '_blank';
	export let noLink: boolean = false;
	export let display: Display = 'card';
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

<div use:connected={initialize} class=" {themeClass}">
	{#await resolveToPubkey(user) then pubkey}
		<Profile pubkey={pubkey || undefined} {relays} let:profile let:status>
			<Kind0 {profile} {themeClass} {noLink} {linkUrl} {display} {target} {status} /></Profile
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
