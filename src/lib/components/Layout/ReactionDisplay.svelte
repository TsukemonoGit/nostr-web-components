<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		className?: string;
		themeClass?: string;
		noLink?: boolean;
		showPlaceholders?: boolean;
		hasError?: boolean;
		link?: Snippet;
		avatar?: Snippet;
		name?: Snippet;
		content?: Snippet;
		error?: Snippet;
		header?: Snippet;
	}

	let {
		className = '',
		themeClass = '',
		noLink = false,
		showPlaceholders = false,
		hasError = false,
		link,
		avatar,
		name,
		content,
		error,
		header
	}: Props = $props();
</script>

<div class="repost-container {themeClass} {className}">
	{#if hasError}
		<div class="error-container">
			{#if error}
				{@render error()}
			{:else}
				<span class="error-text">Error: Invalid repost tag</span>
			{/if}
		</div>
	{:else}
		{#if header || showPlaceholders}
			<div class="repost-header">
				{#if header}
					{@render header()}
				{:else if showPlaceholders}
					<div class="repost-placeholder">
						<div class="avatar-placeholder"></div>
						<div class="name-placeholder"></div>
					</div>
				{/if}
			</div>
		{/if}

		{#if content || showPlaceholders}
			<div class="repost-content">
				{#if content}
					{@render content()}
				{:else if showPlaceholders}
					<div class="reposted-content-placeholder">
						<div class="line-placeholder"></div>
						<div class="line-placeholder short"></div>
					</div>
				{/if}
			</div>
		{/if}

		{#if !noLink && link}
			<div class="external-link-container">
				{@render link()}
			</div>
		{/if}
	{/if}
</div>

<style>
	.repost-container {
		border: 1px solid var(--border-color);
		border-radius: 8px;
		padding: 6px;
		background-color: var(--bg-color);
		color: var(--text-color);
		position: relative;
	}

	.repost-header {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 2px;
		font-size: smaller;
	}

	.repost-content {
		margin-top: 4px;
	}

	.external-link-container {
		position: absolute;
		top: 0;
		right: 0;
		overflow: visible;
	}

	.external-link-container :global(a) {
		text-decoration: none;
		color: var(--external-link-color);
		opacity: 0.8;
		transition: opacity 0.2s;
	}

	.external-link-container :global(a:hover) {
		opacity: 1;
	}

	.error-container {
		padding: 12px;
		background-color: var(--error-bg);
		border: 1px solid var(--error-border);
		border-radius: 6px;
		color: var(--error-text);
	}

	/* プレースホルダー */
	.repost-placeholder {
		display: flex;
		align-items: center;
		gap: 8px;
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	.avatar-placeholder {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background-color: var(--border-color);
	}

	.name-placeholder {
		width: 120px;
		height: 16px;
		border-radius: 4px;
		background-color: var(--border-color);
	}

	.line-placeholder {
		width: 100%;
		height: 16px;
		border-radius: 4px;
		background-color: var(--border-color);
		margin-bottom: 8px;
	}

	.line-placeholder.short {
		width: 70%;
	}

	.reposted-content-placeholder {
		margin-top: 12px;
		padding: 12px;
		border: 1px solid var(--border-color);
		border-radius: 6px;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}
</style>
