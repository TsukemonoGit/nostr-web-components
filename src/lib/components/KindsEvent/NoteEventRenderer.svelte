<script lang="ts">
	import type { Display, Status, Theme, UserProfile } from 'nostr-web-components/types';
	import * as Nostr from 'nostr-typedef';
	import Kind1 from './Kind1.svelte';
	import Repost from './Repost.svelte';
	import Reaction from './Reaction.svelte';

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
		status: Status;
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
		theme,
		status
	}: Props = $props();
</script>

{#if note && (note.kind === 6 || note.kind === 16)}
	<Repost
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
	/>{:else if note && note.kind === 7}
	<Reaction
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
{:else}
	<Kind1
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
		{status}
	/>
{/if}
