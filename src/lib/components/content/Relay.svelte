<!--Relay.svelte-->
<script lang="ts">
	let { tag }: { tag: string[] } = $props();
	let relayUrl = $derived(tag[1]);
	let read = $derived(tag.length === 2 || tag[2] === 'read');
	let write = $derived(tag.length === 2 || tag[2] === 'write');
</script>

<div class="relay-container">
	<span class="relay-url">{relayUrl}</span>
	{#if read || write}
		<span class="permissions">
			{#if read}R{/if}{#if write}W{/if}
		</span>
	{/if}
</div>

<style>
	.relay-container {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
		padding: 4px 8px;
		border: 1px solid var(--border-color);
		border-radius: 4px;
		font-size: 0.9em;
	}

	.relay-url {
		color: var(--text-color);
	}

	.permissions {
		color: var(--time-color);
		font-size: x-small;
		font-weight: 600;
	}
</style>
