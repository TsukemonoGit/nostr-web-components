<script lang="ts">
	import {
		encodeNaddr,
		encodeNpub,
		encodeToNevent,
		resolveUrl
	} from 'nostr-web-components/utils/urlUtils.js';
	import type { Display, Theme } from 'nostr-web-components/index.js';

	interface Props {
		tag: string[];
		href: string | null;
		themeClass: string;
		theme: Theme;
		display: Display;
	}

	let { tag, href, themeClass, theme, display }: Props = $props();
</script>

{#if tag[0] === 'e'}{@const nevent = encodeToNevent({ id: tag[1] })}<nostr-note
		{display}
		{theme}
		id={nevent}
	></nostr-note>
{:else if tag[0] === 'a'}
	<nostr-naddr {display} {theme} naddr={encodeNaddr(tag[1])}></nostr-naddr>
{:else if tag[0] === 'p'}
	{@const npub = encodeNpub(tag[1])}<nostr-profile display="name" {theme} user={npub}
	></nostr-profile>
	<!-- {:else if tag[0] === 't'}
	<HashtagTag {tag} />
    {:else if tag[0] === 'r'}
	<UrlTag {tag} />
{:else if tag[0] === 'relay'}
	<RelayTag {tag} />
{:else if tag[0] === 'emoji'}
	<EmojiTag {tag} />
{:else if tag[0] === 'image'}
	<ImageTag {tag} /> -->
{:else}
	{tag.toString()}
{/if}
