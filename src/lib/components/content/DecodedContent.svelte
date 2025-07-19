<script lang="ts">
	//@ts-ignore
	import { type Token } from '@konemono/nostr-content-parser';
	import { nip19 } from 'nostr-tools';
	import Link from './Link.svelte';
	import type { Display } from 'nostr-web-components/types/index.js';

	interface Props {
		decoded: nip19.DecodedResult;
		theme: string | undefined;
		part: Token;
		themeClass: string | undefined;
		display: Display;
	}

	let { decoded, themeClass, theme, part, display }: Props = $props();
</script>

<div class="decoded">
	{#if decoded.type === 'npub' || decoded.type === 'nprofile'}<nostr-profile
			display="name"
			user={part.metadata.plainNip19}
			{theme}
		></nostr-profile>{:else if decoded.type === 'nevent' || decoded.type === 'note'}
		<nostr-note {display} id={part.metadata.plainNip19} {theme}></nostr-note>
	{:else if decoded.type === 'naddr'}
		<Link {themeClass} href={`https://njump.me/${part.content}`}>{part.content}</Link>
	{:else if decoded.type === 'nsec'}
		<Link {themeClass} href={`https://njump.me/${part.content}`}>{part.content}</Link>
	{/if}
</div>

<style>
	.decoded {
		width: fit-content;
		display: inline-block;
	}
</style>
