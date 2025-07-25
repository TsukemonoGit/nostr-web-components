<script lang="ts">
	import TriangleAlert from './TriangleAlert.svelte';

	interface Props {
		text: string;
	}

	let { text }: Props = $props();

	let value = $state(0);
</script>

<div
	class="blur-overlay"
	style="backdrop-filter: blur({(1 - value / 100) ** 2 * 30}px); {value >= 50
		? 'pointer-events: none;'
		: ''}"
>
	<!-- スクロール可能なテキスト領域 -->
	<div
		class="blur-warning"
		style="opacity:{1 - value / 100}; text-shadow: 0.5px 0.5px 1px rgb(0 0 0);"
	>
		<TriangleAlert size="16" />WARNING<TriangleAlert size="16" />
	</div>

	<div
		class="blur-text"
		style="opacity:{1 - value / 100}; text-shadow: 0.5px 0.5px 1px rgb(0 0 0);"
	>
		{text ?? ''}
	</div>
</div>
<div class="blur-bar">
	<input type="range" min="0" max="100" bind:value class="blur-slider" />
</div>

<style>
	.blur-overlay {
		box-sizing: border-box;
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		border-radius: 0.375rem; /* rounded-md */
		border: 1px solid var(--error-text);
	}

	.blur-warning {
		position: absolute;
		top: 0;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.25rem;
		font-size: 0.75rem; /* text-xs */
		font-weight: bold;
		color: var(--error-text);
	}

	.blur-text {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		max-height: calc(100% - 24px);
		width: 100%;
		overflow-y: auto;
		text-align: center;
		font-size: 0.875rem;
		color: var(--text-color);
	}
	.blur-bar {
		position: relative;
		display: flex;
		height: 24px;
		width: calc(100% - 24px);
		margin-left: auto;
		margin-right: auto;
		align-items: center;
		bottom: 8px;
	}
	.blur-slider {
		flex: 1;
		height: 3px;
		border-radius: 4px;
		background: var(--link-color);
		outline: none;
		-webkit-appearance: none;
		appearance: none;
		cursor: pointer;
		margin-top: auto;
	}

	.blur-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: var(--link-hover-color);
		cursor: pointer;
		border: 3px solid #fff;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
	}

	.blur-slider::-moz-range-thumb {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: var(--link-hover-color);
		cursor: pointer;
		border: 3px solid #fff;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
	}
</style>
