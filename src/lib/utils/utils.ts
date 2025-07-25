import { nip05, nip19 } from 'nostr-tools';

export const defaultRelays = ['wss://relay.nostr.band', 'wss://nos.lol'];

export function parseNaddr(tag: string[]): nip19.AddressPointer {
	const [, reference, relay] = tag; // 配列の2番目の要素を取り出す
	const [kind, pubkey, ...identifierParts] = reference.split(':'); // referenceをコロンで分割, identifierの中に:が含まれる可能性がある
	const identifier = identifierParts.join(':'); // identifierの部分を結合する
	//console.log(identifier);
	return relay !== undefined && relay !== ''
		? {
				kind: Number(kind),
				pubkey: pubkey,
				identifier: identifier ?? '',
				relays: [relay]
			}
		: {
				kind: Number(kind),
				pubkey: pubkey,
				identifier: identifier ?? ''
			};
}

/**
 * NIP-05 アドレスから pubkey を取得
 */
async function resolveNip05(user: string): Promise<string | null> {
	try {
		const profile = await nip05.queryProfile(user);
		if (profile?.pubkey) {
			return profile.pubkey;
		} else {
			console.warn('No pubkey found for NIP-05:', user);
		}
	} catch (err) {
		console.warn('Failed to resolve NIP-05 address:', user, err);
	}
	return null;
}

/**
 * NIP-19 形式 (npub, nprofile) から pubkey を取得
 */
function resolveNip19(user: string): string | null {
	try {
		const decoded = nip19.decode(user);
		switch (decoded.type) {
			case 'npub':
				return decoded.data;
			case 'nprofile':
				return decoded.data.pubkey;
			default:
				console.warn('Unsupported NIP-19 type:', decoded.type);
		}
	} catch (e) {
		console.warn('Failed to decode NIP-19 identifier:', user, e);
	}
	return null;
}

/**
 * user string を pubkey (hex) に解決する
 */
export async function resolveToPubkey(user: string | undefined): Promise<string | null> {
	if (!user) return null;
	let pubkey: string | null = user;

	if (nip05.isNip05(user)) {
		pubkey = await resolveNip05(user);
	} else if (nip19.NostrTypeGuard.isNProfile(user) || nip19.NostrTypeGuard.isNPub(user)) {
		pubkey = resolveNip19(user);
	}

	if (!pubkey || !/^[0-9a-f]{64}$/i.test(pubkey)) {
		return null;
	}

	return pubkey;
}
/**
 * user string を pubkey (hex) に解決する
 */
export function resolveToNoteId(noteId: string | undefined): string | null {
	if (!noteId) return null;
	let actualNoteId: string | null = noteId;

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

	if (!actualNoteId || !/^[0-9a-f]{64}$/i.test(actualNoteId)) {
		return null;
	}
	return actualNoteId;
}

export const nip33Regex = /^([0-9]{1,9}):([0-9a-fA-F]{64}):(.*)$/;
export const hexRegex = /^[0-9a-f]{64}$/;

export const repostedId = (
	tags: string[][]
): { tag: string[] | undefined; kind: number | undefined } => {
	//console.log(tags);
	const kindtag = tags.find((tag) => tag[0] === 'k');
	const kind = kindtag ? Number(kindtag[1]) : undefined;
	return {
		tag: tags
			.slice()
			.reverse()
			.find(
				(tag) =>
					(tag[0] === 'e' && hexRegex.test(tag[1])) || (tag[0] === 'a' && nip33Regex.test(tag[1]))
			),
		kind: kind
	};
};

export const getWarningTag = (tags: string[][]) => {
	return tags.find((tag) => tag[0] === 'content-warning');
};
