<script lang="ts">
	import * as Nostr from 'nostr-typedef';
	import { Status, UserProfile } from 'nostr-web-components/index.js';
	import { ensureClient } from 'nostr-web-components/utils/ensureClient.js';

	export let pubkey: string | undefined;
	export let relays: string[];

	let status: Status = 'init';
	let profile: UserProfile | null = null;

	$: {
		if (pubkey) {
			loadProfile();
		}
	}

	async function loadProfile() {
		if (!pubkey) return;
		//まずstatusリセット
		status = 'loading';
		profile = null;

		try {
			const client = await ensureClient(relays);
			// console.log('[nostr-note] Client obtained:', client);

			if (!client) {
				status = 'error';
				console.error('[nostr-note] Client is null');
				return;
			}

			profile = await client.fetchProfile(pubkey, relays);
			// console.log('[nostr-note] Fetched note:', fetchedNote);

			if (!profile) {
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
	interface $$Slots {
		default: { profile: UserProfile | null; status: Status };
	}
</script>

<slot {profile} {status} />
