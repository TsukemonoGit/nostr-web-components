<script lang="ts">
	//@ts-ignore
	import { type Token } from '@konemono/nostr-content-parser';
	import { nip19 } from 'nostr-tools';
	import Link from './Link.svelte';

	interface Props {
		decoded: nip19.DecodedResult;
		theme: string | undefined;
		part: Token;
		themeClass: string | undefined;
	}

	let { decoded, themeClass, theme, part }: Props = $props();
</script>

{#if decoded.type === 'npub' || decoded.type === 'nprofile'}<nostr-profile
		display="name"
		id={decoded.type === 'npub' ? decoded.data : decoded.data.pubkey}
		{theme}
	></nostr-profile>{:else if decoded.type === 'nevent' || decoded.type === 'note'}
	<nostr-note id={decoded.type === 'note' ? decoded.data : decoded.data.author} {theme}
	></nostr-note>
{:else if decoded.type === 'naddr'}
	<Link {themeClass} href={`https://njump.me/${part.content}`}>{part.content}</Link>
{:else if decoded.type === 'nsec'}
	<Link {themeClass} href={`https://njump.me/${part.content}`}>{part.content}</Link>
{/if}
