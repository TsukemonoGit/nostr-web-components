// core/connected.ts
export function connected(node: HTMLElement, initialize: () => void) {
	initialize();
	return {
		destroy() {
			// teardown を呼びたい場合はここで登録
			// 例: teardown();
		}
	};
}
