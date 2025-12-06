// src/lib/core/connected.ts
export function connected(node: HTMLElement, initialize: () => void) {
	initialize();
	return {
		destroy() {
			// Cleanup logic can be added here if needed
		}
	};
}
