<svelte:options customElement="nostr-note" accessors={true} />

<script lang="ts">
	import 'nostr-web-components/style.css';
	import { resolveUrl } from 'nostr-web-components/utils/urlUtils.js';

	import { connected } from 'nostr-web-components/core/connected.js'; // initialize呼び出し用アクション

	import Note from './Nostr/Note.svelte';
	import Metadata from './Nostr/Metadata.svelte';
	import EventDisplay from './Kind/EventDisplay.svelte';
	import { Display, Theme } from 'nostr-web-components/types';
	import RepostDisplay from './Kind/RepostDisplay.svelte';
	import EventDisplayByKind from './Kind/EventDisplayByKind.svelte';

	interface Props {
		id: string;
		relays: string[];
		href: string | null;
		target: string;
		noLink: boolean;
		className: string;
		theme: Theme;
		height: string | undefined;
		display: Display;
	}
	let {
		id = '',
		relays = [],
		href = null,
		target = '_blank',
		noLink = false,
		className = '',
		theme = 'auto',
		height = undefined,
		display = 'card'
	}: Props = $props();

	let themeClass = $derived(
		theme === 'dark' ? 'theme-dark' : theme === 'light' ? 'theme-light' : ''
	);

	let mounted = $state(false);

	let linkUrl = $derived(resolveUrl(href, id, 'https://njump.me/{id}'));

	function initialize() {
		if (mounted || !id) {
			console.warn('[nostr-note] Skipping initialize: mounted =', mounted, ', id =', id);
			return;
		}
		mounted = true;
	}
</script>

<!-- Web Components として mount 時に initialize() を実行 -->
<div use:connected={initialize} class="nostr-wrapper {themeClass} {className}">
	{#if mounted}
		<Note {id} {relays}>
			{#snippet children({ note, status })}
				<Metadata pubkey={note?.pubkey} {relays}>
					{#snippet children({ profile, status: metaStatus })}
						<EventDisplayByKind
							{note}
							{profile}
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
					{/snippet}</Metadata
				>{/snippet}
		</Note>
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
