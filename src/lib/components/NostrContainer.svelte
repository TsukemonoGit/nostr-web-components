<svelte:options customElement={{ tag: 'nostr-container', shadow: 'none' }} />

<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { NostrClientConfig } from 'nostr-web-components/index.ts';
	import { NostrClient } from 'nostr-web-components/core/NostrClient.js';
	import { defaultRelays } from 'nostr-web-components/utils/utils.js';
	import { nostrClient } from 'nostr-web-components/utils/store.js';

	import { get } from 'svelte/store';

	export let relays: string[] | string = defaultRelays;
	let relaysArray: string[] = [];
	let containerEl: HTMLElement;

	$: {
		try {
			if (typeof relays === 'string') {
				relaysArray = JSON.parse(relays);
			} else if (Array.isArray(relays)) {
				relaysArray = relays;
			} else {
				relaysArray = [];
			}
		} catch {
			relaysArray = [];
		}
	}

	async function setupClient() {
		if (!relaysArray || relaysArray.length === 0) return;

		const currentClient = get(nostrClient);
		if (currentClient) {
			currentClient.disconnect();
		}

		try {
			const config: NostrClientConfig = { relays: relaysArray };
			const client = new NostrClient(config);
			nostrClient.set(client);

			containerEl?.dispatchEvent(
				new CustomEvent('nostr-client-ready', {
					detail: { client },
					bubbles: true,
					composed: true
				})
			);
		} catch (error) {
			console.error('Invalid relays configuration:', error);
			nostrClient.set(null);
		}
	}

	$: if (relaysArray && relaysArray.length > 0) {
		setupClient();
	}

	onMount(() => {
		if (relaysArray && relaysArray.length > 0) {
			setupClient();
		}
	});

	onDestroy(() => {
		const client = get(nostrClient);
		if (client) {
			client.disconnect();
			nostrClient.set(null);
		}
	});
</script>

svelte

<div bind:this={containerEl}>
	<slot />
</div>
