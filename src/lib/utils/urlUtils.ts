/**
 * URL生成ユーティリティ関数
 */

import { nip19 } from 'nostr-tools';

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
		const placeholder = `{${key}}`;
		result = result.replace(new RegExp(placeholder, 'g'), value);
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
	id: string,
	defaultUrlTemplate: string = 'https://njump.me/{id}'
): string {
	const replacements: Record<string, string> = {
		id,
		user: id // user も同じ値で置き換える（npubなど）
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
