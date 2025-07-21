<script lang="ts">
	import * as Nostr from 'nostr-typedef';
	import type { Status } from 'nostr-web-components/index.js';

	import { ensureClient } from 'nostr-web-components/utils/ensureClient.js';

	export let id: string | undefined;
	export let relays: string[];

	let status: Status = 'init';
	let note: Nostr.Event | null = null;

	$: {
		if (id) {
			loadNote();
		}
	}

	async function loadNote() {
		//まずstatusリセット
		status = 'loading';
		note = null;
		if (!id) return;
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
			//console.log('[nostr-note] loading complete');
		}
	}
	interface $$Slots {
		default: { note: Nostr.Event | null; status: Status };
	}
</script>

<slot {note} {status} />
