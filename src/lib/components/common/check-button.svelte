<script lang="ts">
	import { CheckIcon } from '@lucide/svelte';

	type Props = {
		selected: boolean;
		selectionMode: boolean;
		class?: string;
		onToggle: () => void;
	};

	let { selected, selectionMode, onToggle, class: className }: Props = $props();
</script>

<button
	type="button"
	onclick={onToggle}
	aria-label={selected ? 'Deselect photo' : 'Select photo'}
	class={className}
	class:opacity-100={selected || selectionMode}
	class:opacity-0={!selected && !selectionMode}
	class:md:group-hover:opacity-100={!selected}
	class:bg-blue-500={selected}
>
	{#if selected}
		<CheckIcon size={16} />
	{/if}
</button>
