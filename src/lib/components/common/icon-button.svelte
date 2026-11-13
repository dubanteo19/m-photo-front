<script lang="ts">
	import type { Component, ComponentProps } from 'svelte';
	import { Button } from '../ui/button';

	type Props = ComponentProps<typeof Button> & {
		label: string;
		icon: Component;
	};

	let { label, icon: Icon, children, ...rest }: Props = $props();
</script>

<Button {...rest}>
	<Icon />
	{#if children}
		{@render children()}
	{:else}
		<span>{label}</span>
	{/if}
</Button>
