<script lang="ts">
	import type { Snippet } from 'svelte';
	import 'nostr-web-components/style.css';
	interface Props {
		noLink?: boolean;
		showPlaceholders?: boolean;
		hasError?: boolean;
		link?: Snippet;
		avatar?: Snippet;
		name?: Snippet;
		createdAt?: Snippet;
		content?: Snippet;
		error?: Snippet;
		themeClass?: string;
		height?: string | undefined;
		replyUser?: Snippet;
	}

	let {
		noLink = false,
		showPlaceholders = false,
		hasError = false,
		link,
		avatar,
		name,
		createdAt,
		content,
		error,
		themeClass,
		height,
		replyUser
	}: Props = $props();
</script>

{#if hasError}
	<div class="note-error">
		{#if error}
			{@render error()}
		{:else}
			Error loading note
		{/if}
	</div>
{:else}
	<div class="nostr-wrapper {themeClass}">
		<div class="note-content">
			<div class="note-avatar">
				{#if avatar}
					{@render avatar()}
				{:else if showPlaceholders}
					<div class="placeholder avatar"></div>
				{/if}
			</div>

			<div class="note-details">
				<div class="note-header">
					<div class="note-name">
						{#if name}
							{@render name()}
						{:else if showPlaceholders}
							<div class="placeholder name"></div>
						{/if}
					</div>
					<div class="note-time">
						{#if createdAt}
							{@render createdAt()}
						{:else if showPlaceholders}
							<div class="placeholder time"></div>
						{/if}
					</div>
				</div>

				{#if replyUser}<div class="mention-container">{@render replyUser?.()}</div>{/if}
				<div
					class="note-body"
					style={`${height ? `max-height: ${height}; overflow-y: auto;` : 'overflow-y:hidden'}`}
				>
					{#if content}
						{@render content()}
					{:else if showPlaceholders}
						<div class="placeholder content"></div>
					{/if}
				</div>
			</div>
		</div>
		{#if !noLink && link}<div class="note-link">{@render link()}</div>{/if}
	</div>
{/if}

<style>
	:host {
		--bg-color: #fff;
		--text-color: #222;
		--border-color: #ddd;
		--name-color: #333;
		--time-color: #888;
		--placeholder-color: #e0e0e0;
		--error-bg: #f8d7da;
		--error-border: #f5c2c7;
		--error-text: #842029;

		/* 追加: リンクカラー */
		--link-color: #1a0dab;
		--link-hover-color: #551a8b;

		--external-link-color: #1a0dabb7;
		--external-link-hover-color: #541a8bb4;
	}

	.theme-dark,
	:host(.dark) {
		--bg-color: #1e1e1e;
		--text-color: #ddd;
		--border-color: #444;
		--name-color: #eee;
		--time-color: #aaa;
		--placeholder-color: #333;
		--error-bg: #4b1c1f;
		--error-border: #8a1f2e;
		--error-text: #ffb3b3;

		/* 追加: ダークテーマ用リンクカラー */
		--link-color: #8ab4f8;
		--link-hover-color: #a3d0ff;

		--external-link-color: #8ab4f8c4;
		--external-link-hover-color: #a3cfffd2;
	}

	:host(.theme-light),
	:host(.light) {
		--bg-color: #fff;
		--text-color: #222;
		--border-color: #ddd;
		--name-color: #333;
		--time-color: #888;
		--placeholder-color: #e0e0e0;
		--error-bg: #f8d7da;
		--error-border: #f5c2c7;
		--error-text: #842029;

		/* ライトテーマ用リンクカラー */
		--link-color: #1a0dab;
		--link-hover-color: #551a8b;

		--external-link-color: #1a0dabb7;
		--external-link-hover-color: #541a8bb4;
	}

	.note-error {
		padding: 12px;
		border: 1px solid var(--error-border);
		background-color: var(--error-bg);
		color: var(--error-text);
		border-radius: 6px;
	}

	.note-link {
		position: absolute;
		top: 0;
		right: 0;
		overflow: visible;
	}
	.nostr-wrapper {
		border: 1px solid var(--border-color);
		border-radius: 6px;
		padding: 6px;

		background-color: var(--bg-color);
		color: var(--text-color);
		font-family: sans-serif;
		position: relative;
	}
	.note-content {
		display: flex;
		align-items: flex-start;
		gap: 6px;
	}

	.note-avatar {
		width: 40px;
		height: 40px;
		border-radius: 20%;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.note-avatar > :global(*) {
		max-width: 100%;
		max-height: 100%;
		object-fit: cover;
		border-radius: 20%;
	}

	.note-details {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.note-header {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.note-name {
		font-weight: bold;
		font-size: 14px;
		color: var(--name-color);
	}

	.note-time {
		font-size: 12px;
		color: var(--time-color);
	}

	.note-body {
		white-space: pre-wrap;
		word-break: normal;
		word-break: break-word;
	}

	.placeholder {
		background-color: var(--placeholder-color);
		border-radius: 4px;
		animation: pulse 1.5s ease-in-out infinite;
	}

	.placeholder.avatar {
		width: 40px;
		height: 40px;
		border-radius: 20%;
	}

	.placeholder.name {
		width: 80px;
		height: 14px;
	}

	.placeholder.time {
		width: 60px;
		height: 10px;
	}

	.placeholder.content {
		width: 100%;
		height: 48px;
		margin-top: 4px;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.7;
		}
	}

	.mention-container {
		margin: 4px 0;
		font-size: small;
		display: inline-flex;
		flex-wrap: wrap;
		max-height: 3.5em;
		overflow-y: auto;
		white-space: nowrap;

		/* メンション欄装飾 */
		padding-left: 8px; /* ライン分の余白 */
		border-left: 4px solid var(--mention-line-color, #3b82f6);
		border-radius: 4px;
		gap: 4px;
		align-items: center;
	}

	/* 子要素の横並びと改行防止 */
	.mention-container > * {
		flex-shrink: 0;
		white-space: nowrap;
	}
</style>
