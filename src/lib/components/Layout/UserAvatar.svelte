<script lang="ts">
	import 'nostr-web-components/style.css';
	let { src, size = 48 }: { src: string | undefined; size?: number } = $props();

	let isError = $state(false);
</script>

{#if src && !isError}
	<img
		{src}
		onerror={() => (isError = true)}
		alt="avatar"
		class="avatar-img"
		style="width: {size}px; height: {size}px; vertical-align:bottom"
	/>
{:else}
	<div class="placeholder avatar" style="width: {size}px; height: {size}px;"></div>
{/if}

<style>
	.placeholder {
		vertical-align: bottom;
		background-color: var(--placeholder-color, #ccc);
		border-radius: 20%;
	}
	.avatar-img {
		border-radius: 20%;
	}
</style>
