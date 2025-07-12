<script lang="ts">
	import 'nostr-web-components/style.css';
	let { src }: { src: string | undefined } = $props();
</script>

{#if src}
	<img {src} alt="avatar" class="avatar-img" />
{:else}
	<div class="placeholder avatar"></div>
{/if}

<style>
	.placeholder {
		display: inline-block;
		background-color: var(--placeholder-color);
		border-radius: 50%;
	}

	.placeholder.avatar {
		width: 48px;
		height: 48px;
	}
</style>
