<script lang="ts">
	import { Display, Theme, UserProfile } from 'nostr-web-components/types';
	import * as Nostr from 'nostr-typedef';

	import RepostDisplay from './RepostDisplay.svelte';
	import EventDisplay from './EventDisplay.svelte';

	interface Props {
		note: Nostr.Event | null;
		profile: UserProfile | null;
		className: string;
		themeClass: string;
		noLink: boolean;
		height: string | undefined;
		display: Display;
		linkUrl: string | undefined;
		target: string;
		href: string | null;
		theme: Theme;
	}

	let {
		note,
		profile,
		className,
		themeClass,
		noLink,
		height,
		display,
		linkUrl,
		target,
		href,
		theme
	}: Props = $props();
</script>

{#if note && (note.kind === 6 || note.kind === 16)}
	<RepostDisplay
		{note}
		{profile}
		{themeClass}
		{height}
		{noLink}
		{linkUrl}
		{display}
		{className}
		{target}
		{href}
		{theme}
	/>{:else}
	<EventDisplay
		{note}
		{profile}
		{themeClass}
		{height}
		{noLink}
		{linkUrl}
		{display}
		{className}
		{target}
		{href}
		{theme}
	/>
{/if}
