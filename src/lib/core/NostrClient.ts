// src/core/NostrClient.ts
import {
	createRxBackwardReq,
	createRxNostr,
	type EventPacket,
	latest,
	type RxNostr,
	uniq
} from 'rx-nostr';
import { nip05, nip19, type NostrEvent } from 'nostr-tools';
import { verifier } from '@rx-nostr/crypto';
import type { UserProfile, NostrClientConfig } from 'nostr-web-components/types/index.js';
import type { Filter } from 'nostr-typedef';
import { defaultRelays, resolveToPubkey } from 'nostr-web-components/utils/utils.js';

export class NostrClient {
	rxNostr: RxNostr;
	private config: NostrClientConfig;
	private profileCache = new Map<string, UserProfile>();
	private noteCache = new Map<string, NostrEvent>();
	private naddrCache = new Map<string, NostrEvent>();

	constructor(config: NostrClientConfig) {
		this.config = {
			timeout: 5000,
			maxConnections: 10,
			...config
		};
		this.rxNostr = createRxNostr({ verifier, eoseTimeout: config.timeout || 5000 });
		this.rxNostr.setDefaultRelays(this.config.relays || defaultRelays);
		//	console.log(this.rxNostr.getDefaultRelays());

		// this.rxNostr.createConnectionStateObservable().subscribe((packet) => {
		// 	console.log(`${packet.from} の接続状況が ${packet.state} に変化しました。`);
		// });
	}
	setDefaultRelays(list: string[]) {
		this.rxNostr.setDefaultRelays(list);
	}
	async fetchByFilters(
		filters: Filter[],
		relays?: string[],
		expectSingle = false
	): Promise<NostrEvent[]> {
		const currentRelays = this.rxNostr.getDefaultRelays();
		//console.log(currentRelays);
		if (Object.keys(currentRelays).length === 0) {
			this.rxNostr.setDefaultRelays(this.config.relays || defaultRelays);
		}
		const rxReq = createRxBackwardReq();
		//console.log('fetch', filters, relays, this.rxNostr.getAllRelayStatus());
		return new Promise(async (resolve, reject) => {
			const events: NostrEvent[] = [];
			const timeout = setTimeout(
				() => {
					resolve(events);
				},
				(this.config.timeout || 5000) + 5000
			);

			const observable =
				(relays || []).length > 0
					? this.rxNostr.use(rxReq, { relays: relays })
					: this.rxNostr.use(rxReq);

			const pipeOperators = expectSingle
				? observable.pipe(uniq(), latest())
				: observable.pipe(uniq());

			const subscription = pipeOperators.subscribe({
				next: (packet: EventPacket) => {
					//console.log(packet);
					if (packet.event) {
						events.push(packet.event);
						// 単一のイベントを期待する場合は即座に完了
						if (expectSingle) {
							clearTimeout(timeout);
							subscription.unsubscribe(); // subscription を明示的に終了
							resolve([packet.event]);
						}
					}
				},
				error: (error: any) => {
					clearTimeout(timeout);
					reject(error);
				},
				complete: () => {
					clearTimeout(timeout);
					resolve(events.sort((a, b) => b.created_at - a.created_at));
				}
			});

			//	console.log('emit filters:', filters);
			rxReq.emit(filters);
			//	console.log('called rxReq.over()');
			rxReq.over();
		});
	}
	async fetchNote(noteId: string, relays?: string[]): Promise<NostrEvent | null> {
		let actualNoteId = noteId;
		//	console.log('fetchnote');
		try {
			if (noteId.startsWith('nevent') || noteId.startsWith('note')) {
				const decoded = nip19.decode(noteId);
				if (decoded.type === 'nevent') {
					actualNoteId = decoded.data.id;
				} else if (decoded.type === 'note') {
					actualNoteId = decoded.data;
				}
			}
		} catch (e) {
			console.warn('Failed to decode note id:', noteId);
		}

		if (this.noteCache.has(actualNoteId)) {
			return this.noteCache.get(actualNoteId)!;
		}
		//	console.log(actualNoteId, relays);
		const results = await this.fetchByFilters([{ ids: [actualNoteId], limit: 1 }], relays, true);
		const event = results[0] ?? null;

		if (event) {
			this.noteCache.set(actualNoteId, event);
		}
		return event;
	}

	async fetchNaddr(naddrAddress: string, relays?: string[]): Promise<NostrEvent | null> {
		// キャッシュチェック
		if (this.naddrCache.has(naddrAddress)) {
			return this.naddrCache.get(naddrAddress)!;
		}

		try {
			// naddrアドレスをデコード
			const decoded = nip19.decode(naddrAddress);
			if (decoded.type !== 'naddr') {
				console.warn('Invalid naddr address:', naddrAddress);
				return null;
			}

			const { kind, pubkey, identifier } = decoded.data;

			// パラメータを構築してフィルタ作成
			const filter: Filter = {
				kinds: [kind],
				authors: [pubkey],
				limit: 1
			};

			// identifierが存在する場合は#dタグでフィルタ
			if (identifier) {
				filter['#d'] = [identifier];
			}

			// 指定されたリレーがある場合は使用、なければnaddrに含まれるリレーまたはデフォルト
			const targetRelays =
				relays || (decoded.data.relays?.length ? decoded.data.relays : undefined);

			// イベントを取得（最新の1つを期待）
			const results = await this.fetchByFilters([filter], targetRelays, true);
			const event = results[0] ?? null;

			// キャッシュに保存
			if (event) {
				this.naddrCache.set(naddrAddress, event);
			}

			return event;
		} catch (e) {
			console.warn('Failed to decode or fetch naddr:', naddrAddress, e);
			return null;
		}
	}

	async fetchProfile(user: string, relays?: string[]): Promise<UserProfile | null> {
		// user は npub / nprofile / nip05 / あるいは pubkey のいずれかを許容する

		const pubkey = await resolveToPubkey(user);

		if (!pubkey) {
			return null; // 解決失敗
		}

		if (this.profileCache.has(pubkey)) {
			return this.profileCache.get(pubkey)!;
		}

		const results = await this.fetchByFilters([{ kinds: [0], authors: [pubkey] }], relays, true);
		const event = results[0];

		if (event) {
			try {
				const profile = JSON.parse(event.content);
				profile.pubkey = pubkey;
				this.profileCache.set(pubkey, profile);
				return { ...profile, tags: event.tags };
			} catch (e) {
				console.warn('Failed to parse profile:', e);
			}
		}

		return null;
	}

	disconnect(): void {
		this.rxNostr.dispose();
	}
}
