<script lang="ts">
	//@ts-ignore
	import { parseContent, TokenType, type Token } from '@konemono/nostr-content-parser';
	import * as nip19 from 'nostr-tools/nip19';

	import CustomEmoji from './CustomEmoji.svelte';

	import { getWarningTag, parseNaddr } from 'nostr-web-components/utils/utils.js';
	import Link from './Link.svelte';
	import DecodedContent from './DecodedContent.svelte';
	import Image from './Image.svelte';
	import Video from './Video.svelte';
	import Audio from './Video.svelte';
	import type { Display } from 'nostr-web-components/types/index.js';
	import WarningBlur from './WarningBlur.svelte';

	interface Props {
		text: string;
		tags: string[][];
		themeClass?: string;
		theme?: string;
		display: Display;
	}

	let { text, tags, themeClass, theme, display }: Props = $props();

	let parts: Token[] = $derived(parseContent(text, tags));

	let warningTag = $derived(getWarningTag(tags));
	const nip19Decode = (content: string | undefined): nip19.DecodedResult | undefined => {
		if (content === undefined) {
			return undefined;
		}
		// console.log(content);
		try {
			const decoded = nip19.decode(content);
			if (decoded.type === 'naddr') {
				return {
					type: decoded.type,
					data: decoded.data as nip19.AddressPointer
				};
			} else if (decoded.type === 'nevent') {
				return { type: decoded.type, data: decoded.data as nip19.EventPointer };
			} else if (decoded.type === 'nprofile') {
				return {
					type: decoded.type,
					data: decoded.data as nip19.ProfilePointer
				};
			} else if (decoded.type === 'nsec') {
				return { type: decoded.type, data: decoded.data as Uint8Array };
			} else {
				return { type: decoded.type, data: decoded.data as string };
			}
		} catch (error) {
			return undefined;
		}
	};

	const arekore = (type: string, id: string): nip19.DecodedResult | undefined => {
		try {
			switch (type) {
				case 'a':
					return { type: 'naddr', data: parseNaddr(['a', id]) };

				case 'p':
					return { type: 'npub', data: id };
				case 'e':
					return { type: 'note', data: id };
			}
		} catch (error) {
			return undefined;
		}
	};
</script>

{#each parts as part}{#if part.type === 'nip19'}{@const decoded = nip19Decode(
			part.metadata!.plainNip19 as string
		)}{#if decoded}<DecodedContent
				{display}
				{decoded}
				{part}
				{theme}
				{themeClass}
			/>{:else}{part.content}{/if}
	{:else if part.type === TokenType.LEGACY_REFERENCE && part.metadata && part.metadata.tagType && part.metadata.referenceId}
		{@const decoded = arekore(part.metadata.tagType as string, part.metadata.referenceId as string)}
		{#if decoded}<Link {themeClass} href={`https://njump.me/${part.content}`}>{part.content}</Link>
		{:else}{part.content}{/if}
	{:else if part.type === 'url'}
		{#if part.metadata.type === 'image'}<Image
				src={part.content}
				{themeClass}
			/>{:else if part.metadata.type === 'video'}<Video
				src={part.content}
				{themeClass}
			/>{:else if part.metadata.type === 'audio'}
			<Audio src={part.content} {themeClass} />{:else}<Link {themeClass} href={part.content}
				>{part.content}</Link
			>{/if}
	{:else if part.type === TokenType.CUSTOM_EMOJI}<CustomEmoji
			{part}
		/>{:else}{part.content}{/if}{/each}

{#if warningTag !== undefined}
	<WarningBlur text={warningTag[1] || ''} />
{/if}
