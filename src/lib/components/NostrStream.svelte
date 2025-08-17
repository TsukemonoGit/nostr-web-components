<!--NostrStream.svelte-->
<svelte:options customElement="nostr-stream" accessors={true} />

<script lang="ts">
	import 'nostr-web-components/style.css';
	import { encodeEventToNevent, resolveUrl } from 'nostr-web-components/utils/urlUtils.js';
	import { connected } from 'nostr-web-components/core/connected.js';
	import NoteEventRenderer from './KindsEvent/NoteEventRenderer.svelte';

	import Profile from './Data/Profile.svelte';

	import type { Display, Status, Theme } from 'nostr-web-components/index.js';

	import type { Subscription } from 'rxjs';

	import { ensureClient } from 'nostr-web-components/utils/ensureClient.js';
	import * as Nostr from 'nostr-typedef';

	export let filters: string = '[]';
	export let relays: string[] | string = [];
	export let href: string | null = null;
	export let target: string = '_blank';
	export let noLink: boolean = false;
	export let theme: Theme = 'auto';
	export let height: string | undefined = undefined;
	export let display: Display = 'card';
	export let limit: any = 50;
	let relaysArray: string[] = [];
	// propsからリレー配列に変換
	$: {
		try {
			if (typeof relays === 'string') {
				relaysArray = JSON.parse(relays);
			} else if (Array.isArray(relays)) {
				relaysArray = relays;
			} else {
				relaysArray = [];
			}
		} catch {
			relaysArray = [];
		}
	}
	// 変換された数値を格納する変数
	let parsedLimit = 50;
	$: {
		try {
			const n = Number(limit);
			parsedLimit = Number.isFinite(n) && n > 0 ? Math.floor(n) : 50;
		} catch {
			parsedLimit = 50;
		}
	}
	let themeClass = '';
	$: {
		if (theme === 'auto') {
			const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
			themeClass = prefersDark ? 'theme-dark' : 'theme-light';
		} else {
			themeClass = theme === 'dark' ? 'theme-dark' : 'theme-light';
		}
	}
	let error: string;
	let mounted = false;
	let sub: Subscription;
	let status: Status = 'init';
	let events: Nostr.Event[] = [];
	async function initialize() {
		if (mounted || !filters) return;
		mounted = true;

		//まずstatusリセット
		status = 'loading';
		let parsedFilters: Nostr.Filter[];
		try {
			const f = JSON.parse(filters);
			if (!Array.isArray(f)) throw new Error('filters must be an array');

			parsedFilters = f.map((filter) => ({
				...filter,
				limit: filter.limit ?? parsedLimit
			}));
		} catch (err: any) {
			error = `Invalid filters: ${err.message}`;
			status = 'error';
			return;
		}

		try {
			const client = await ensureClient(relaysArray);
			// console.log('[nostr-note] Client obtained:', client);

			if (!client) {
				status = 'error';
				console.error('[nostr-stream] Client is null');
				return;
			}
			const { rxReq, events: evs } = client.createUpstream(parsedLimit, relaysArray);

			sub = evs.subscribe((e) => {
				//	console.log(e);
				events = e;
				status = 'success';
			});

			//サブスクライブしてからフィルター設定する
			rxReq.emit(parsedFilters);
		} catch (e: any) {
			status = 'error';
			console.error('[nostr-note] Exception:', e);
		} finally {
			//console.log('[nostr-note] loading complete');
		}
	}
</script>

<div use:connected={initialize} class="nostr-wrapper {themeClass}">
	{#if status === 'loading'}
		<div class="loading">Loading events...</div>
	{:else if status === 'error'}
		<div class="error">Error: {error}</div>
	{:else if events.length === 0}
		<div class="empty">No events found</div>
	{:else}
		<div class="nostr-wrapper {themeClass} ">
			{#each events as note (note.id)}
				<Profile
					pubkey={note?.pubkey}
					relays={[...relaysArray, 'wss://directory.yabu.me']}
					let:profile
				>
					{@const nevent = encodeEventToNevent(note)}
					{@const linkUrl = nevent ? resolveUrl(href, nevent, 'https://njump.me/{id}') : undefined}
					<NoteEventRenderer
						{note}
						{profile}
						{themeClass}
						{height}
						{noLink}
						{linkUrl}
						{display}
						{target}
						{href}
						{theme}
						status={'success'}
					/></Profile
				>
			{/each}
		</div>
	{/if}
</div>

<style>
	:host {
		--bg-color: #fff;
		--text-color: #222;
		--border-color: #ddd;
		--error-bg: #f8d7da;
		--error-border: #f5c2c7;
		--error-text: #842029;
		--loading-color: #666;
		--empty-color: #888;
		/* 追加: リンクカラー */
		--link-color: #1a0dab;
		--link-hover-color: #551a8b;
		/* メンション用カラー */
		--mention-line-color: #3b82f6; /* 明るめ青 */
		--mention-bg-color: #e0f5ff; /* 薄い青系背景 */

		--external-link-color: #1a0dabb7;
		--external-link-hover-color: #541a8bb4;

		/* ページネーションアクティブ用カラー */
		--pagination-active-bg: #3b82f6;
		--pagination-active-text: #fff;
		--pagination-active-border: #3b82f6;
	}

	.theme-dark {
		--bg-color: #1e1e1e;
		--text-color: #ddd;
		--border-color: #444;
		--error-bg: #4b1c1f;
		--error-border: #8a1f2e;
		--error-text: #ffb3b3;
		--loading-color: #aaa;
		--empty-color: #999;

		/* ダークテーマ用メンションカラー */
		--mention-line-color: #60a5fa; /* 明るめ青で視認性良 */
		--mention-bg-color: #1e3a8a22; /* 透過感ある青背景 */
		/* 追加: ダークテーマ用リンクカラー */
		--link-color: #8ab4f8;
		--link-hover-color: #a3d0ff;

		--external-link-color: #8ab4f8c4;
		--external-link-hover-color: #a3cfffd2;

		--pagination-active-bg: #60a5fa;
		--pagination-active-text: #000;
		--pagination-active-border: #60a5fa;
	}

	.theme-light {
		--bg-color: #fff;
		--text-color: #222;
		--border-color: #ddd;
		--error-bg: #f8d7da;
		--error-border: #f5c2c7;
		--error-text: #842029;
		--loading-color: #666;
		--empty-color: #888;
		/* ライトテーマ用リンクカラー */
		--link-color: #1a0dab;
		--link-hover-color: #551a8b;
		/* ライトテーマ用メンションカラー */
		--mention-line-color: #3b82f6;
		--mention-bg-color: #e0f5ff;

		--external-link-color: #1a0dabb7;
		--external-link-hover-color: #541a8bb4;
		--pagination-active-bg: #3b82f6;
		--pagination-active-text: #fff;
		--pagination-active-border: #3b82f6;
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
