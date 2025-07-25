<script lang="ts">
	import * as Nostr from 'nostr-typedef';

	import type { Display, Status, Theme, UserProfile } from 'nostr-web-components/index.js';
	import { getKindDisplayName, listSupportedTags } from 'nostr-web-components/utils/kinds.js';

	import Kind0 from './Kind0.svelte';

	interface Props {
		note: Nostr.Event;
		profile: UserProfile | null;

		themeClass: string;
		noLink: boolean;
		linkUrl: string | undefined;
		target: string;
		status: Status;
	}

	let {
		note,
		profile,

		themeClass,
		noLink,

		linkUrl,
		target,

		status
	}: Props = $props();

	//let dtag = $derived(note.tags.find((tag) => tag[0] === 'd')?.[1]);
	let title = $derived(note.tags.find((tag) => tag[0] === 'title')?.[1]);
	let desc = $derived(
		note.tags.find((tag) => tag[0] === 'description' || tag[0] === 'summary')?.[1]
	);
	//$inspect(title);
	let image = $derived(note.tags.find((tag) => tag[0] === 'image')?.[1]);
	// フィルタリングとソート

	//console.log(note);
</script>

<div class="list-container {themeClass}">
	<!-- svelte-ignore a11y_consider_explicit_label -->
	{#if !noLink && linkUrl}
		<a
			href={linkUrl}
			{target}
			referrerpolicy="no-referrer"
			class="external-link"
			title="Open in new tab"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-external-link-icon lucide-external-link"
			>
				<path d="M15 3h6v6" />
				<path d="M10 14 21 3" />
				<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
			</svg>
		</a>{/if}
	<header class="list-header">
		<h3 class="list-title">{getKindDisplayName(note.kind)}</h3>

		<Kind0
			pubkey={note.pubkey}
			{profile}
			{themeClass}
			{noLink}
			{linkUrl}
			display={'name'}
			{target}
			{status}
		/>
	</header>
	{#if title || desc || image}
		<div class="list-summary-card">
			{#if image}
				<img loading="lazy" class="list-summary-image" src={image} alt={title || 'image'} />
			{/if}

			<div class="list-summary-text">
				{#if title}
					<h4 class="list-summary-title">{title}</h4>
				{/if}
				{#if desc}
					<p class="list-summary-desc">{desc}</p>
				{/if}
			</div>
		</div>
	{/if}
	<div class="unsupported-kind {themeClass}">Unsupported kind</div>
</div>

<style>
	.list-container {
		position: relative;
		background-color: var(--bg-color);
		border: 1px solid var(--border-color);
		border-radius: 8px;
		padding: 16px;
	}

	.list-header {
		color: var(--text-color);
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid var(--border-light);
		padding-bottom: 8px;
	}

	.list-title {
		font-size: 1.1em;
		font-weight: 600;
		margin: 0;
	}

	.list-author {
		font-size: 0.9em;
		color: var(--text-secondary);
	}

	.list-content {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.pagination {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-top: 16px;
		border-top: 1px solid var(--border-light);
		padding-top: 12px;
	}

	.pagination-info {
		font-size: 0.85em;
		color: var(--text-color);
		text-align: center;
	}

	.pagination-controls {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 4px;
		flex-wrap: wrap;
	}

	.page-numbers {
		display: flex;
		gap: 2px;
		align-items: center;
		flex-shrink: 1;
		min-width: 0;
	}

	.pagination-btn {
		border: 1px solid var(--border-color);
		background: var(--background);
		color: var(--text-color);
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.2s ease;
		font-size: 0.85em;
		min-width: 0;
		flex-shrink: 0;
	}

	.nav-btn {
		padding: 6px 8px;
		font-weight: bold;
	}

	.page-btn {
		padding: 4px 8px;
		min-width: 32px;
	}

	.pagination-btn:hover:not(:disabled) {
		background: var(--background-hover);
		border-color: var(--border-hover);
	}

	.pagination-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.pagination-btn.active {
		background-color: var(--pagination-active-bg);
		color: var(--pagination-active-text);
		border-color: var(--pagination-active-border);
		font-weight: bold;
	}

	.pagination-ellipsis {
		padding: 4px 2px;
		color: var(--text-color);
		font-size: 0.85em;
		flex-shrink: 0;
	}

	.list-description {
		margin-top: 12px;
		padding-top: 8px;
		border-top: 1px solid var(--border-light);
		font-size: 0.9em;
		color: var(--text-color);
	}

	.list-summary-card {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		gap: 12px;
		margin-bottom: 16px;
	}

	.list-summary-image {
		width: 80px;
		height: 80px;
		object-fit: cover;
		border-radius: 8px;
		border: 1px solid var(--border-color);
		flex-shrink: 0;
	}

	.list-summary-text {
		display: flex;
		flex-direction: column;
		color: var(--text-color);
	}

	.list-summary-title {
		font-size: 1em;
		font-weight: bold;
		margin: 0 0 4px 0;
	}

	.list-summary-desc {
		font-size: 0.9em;
		color: var(--text-color);
		margin: 0;
	}

	.external-link {
		position: absolute;
		top: 0;
		right: 0;
		overflow: visible;
		display: flex;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		padding: 0;
		color: var(--external-link-color);
		opacity: 0.8;
		border-radius: 20%;
		transition: all 0.3s ease;
		transform: scale(1);
	}

	.external-link:hover {
		opacity: 1;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		transform: scale(1.1);
	}

	.unsupported-kind {
		color: var(--empty-color);
		font-style: italic;
	}

	/* スマホサイズでの調整 */
	@media (max-width: 480px) {
		.list-container {
			padding: 12px;
		}

		.pagination {
			gap: 6px;
		}

		.pagination-controls {
			gap: 3px;
			justify-content: space-between;
		}

		.page-numbers {
			gap: 1px;
		}

		.nav-btn {
			padding: 4px 6px;
			font-size: 0.8em;
		}

		.page-btn {
			padding: 3px 6px;
			min-width: 28px;
			font-size: 0.8em;
		}

		.pagination-ellipsis {
			padding: 3px 1px;
			font-size: 0.8em;
		}

		.pagination-info {
			font-size: 0.8em;
		}

		.list-summary-card {
			gap: 8px;
		}

		.list-summary-image {
			width: 60px;
			height: 60px;
		}

		.list-summary-title {
			font-size: 0.95em;
		}

		.list-summary-desc {
			font-size: 0.85em;
		}
	}

	/* 非常に小さい画面での調整 */
	@media (max-width: 320px) {
		.page-btn {
			min-width: 24px;
			padding: 2px 4px;
		}

		.nav-btn {
			padding: 3px 5px;
		}
	}
</style>
