<script lang="ts">
	import Link from './Link.svelte';

	let videoError: boolean = $state(false);
	interface Props {
		src: string;
		themeClass?: string | undefined;
	}

	let { src, themeClass }: Props = $props();
</script>

{#if !videoError}<div>
		<video
			aria-label="video contents"
			width="288"
			height="200"
			class="max-h-[18rem] max-w-[min(18rem,100%)] overflow-hidden object-contain"
			{src}
			controls
			preload="metadata"
			onerror={() => (videoError = true)}
			><track default kind="captions" />
			Sorry, your browser doesn't support embedded videos.
		</video>
	</div>
{:else}
	<Link {themeClass} href={src}>{src}</Link>{/if}
