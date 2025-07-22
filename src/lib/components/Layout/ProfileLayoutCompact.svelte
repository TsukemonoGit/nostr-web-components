<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		noLink?: boolean;
		showPlaceholders?: boolean;
		hasError?: boolean;
		link?: Snippet;
		avatar?: Snippet;
		name?: Snippet;
		about?: Snippet;
		error?: Snippet;
		themeClass?: string;
	}

	let {
		noLink = false,
		showPlaceholders = false,
		hasError = false,
		link,
		avatar,
		name,
		about,
		error,
		themeClass
	}: Props = $props();
</script>

<div class="compact-wrapper {themeClass}">
	<div class="compact-content">
		<div class="compact-avatar">
			{#if avatar}
				{@render avatar()}
			{:else if showPlaceholders}
				<div class="placeholder avatar"></div>
			{/if}
		</div>

		<div class="compact-details">
			<div class="compact-header">
				{#if name}
					{@render name()}
				{:else if showPlaceholders}
					<div class="placeholder name"></div>
				{/if}
			</div>

			{#if about || showPlaceholders}
				<div class="compact-about">
					{#if about}
						{@render about()}
					{:else if showPlaceholders}
						<div class="placeholder about"></div>
					{/if}
				</div>
			{/if}
		</div>
	</div>

	{#if !noLink && link}
		<div class="compact-link">{@render link()}</div>
	{/if}
</div>

<style>
	.compact-wrapper {
		background-color: var(--bg-color);
		color: var(--text-color);
		border: 1px solid var(--border-color);
		border-radius: 6px;
		padding: 8px 12px;
		font-family: sans-serif;
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.compact-content {
		display: flex;
		gap: 10px;
		align-items: flex-start;
	}

	.compact-avatar {
		margin-top: 0.4em;
		width: 36px;
		height: 36px;
		border-radius: 10%;
		overflow: hidden;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.compact-avatar > :global(*) {
		max-width: 100%;
		max-height: 100%;
		object-fit: cover;
		border-radius: 10%;
	}

	.compact-details {
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.compact-header {
		font-weight: bold;
		font-size: 1em;
		color: var(--name-color);
		word-break: break-word;
		overflow: hidden;
		max-width: 100%;
	}

	.compact-about {
		font-size: 0.9em;
		line-height: 1.4;
		color: var(--text-color);
		word-break: break-word;
		overflow-y: auto;
		white-space: normal; /* 改行文字（\n）を無視し、右端で折り返す */
	}

	.compact-link {
		position: absolute;
		top: 4px;
		right: 4px;
	}

	.placeholder.avatar {
		width: 36px;
		height: 36px;
		border-radius: 10%;
		background-color: var(--placeholder-color);
		animation: pulse 1.5s ease-in-out infinite;
	}

	.placeholder.name {
		width: 160px;
		height: 16px;
		background-color: var(--placeholder-color);
		animation: pulse 1.5s ease-in-out infinite;
		margin-bottom: 4px;
	}

	.placeholder.about {
		width: 200px;
		height: 14px;
		background-color: var(--placeholder-color);
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
