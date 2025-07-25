/**
 * URL生成ユーティリティ関数
 */

import { nip19 } from 'nostr-tools';
import * as Nostr from 'nostr-typedef';
/**
 * URLテンプレート内のプレースホルダーを実際の値に置換する
 * @param template URLテンプレート（例: "https://example.com/user/{id}"）
 * @param replacements 置換する値のオブジェクト（例: {id: "npub1234..."}）
 * @returns 置換後のURL
 */
export function replaceUrlPlaceholders(
	template: string,
	replacements: Record<string, string>
): string {
	let result = template;

	for (const [key, value] of Object.entries(replacements)) {
		const rawPlaceholder = `{${key}}`;
		const encodedPlaceholder = encodeURIComponent(rawPlaceholder); // 例: {user} → %7Buser%7D

		// 両方置換：未エンコードとエンコード済みのプレースホルダー
		result = result
			.replace(new RegExp(rawPlaceholder, 'g'), value)
			.replace(new RegExp(encodedPlaceholder, 'g'), value);
	}

	return result;
}

/**
 * 動的URLを生成する（単一のIDプレースホルダー用の便利関数）
 * @param template URLテンプレート（例: "https://example.com/user/{id}"）
 * @param id 置換するID
 * @returns 置換後のURL
 */
export function generateDynamicUrl(template: string, id: string): string {
	return replaceUrlPlaceholders(template, { id });
}

/**
 * hrefまたはデフォルトURLを生成する
 * @param href ユーザー指定のhref（nullの場合はデフォルトURL生成）
 * @param id NostrID
 * @param defaultUrlTemplate デフォルトのURLテンプレート
 * @returns 最終的なURL
 */
export function resolveUrl(
	href: string | null,
	id: string | undefined,
	defaultUrlTemplate: string = 'https://njump.me/{id}'
): string | undefined {
	if (!id) {
		return undefined;
	}
	const replacements: Record<string, string> = {
		id,
		user: id, // user も同じ値で置き換える（npubなど）,
		naddr: id
	};

	const template = href ?? defaultUrlTemplate;
	return replaceUrlPlaceholders(template, replacements);
}

/**
 * URLテンプレートに含まれるプレースホルダーを検出する
 * @param template URLテンプレート
 * @returns プレースホルダーの配列
 */
export function extractPlaceholders(template: string): string[] {
	const regex = /\{([^}]+)\}/g;
	const placeholders: string[] = [];
	let match;

	while ((match = regex.exec(template)) !== null) {
		placeholders.push(match[1]);
	}

	return placeholders;
}

/**
 * URLテンプレートが有効かチェックする
 * @param template URLテンプレート
 * @param requiredPlaceholders 必須のプレースホルダー
 * @returns 有効性チェック結果
 */
export function validateUrlTemplate(
	template: string,
	requiredPlaceholders: string[] = []
): boolean {
	const placeholders = extractPlaceholders(template);

	return requiredPlaceholders.every((required) => placeholders.includes(required));
}

export const encodeNpub = (hex: string): string | undefined => {
	try {
		return nip19.npubEncode(hex);
	} catch (error) {}
	return undefined;
};

export function encodeEventToNevent(note: Nostr.Event): string | undefined {
	return encodeToNevent({ id: note.id, author: note.pubkey });
}

export function encodeToNevent(props: nip19.EventPointer): string | undefined {
	try {
		return nip19.neventEncode(props);
	} catch (error) {
		return undefined;
	}
}

/**
 * `a`タグから `naddr` をエンコード
 * @param aTagValue フォーマット: `<kind>:<pubkey>:<identifier>`
 * @returns naddr文字列 (例: naddr1...)
 */
export function encodeNaddr(aTagValue: string): string {
	const [kindStr, pubkey, identifier] = aTagValue.split(':');

	if (!kindStr || !pubkey || !identifier) {
		throw new Error(`Invalid a-tag format: ${aTagValue}`);
	}

	const kind = parseInt(kindStr, 10);
	if (isNaN(kind)) {
		throw new Error(`Invalid kind in a-tag: ${kindStr}`);
	}

	return nip19.naddrEncode({
		kind,
		pubkey,
		identifier
	});
}

export const createTruncatedNpub = (npub: string | undefined) => {
	return npub ? `${npub.slice(0, 8)}...${npub.slice(-8)}` : 'Unknown';
};
