<script lang="ts">
	import {
		encodeNaddr,
		encodeNpub,
		encodeToNevent,
		resolveUrl
	} from 'nostr-web-components/utils/urlUtils.js';
	import type { Display, Theme } from 'nostr-web-components/index.js';
	import Link from '../content/Link.svelte';
	import CustomEmoji from '../content/CustomEmoji.svelte';
	import Relay from '../content/Relay.svelte';

	interface Props {
		tag: string[];
		href: string | null;
		themeClass: string;
		theme: Theme;
		display: Display;
	}

	let { tag, href, themeClass, theme, display }: Props = $props();
</script>

{#if tag[0] === 'e'}{@const nevent = encodeToNevent({ id: tag[1] })}{#if nevent}<nostr-note
			{display}
			{theme}
			id={nevent}
		></nostr-note>{/if}
{:else if tag[0] === 'a'}
	{@const naddr = encodeNaddr(tag[1])}{#if naddr}
		<nostr-naddr {display} {theme} {naddr}></nostr-naddr>{/if}
{:else if tag[0] === 'p'}
	{@const npub = encodeNpub(tag[1])}{#if npub}<div class="container">
			<nostr-profile display="name" {theme} user={npub}></nostr-profile>
		</div>{/if}
{:else if tag[0] === 't'}
	hashtag: {tag[1]}
{:else if tag[0] === 'r'}
	{#if tag[1].startsWith('ws')}
		<Relay {tag} />
	{:else}
		<Link {themeClass} href={tag[1]}>{tag[2] || tag[1]}</Link>{/if}
{:else if tag[0] === 'relay'}
	relay {tag[1]}
{:else if tag[0] === 'emoji'}
	<CustomEmoji part={{ content: tag[1], metadata: { url: tag[2] } }} />
{:else}
	{tag.toString()}
{/if}

<style>
	.container {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
		padding: 4px 8px;
		border: 1px solid var(--border-color);
		border-radius: 4px;
		font-size: 0.9em;
	}
</style>
