<script lang="ts">
	import type { PhotoInfo } from '$lib/types/photo';
	import { formatBytes } from '$lib/utils/common';
	import { CheckIcon, TicketIcon } from '@lucide/svelte';

	interface Props {
		photo: PhotoInfo;
		selected?: boolean;
		selectionMode?: boolean;
		onClick?: () => void;
		onToggleSelect?: () => void;
	}

	let { photo, selected = false, selectionMode = false, onClick, onToggleSelect }: Props = $props();
</script>

<div class="group relative aspect-square bg-muted">
	<button type="button" class="size-full" onclick={onClick} aria-label="Open photo">
		<img
			src={photo.thumbnailUrl}
			alt=""
			loading="lazy"
			class="size-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
		/>

		<div class="text-[0.625rem] md:text-xs flex px-2 gap-1">
			<p class=" line-through text-red-500">{formatBytes(photo.sourceSize)}</p>
			<p class="text-green-800">{formatBytes(photo.size)}</p>
		</div>
	</button>
	<!-- Selection overlay -->
	<button
		type="button"
		onclick={onToggleSelect}
		aria-label={selected ? 'Deselect photo' : 'Select photo'}
		class="absolute left-2 top-2 flex size-7 items-center justify-center rounded-full border border-white/80 bg-black/20 text-white shadow-sm transition-opacity"
		class:opacity-100={selected || selectionMode}
		class:opacity-0={!selected && !selectionMode}
		class:md:group-hover:opacity-100={!selected}
		class:bg-blue-500={selected}
	>
		{#if selected}
			<CheckIcon size={16} />
		{/if}
	</button>
</div>
