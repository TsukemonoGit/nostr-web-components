import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
	base: '/nostr-web-components/',
	plugins: [
		tailwindcss(),
		svelte({
			compilerOptions: {
				customElement: true
			}
		})
	],
	resolve: {
		alias: {
			'nostr-web-components': path.resolve(__dirname, 'src/lib')
		}
	},
	build: {
		lib: {
			entry: 'src/lib/index.ts',
			name: 'NostrWebComponents',
			fileName: 'nostr-web-components',
			formats: ['es', 'umd']
		},
		rollupOptions: {
			external: ['svelte'],
			output: {
				globals: {
					svelte: 'Svelte'
				}
			}
		}
	}
});
