<script lang="ts">
	import 'nostr-web-components/style.css';
	let { src, size = 48 }: { src: string | undefined; size?: number } = $props();
</script>

{#if src}
	<img
		{src}
		alt="avatar"
		class="avatar-img"
		style="width: {size}px; height: {size}px; vertical-align:bottom"
	/>
{:else}
	<div class="placeholder avatar" style="width: {size}px; height: {size}px;"></div>
{/if}

<style>
	.placeholder {
		display: inline-block;
		background-color: var(--placeholder-color, #ccc);
		border-radius: 50%;
	}
</style>
