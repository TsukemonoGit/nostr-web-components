<script lang="ts">
	import * as Nostr from 'nostr-typedef';
	import { ensureClient } from 'nostr-web-components/utils/ensureClient';
	import { untrack } from 'svelte';

	type Status = 'init' | 'loading' | 'error' | 'success' | 'nodata';
	type Props = {
		id: string;
		relays: string[];
		children?: (props: { note: Nostr.Event | null; status: Status }) => any;
		//children?: Snippet<[{ note: Nostr.Event | null; status: Status }]>;
	};

	let { id, relays, children }: Props = $props();

	let status: Status = $state<Status>('init');
	let note: Nostr.Event | null = $state(null);

	$effect(() => {
		if (id) {
			// console.log('[nostr-note] reactive loadNote() triggered by id =', id);
			untrack(() => {
				loadNote();
			});
		}
	});

	async function loadNote() {
		//まずstatusリセット
		status = 'loading';
		note = null;

		try {
			const client = await ensureClient(relays);
			// console.log('[nostr-note] Client obtained:', client);

			if (!client) {
				status = 'error';
				console.error('[nostr-note] Client is null');
				return;
			}

			note = await client.fetchNote(id, relays);
			// console.log('[nostr-note] Fetched note:', fetchedNote);

			if (!note) {
				status = 'nodata';
				return;
			}

			status = 'success';
			// loadMetadata(fetchedNote.pubkey);
		} catch (e: any) {
			status = 'error';
			console.error('[nostr-note] Exception:', e);
		} finally {
			console.log('[nostr-note] loading complete');
		}
	}
</script>

{@render children?.({ note, status })}
