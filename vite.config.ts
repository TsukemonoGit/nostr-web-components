import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export default defineConfig({
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
			'nostr-web-components': path.resolve(__dirname, 'src/lib') // 実際のパスに合わせて調整
		}
	},
	build: {
		lib: {
			entry: 'src/lib/index.ts', // ライブラリのエントリーポイント
			name: 'NostrWebComponents', // グローバル変数名（UMD形式用）
			fileName: 'nostr-web-components',
			formats: ['es', 'umd']
		},
		rollupOptions: {
			external: ['svelte'], // 必要に応じて外部化するライブラリ
			output: {
				globals: {
					svelte: 'Svelte'
				}
			}
		}
	}
});
