import { describe, it, expect } from 'vitest';
import { resolveUrl } from './urlUtils';

describe('resolveUrl', () => {
	const id = 'npub17sysrj0cgny7jtplj50dtzmjng49sxw0st6eqsparpjc0gft07squxl7m4';

	it('置換: {id} がテンプレートに含まれている場合', () => {
		const template = 'https://example.com/profile/{id}';
		const url = resolveUrl(template, id);
		expect(url).toBe(`https://example.com/profile/${id}`);
	});

	it('置換: {user} がテンプレートに含まれている場合', () => {
		const template = 'https://example.com/u/{user}';
		const url = resolveUrl(template, id);
		expect(url).toBe(`https://example.com/u/${id}`);
	});

	it('置換: {user} と {id} の両方を含む場合', () => {
		const template = 'https://example.com/u/{user}/profile/{id}';
		const url = resolveUrl(template, id);
		expect(url).toBe(`https://example.com/u/${id}/profile/${id}`);
	});

	it('hrefがnullのときにデフォルトテンプレートが使われる', () => {
		const url = resolveUrl(null, id);
		expect(url).toBe(`https://njump.me/${id}`);
	});

	it('カスタムデフォルトテンプレートが指定されている場合', () => {
		const defaultTemplate = 'https://custom.app/{user}';
		const url = resolveUrl(null, id, defaultTemplate);
		expect(url).toBe(`https://custom.app/${id}`);
	});
});
