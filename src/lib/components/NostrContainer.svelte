<svelte:options customElement={{ tag: 'nostr-container', shadow: 'none' }} />

<script lang="ts">
	import type { NostrClientConfig } from 'nostr-web-components/index.ts';
	import { NostrClient } from 'nostr-web-components/core/NostrClient.js';
	import { defaultRelays } from 'nostr-web-components/utils/utils.js';
	import { nostrClient } from 'nostr-web-components/utils/store.js';

	import { get } from 'svelte/store';
	import { connected } from 'nostr-web-components/core/connected.js';

	export let relays: string[] | string = defaultRelays;
	let relaysArray: string[] = [];
	let containerEl: HTMLElement;
	let mounted = false;

	// propsからリレー配列に変換
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

	function initialize() {
		if (!mounted) {
			mounted = true;
			setupClient();
		}
	}

	// relaysが変わったら client を再セット
	$: if (mounted && relaysArray.length) {
		setupClient();
	}

	async function setupClient() {
		const currentClient = get(nostrClient);
		if (!currentClient) {
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
		} else if (relaysArray.length > 0) {
			//すでにセットしてあってもコンテナのリレーをデフォリレーに設定するよ
			currentClient.setDefaultRelays(relaysArray);
		}
	}
</script>

<!-- mount処理は use:connected アクション経由で -->
<div use:connected={initialize} bind:this={containerEl}>
	<slot />
</div>
