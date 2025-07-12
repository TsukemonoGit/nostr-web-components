<script lang="ts">
	import 'nostr-web-components/style.css';
	interface Props {
		name: undefined | string;
	}
	let { name }: Props = $props();
</script>

{#if name}
	{name}
{:else}
	<div class="placeholder name"></div>
{/if}

<style>
	.placeholder {
		display: inline-block;
		animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
		background-color: var(--placeholder-color);
		border-radius: 3px;
	}
	@keyframes pulse {
		50% {
			opacity: 0.5;
		}
	}

	.name {
		width: 80px;
		height: 14px;
	}
</style>
