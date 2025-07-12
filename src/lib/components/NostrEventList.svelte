<svelte:options customElement="nostr-list" />

<script lang="ts">
	import { onMount } from 'svelte';

	import type { NostrEvent, Filter as NostrFilter } from 'nostr-tools';
	import { ensureClient } from 'nostr-web-components/utils/ensureClient.js';

	export let filters: string = '[]';
	export let relays: string[] = [];

	let events: NostrEvent[] = [];
	let loading = false;
	let error: string | null = null;

	onMount(async () => {
		let parsedFilters: NostrFilter[];

		try {
			const f = JSON.parse(filters);
			if (!Array.isArray(f)) throw new Error('filters must be an array');
			parsedFilters = f;
		} catch (err: any) {
			error = `Invalid filters: ${err.message}`;
			return;
		}

		loading = true;
		try {
			const client = await ensureClient(relays);
			events = await client.fetchByFilters(parsedFilters, relays);
		} catch (e: any) {
			error = e?.message || 'Failed to fetch events';
		} finally {
			loading = false;
		}
	});
</script>

{#if loading}
	<div>Loading...</div>
{:else if error}
	<div class="error">{error}</div>
{:else if events.length === 0}
	<div>No events found</div>
{:else}
	{#each events as ev (ev.id)}
		<nostr-note id={ev.id}></nostr-note>
	{/each}
{/if}
