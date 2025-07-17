<script lang="ts">
	import * as Nostr from 'nostr-typedef';
	import { UserProfile } from 'nostr-web-components/types';
	import { ensureClient } from 'nostr-web-components/utils/ensureClient';
	import { untrack } from 'svelte';

	type Status = 'init' | 'loading' | 'error' | 'success' | 'nodata';
	type Props = {
		pubkey: string | undefined;
		relays: string[];
		children?: (props: { profile: UserProfile | null; status: Status }) => any;
		//children?: Snippet<[{ metadata: UserProfile | null; status: Status }]>;
	};

	let { pubkey, relays, children }: Props = $props();

	let status: Status = $state<Status>('init');
	let profile: UserProfile | null = $state(null);

	$effect(() => {
		if (pubkey) {
			untrack(() => {
				loadNote();
			});
		}
	});

	async function loadNote() {
		if (!pubkey) return;
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
</script>

{@render children?.({ profile, status })}
