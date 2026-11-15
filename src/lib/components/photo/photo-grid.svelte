<script lang="ts">
	import type { PhotoInfo } from '$lib/types/photo';
	import { Check } from '@lucide/svelte';
	import CheckButton from '../common/check-button.svelte';
	import PhotoGridItem from './photo-grid-item.svelte';

	interface Props {
		photos: PhotoInfo[];
		onPhotoClick?: (photo: PhotoInfo) => void;
		selectedIds?: number[];
		selectionMode?: boolean;
		group?: boolean;
	}

	let {
		photos,
		onPhotoClick,
		selectedIds = $bindable([]),
		selectionMode = $bindable(false),
		group = true
	}: Props = $props();

	let groups = $derived.by(() => {
		const map = new Map<string, PhotoInfo[]>();

		for (const photo of photos) {
			const date = new Date(photo.takenAt ?? photo.uploadedAt);
			const key = `${date.getFullYear()}-${date.getMonth()}`;

			if (!map.has(key)) {
				map.set(key, []);
			}

			map.get(key)!.push(photo);
		}

		return Array.from(map.entries()).map(([key, items]) => {
			const [year, month] = key.split('-').map(Number);
			const date = new Date(year, month);

			return {
				title: date.toLocaleDateString('en-US', {
					month: 'long',
					year: 'numeric'
				}),
				photos: items
			};
		});
	});

	function toggleSelection(id: number) {
		selectedIds = selectedIds.includes(id)
			? selectedIds.filter((item) => item !== id)
			: [...selectedIds, id];
	}

	function toggleGroup(ids: number[]) {
		const allSelected = isGroupSelected(ids);
		selectedIds = allSelected
			? selectedIds.filter((id) => !ids.includes(id))
			: [...new Set([...selectedIds, ...ids])];
	}

	function handlePhotoClick(photo: PhotoInfo) {
		if (selectionMode) {
			toggleSelection(photo.id);
			return;
		}

		onPhotoClick?.(photo);
	}
	function isGroupSelected(ids: number[]) {
		return ids.every((id) => selectedIds.includes(id));
	}
</script>

<div class="space-y-8">
	{#if !group}
		{@render photoList(photos)}
	{:else}
		{#each groups as group}
			{@const groupPhotoIds = group.photos.map((p) => p.id)}
			{@const groupSelected = groupPhotoIds.every((id) => selectedIds.includes(id))}

			<section class="space-y-3">
				<div class="flex gap-2">
					<CheckButton
						class="flex-center size-7  rounded-full border border-white/80 bg-black/20 opacity-100!  shadow-sm transition-opacity"
						onToggle={() => toggleGroup(groupPhotoIds)}
						selected={groupSelected}
						{selectionMode}
					/>
					<h2 class="text-lg font-semibold tracking-tight">
						{group.title}
					</h2>
				</div>
				{@render photoList(group.photos)}
			</section>
		{/each}
	{/if}
</div>
{#snippet photoList(photos: PhotoInfo[])}
	<div
		class="grid grid-cols-3 gap-1 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8"
	>
		{#each photos as photo (photo.id)}
			<PhotoGridItem
				{photo}
				selected={selectedIds.includes(photo.id)}
				{selectionMode}
				onClick={() => handlePhotoClick(photo)}
				onToggleSelect={() => toggleSelection(photo.id)}
			/>
		{/each}
	</div>
{/snippet}
