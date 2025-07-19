import { describe, it, expect } from 'vitest';
import { repostedId } from './utils.js';

describe('resolveUrl', () => {
	const event = {
		content: '',
		created_at: 1752829298,
		id: '8eda6ddffc79351b2abb5e7f5484cf4eab35ff6517cf5c24a84345b8a1113c61',
		kind: 6,
		pubkey: '84b0c46ab699ac35eb2ca286470b85e081db2087cdef63932236c397417782f5',
		sig: '154708738054774d4f1894e1b95473a2c3b9ce2671042b6891f25ae7646ac4704666b11fcdf3eed812b68c2ed6aca28810c7dce94dca9a2bdd8ba25310ca59b9',
		tags: [
			['p', '6b0a60cff3eca5a2b2505ccb3f7133d8422045cbef40f3d2c6189fb0b952e7d4'],
			[
				'e',
				'd58b380bd3a0623f3291d0b29eb953d20eaa364858800365efe245914c927bcd',
				'wss://yabu.me',
				'',
				'6b0a60cff3eca5a2b2505ccb3f7133d8422045cbef40f3d2c6189fb0b952e7d4'
			],
			[
				'client',
				'lumilumi',
				'31990:84b0c46ab699ac35eb2ca286470b85e081db2087cdef63932236c397417782f5:1727506446612',
				'wss://relay.nostr.band'
			]
		]
	};

	it('repostId', () => {
		const url = repostedId(event.tags);
		expect(url).toStrictEqual({
			tag: [
				'e',
				'd58b380bd3a0623f3291d0b29eb953d20eaa364858800365efe245914c927bcd',
				'wss://yabu.me',
				'',
				'6b0a60cff3eca5a2b2505ccb3f7133d8422045cbef40f3d2c6189fb0b952e7d4'
			],
			kind: undefined
		});
	});
});
