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
		username?: Snippet;
		about?: Snippet;
		error?: Snippet;
		themeClass?: string;
		height?: string | undefined;
	}

	let {
		class: className = '',
		noLink = false,
		showPlaceholders = false,
		hasError = false,
		link,
		avatar,
		name,
		username,
		about,
		error,
		themeClass,
		height
	}: Props = $props();
</script>

<div class="nostr-wrapper {className} {themeClass}">
	<div class="profile-content">
		<div class="profile-avatar">
			{#if avatar}
				{@render avatar()}
			{:else if showPlaceholders}
				<div class="placeholder avatar"></div>
			{/if}
		</div>

		<div class="profile-details">
			<div class="profile-header">
				<div class="profile-name">
					{#if name}
						{@render name()}
					{:else if showPlaceholders}
						<div class="placeholder name"></div>
					{/if}
				</div>
				<div class="profile-username">
					{#if username}
						{@render username()}
					{:else if showPlaceholders}
						<div class="placeholder username"></div>
					{/if}
				</div>
			</div>

			{#if about || showPlaceholders}
				<div
					class="profile-about"
					style={`${height ? `max-height: ${height}; overflow-y: auto;` : 'overflow-y:hidden'}`}
				>
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
		<div class="profile-link">{@render link()}</div>{/if}
</div>

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
	}

	.placeholder {
		display: inline-block;
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
		background-color: var(--placeholder-color);
		border-radius: 3px;
	}

	@keyframes pulse {
		50% {
			opacity: 0.5;
		}
	}

	.profile-error {
		padding: 16px;
		border: 1px solid var(--error-border);
		background-color: var(--error-bg);
		color: var(--error-text);
		border-radius: 6px;
	}
	.nostr-wrapper {
		position: relative;
	}
	.profile-link {
		position: absolute;
		top: 0;
		right: 0;
		overflow: visible;
	}

	.profile-content {
		display: flex;
		align-items: flex-start;
		gap: 16px;
	}

	.profile-avatar {
		width: 60px;
		height: 60px;
		border-radius: 20%;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.profile-avatar > :global(*) {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
		border-radius: 20%;
	}

	.profile-details {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.profile-header {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.profile-name {
		font-weight: bold;
		font-size: 18px;
		color: var(--name-color);
	}

	.profile-username {
		font-size: 14px;
		color: var(--username-color);
	}

	.profile-about {
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
		width: 60px;
		height: 60px;
		border-radius: 20%;
	}

	.placeholder.name {
		width: 120px;
		height: 18px;
	}

	.placeholder.username {
		width: 80px;
		height: 14px;
	}

	.placeholder.about {
		width: 100%;
		height: 36px;
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
</style>
