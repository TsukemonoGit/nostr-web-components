<script lang="ts">
	//@ts-ignore
	import type { Token } from '@konemono/nostr-content-parser';

	interface Props {
		part: Token;
		height?: number;
	}

	let { part, height = 24 }: Props = $props();
	let imgError: boolean = $state(false);
	let imgLoad: boolean = $state(false);
</script>

{#if part.metadata && part.metadata.url && !imgError}{#if !imgLoad}{part.content}{/if}<img
		height={`${height}px`}
		loading="lazy"
		alt={`${part.content}`}
		src={part.metadata!.url as string}
		title={`${part.content}`}
		class={`custom-emoji`}
		style={`height:${height}px`}
		onload={() => {
			imgLoad = true;
		}}
		onerror={() => {
			imgError = true;
		}}
	/>{:else}{part.content}{/if}

<style>
	.custom-emoji {
		margin: 0;
		display: inline;
		overflow: hidden;
		object-fit: cover;
		vertical-align: bottom;
	}
</style>
