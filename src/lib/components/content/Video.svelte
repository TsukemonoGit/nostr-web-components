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

<style>
	video {
		max-height: 18rem;
		max-width: min(18rem /* 288px */, 100%);
		overflow: hidden;
		object-fit: contain;
	}
</style>
