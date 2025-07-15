<script lang="ts">
	import type { Snippet } from 'svelte';
	import 'nostr-web-components/style.css';

	interface Props {
		class?: string;
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
		replyUser?: Snippet;
		height?: string;
	}

	let {
		class: className = '',
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
		replyUser,
		height
	}: Props = $props();
</script>

{#if hasError}
	<div class="note-error {className}">
		{#if error}
			{@render error()}
		{:else}
			Error loading note
		{/if}
	</div>
{:else}
	<div class="compact-note {className} {themeClass}">
		<div class="note-row">
			<!-- 左: アバター -->
			<div class="note-avatar">
				{#if avatar}
					{@render avatar()}
				{:else if showPlaceholders}
					<div class="placeholder avatar"></div>
				{/if}
			</div>

			<!-- 右: 本文 -->
			<div class="note-main">
				{#if replyUser}
					<div class="note-reply">
						{@render replyUser()}
					</div>
				{/if}

				<div class="note-header">
					<span class="note-name">
						{#if name}
							{@render name()}
						{:else if showPlaceholders}
							<div class="placeholder name"></div>
						{/if}
					</span>
					<span class="note-time">
						{#if createdAt}
							{@render createdAt()}
						{:else if showPlaceholders}
							<div class="placeholder time"></div>
						{/if}
					</span>
				</div>

				{#if content}
					<div class="note-content" style={`max-height: ${height ?? 'none'}; overflow-y: auto;`}>
						{@render content()}
					</div>
				{:else if showPlaceholders}
					<div class="placeholder content"></div>
				{/if}
			</div>
		</div>

		{#if !noLink && link}
			<div class="note-link">
				{@render link()}
			</div>
		{/if}
	</div>
{/if}

<style>
	.compact-note {
		border: 1px solid var(--border-color);
		border-radius: 6px;
		padding: 8px 12px;
		background-color: var(--bg-color);
		color: var(--text-color);
		font-family: sans-serif;
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.note-row {
		display: flex;
		gap: 10px;
		align-items: flex-start;
	}

	.note-avatar {
		width: 36px;
		height: 36px;
		flex-shrink: 0;
		border-radius: 6px;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.note-avatar > :global(*) {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 6px;
	}

	.note-main {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 4px;
		min-width: 0;
		overflow: hidden;
	}

	.note-reply {
		font-size: 0.75em;
		color: var(--time-color);
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.note-header {
		display: flex;
		gap: 6px;
		align-items: baseline;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 0.85em;
	}

	.note-name {
		font-weight: bold;
		color: var(--name-color);
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.note-time {
		color: var(--time-color);
		font-size: 0.75em;
		flex-shrink: 0;
	}

	.note-content {
		font-size: 0.9em;
		line-height: 1.4;
		color: var(--text-color);
		word-break: break-word;
		overflow-y: auto;
		white-space: normal; /* 改行文字（\n）を無視し、右端で折り返す */
	}

	.note-link {
		position: absolute;
		top: 6px;
		right: 8px;
	}

	/* プレースホルダー */
	.placeholder.avatar {
		width: 36px;
		height: 36px;
		border-radius: 6px;
		background-color: var(--placeholder-color);
		animation: pulse 1.5s ease-in-out infinite;
	}

	.placeholder.name,
	.placeholder.time {
		width: 80px;
		height: 14px;
		background-color: var(--placeholder-color);
		border-radius: 2px;
		animation: pulse 1.5s ease-in-out infinite;
	}

	.placeholder.content {
		width: 100%;
		height: 28px;
		background-color: var(--placeholder-color);
		border-radius: 4px;
		animation: pulse 1.5s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.6;
		}
	}
</style>
