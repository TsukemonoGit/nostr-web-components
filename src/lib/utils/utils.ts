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

export const nip33Regex = /^([0-9]{1,9}):([0-9a-fA-F]{64}):(.*)$/;
export const repostedId = (
	tags: string[][]
): { tag: string[] | undefined; kind: number | undefined } => {
	const kindtag = tags.find((tag) => tag[0] === 'k');
	const kind = kindtag ? Number(kindtag[1]) : undefined;
	return {
		tag: tags
			.slice()
			.reverse()
			.find(
				(tag) =>
					(tag[0] === 'e' && nip19.BECH32_REGEX.test(tag[1])) ||
					(tag[0] === 'a' && nip33Regex.test(tag[1]))
			),
		kind: kind
	};
};
