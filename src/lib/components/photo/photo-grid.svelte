<script lang="ts">
	import type { PhotoInfo } from '$lib/types/photo';
	import PhotoGridItem from './photo-grid-item.svelte';

	interface Props {
		photos: PhotoInfo[];
		onPhotoClick?: (photo: PhotoInfo) => void;
	}

	let { photos, onPhotoClick }: Props = $props();

	let selectedIds = $state<number[]>([]);

	let selectionMode = $derived(selectedIds.length > 0);

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

	function handlePhotoClick(photo: PhotoInfo) {
		if (selectionMode) {
			toggleSelection(photo.id);
			return;
		}

		onPhotoClick?.(photo);
	}

	function clearSelection() {
		selectedIds = [];
	}
</script>

<div class="space-y-8">
	{#each groups as group}
		<section class="space-y-3">
			<h2 class="text-lg font-semibold tracking-tight">
				{group.title}
			</h2>

			<div
				class="grid grid-cols-3 gap-1 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7"
			>
				{#each group.photos as photo (photo.id)}
					<PhotoGridItem
						{photo}
						selected={selectedIds.includes(photo.id)}
						{selectionMode}
						onClick={() => handlePhotoClick(photo)}
						onToggleSelect={() => toggleSelection(photo.id)}
					/>
				{/each}
			</div>
		</section>
	{/each}
</div>
