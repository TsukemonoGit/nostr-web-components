import { nip19 } from 'nostr-tools';

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
