<script lang="ts">
	import 'nostr-web-components/style.css';

	interface Props {
		name: undefined | string;
		href?: string | undefined;
		themeClass?: string | undefined;
	}
	let { name, href, themeClass }: Props = $props();
</script>

{#if href}<a
		{href}
		class={themeClass}
		target="_blank"
		rel="noopener noreferrer"
		referrerpolicy="no-referrer"
	>
		{#if name}
			{name}
		{:else}
			<div class="placeholder name"></div>
		{/if}
	</a>
{:else if name}
	{name}
{:else}
	<div class="placeholder name"></div>
{/if}

<style>
	.placeholder {
		display: inline-block;
		animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
		background-color: var(--placeholder-color);
		border-radius: 3px;
	}
	@keyframes pulse {
		50% {
			opacity: 0.5;
		}
	}

	.name {
		width: 80px;
		height: 14px;
	}
	a {
		display: inline;
		white-space: pre-wrap;
		word-break: normal;
		word-break: break-word;
		text-decoration: none;
		color: var(--text-base);
	}

	a:hover {
		text-decoration: underline;
	}
</style>
