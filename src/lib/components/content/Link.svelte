<script lang="ts">
	import 'nostr-web-components/style.css';
	let { href, children, themeClass } = $props();
</script>

<a {href} class={themeClass} target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">
	{@render children?.()}
</a>

<style>
	a {
		color: var(--link-color);
		text-decoration: underline;
	}

	a:hover {
		color: var(--link-hover-color);
	}
</style>
