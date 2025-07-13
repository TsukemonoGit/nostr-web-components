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
		<audio
			aria-label="audio contents"
			controls
			{src}
			class=" max-h-80 max-w-[min(20rem,100%)] object-contain"
			onerror={() => (videoError = true)}><track default kind="captions" /></audio
		>
	</div>
{:else}
	<Link {themeClass} href={src}>{src}</Link>{/if}
