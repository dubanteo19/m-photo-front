<script lang="ts">
	import { photoService } from '$lib/api/photo-service';
	import IconButton from '$lib/components/common/icon-button.svelte';
	import Header from '$lib/components/layout/header.svelte';
	import PhotoGrid from '$lib/components/photo/photo-grid.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Spinner } from '$lib/components/ui/spinner';
	import { useUserTrashedPhotosQuery } from '$lib/queries/use-trashed-photos';
	import { useUserPhotosQuery } from '$lib/queries/use-user-photos';
	import { useSidebar } from '$lib/stores/sidebar.svelte';
	import { type PhotoInfo } from '$lib/types/photo';
	import { RotateCcwIcon, TrashIcon, XIcon } from '@lucide/svelte';
	import PhotoSwipe from 'photoswipe';
	import 'photoswipe/dist/photoswipe.css';
	import { toast } from 'svelte-sonner';

	const sidebar = useSidebar();
	const { query } = useUserTrashedPhotosQuery();
	const { isLoading, data } = $derived(query);
	let photos = $derived(data?.pages.flatMap((page) => page.items) ?? []);
	let showDeleteDialog = $state(false);
	let showRestoreDialog = $state(false);
	let selectedIds = $state<number[]>([]);
	let selectionMode = $derived(selectedIds.length > 0);

	function openPhoto(selectedPhoto: PhotoInfo) {
		const dataSource = photos.map((photo) => {
			return {
				src: photo.imageUrl,
				width: photo.width ?? 800,
				height: photo.height ?? 600,
				alt: 'Chat attachment'
			};
		});

		// 3. Find active index
		const initialIndex = photos.findIndex((photo) => photo.id === selectedPhoto.id);
		// 4. Instantiate PhotoSwipe
		const pswp = new PhotoSwipe({
			dataSource,
			index: initialIndex >= 0 ? initialIndex : 0,
			imageClickAction: 'zoom-or-close',
			bgClickAction: 'close',
			wheelToZoom: true,
			secondaryZoomLevel: 1.5,
			maxZoomLevel: 3,
			bgOpacity: 0.95,
			loop: true,
			padding: { top: 20, bottom: 40, left: 100, right: 100 },
			closeOnVerticalDrag: true
		});

		pswp.init();
	}

	function clearSelection() {
		selectedIds = [];
	}

	async function handleRestore() {
		try {
			if (selectedIds.length === 0) return;
			await photoService.restoreFromTrash(selectedIds);
			photos = photos.filter((photo) => !selectedIds.includes(photo.id));
			selectedIds = [];
			showDeleteDialog = false;
		} catch (error) {
			toast.error('Failed to restore from trash.');
			console.error('Error restoring photos from trash:', error);
		}
	}
</script>

<div class="mx-auto w-full overflow-y-auto space-y-6 p-6">
	{#if selectionMode}
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-2">
				<Button size="icon" variant="secondary" onclick={clearSelection}>
					<XIcon />
				</Button>
				<span>{selectedIds.length} selected</span>
			</div>
			<div class="flex items-center gap-1">
				<IconButton
					label="Delete permanently"
					icon={TrashIcon}
					variant="secondary"
					onclick={() => (showDeleteDialog = true)}
				/>

				<IconButton
					label="Restore"
					icon={RotateCcwIcon}
					variant="secondary"
					onclick={() => (showRestoreDialog = true)}
				/>
			</div>
		</div>
	{:else}
		<!-- Header -->
		<Header />
	{/if}

	{#if isLoading}
		<div class="flex-center min-h-60">
			<Spinner />
		</div>
	{/if}
	{#if photos.length > 0}
		<PhotoGrid
			group={false}
			{photos}
			onPhotoClick={openPhoto}
			bind:selectedIds
			bind:selectionMode
		/>
	{/if}
</div>

<Dialog.Root open={showRestoreDialog} onOpenChange={(value) => (showRestoreDialog = value)}>
	<Dialog.Content class="rounded-3xl">
		<Dialog.Header>
			<Dialog.Title>Restore photos?</Dialog.Title>
			<Dialog.Description>Are you sure you want to restore these photos?</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button variant="secondary" onclick={() => (showRestoreDialog = false)}>Cancel</Button>
			<Button variant="destructive" onclick={handleRestore}>Restore</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
