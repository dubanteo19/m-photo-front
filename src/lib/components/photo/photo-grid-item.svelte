<script lang="ts">
	import type { PhotoInfo } from '$lib/types/photo';
	import { formatBytes, getPressOption } from '$lib/utils/common';
	import { usePress } from 'svelte-gestures';
	import CheckButton from '../common/check-button.svelte';

	interface Props {
		photo: PhotoInfo;
		selected?: boolean;
		selectionMode?: boolean;
		onClick?: () => void;
		onToggleSelect: () => void;
	}

	let { photo, selected = false, selectionMode = false, onClick, onToggleSelect }: Props = $props();
</script>

<div class="group relative aspect-square bg-muted">
	<button
		{...usePress(onToggleSelect, getPressOption)}
		type="button"
		class="size-full"
		onclick={onClick}
		aria-label="Open photo"
	>
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
	<CheckButton
		class="absolute left-2 top-2 flex-center size-7 rounded-full border border-white/80 bg-black/20 text-white shadow-sm transition-opacity"
		{selected}
		onToggle={onToggleSelect}
		{selectionMode}
	/>
</div>
