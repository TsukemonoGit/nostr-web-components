<script lang="ts">
	import Link from './Link.svelte';

	interface Props {
		src: string;
		themeClass?: string | undefined;
	}

	let { src, themeClass }: Props = $props();
	let isError = $state(false);
</script>

{#if !isError}
	<img loading="lazy" {src} alt={src} onerror={() => (isError = true)} />
{:else}
	<Link {themeClass} href={src}>{src}</Link>
{/if}

<style>
	img {
		display: inline-flex;
		max-width: 100%;
		object-fit: contain;
		max-height: 10rem;
	}
</style>
