<script lang="ts">
	import type { PhotoInfo } from '$lib/types/photo';
	import { formatFileSize } from '$lib/utils/common';

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

		<div class=" text-xs text-red-500">
			<p class="text-xs line-through text-red-500">{formatFileSize(photo.sourceSize)}</p>
			<p class="text-green-800">{formatFileSize(photo.size)}</p>
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
	>
		{#if selected}
			<span
				class="flex size-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white"
			>
				✓
			</span>
		{:else}
			<span class="size-5 rounded-full border-2 border-white bg-black/10"></span>
		{/if}
	</button>

	{#if selected}
		<div class="pointer-events-none absolute inset-0 border-4 border-blue-500 bg-blue-500/10"></div>
	{/if}
</div>
