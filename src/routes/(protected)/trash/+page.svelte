<script lang="ts">
	import { photoService } from '$lib/api/photo-service';
	import IconButton from '$lib/components/common/icon-button.svelte';
	import EmptyTrashDialog from '$lib/components/dialogs/photo/empty-trash-dialog.svelte';
	import PurgePhotosDialog from '$lib/components/dialogs/photo/purge-photos-dialog.svelte';
	import RestorePhotosDialog from '$lib/components/dialogs/photo/restore-photos-dialog.svelte';
	import PhotoGrid from '$lib/components/photo/photo-grid.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Spinner } from '$lib/components/ui/spinner';
	import { useUserTrashedPhotosQuery } from '$lib/queries/use-trashed-photos';
	import { useSidebar } from '$lib/stores/sidebar.svelte';
	import { type PhotoInfo } from '$lib/types/photo';
	import { openPhotoViewer } from '$lib/utils/photo-viewer';
	import { RotateCcwIcon, TrashIcon, XIcon } from '@lucide/svelte';
	import 'photoswipe/dist/photoswipe.css';
	import { toast } from 'svelte-sonner';
	const sidebar = useSidebar();
	const { query } = useUserTrashedPhotosQuery();
	const { isLoading, data } = $derived(query);
	let photos = $derived(data?.pages.flatMap((page) => page.items) ?? []);
	let showPurgeDialog = $state(false);
	let showRestoreDialog = $state(false);
	let showEmptyDialog = $state(false);
	let selectedIds = $state<number[]>([]);
	let selectionMode = $derived(selectedIds.length > 0);

	function openPhoto(selectedPhoto: PhotoInfo) {
		openPhotoViewer(photos, selectedPhoto.id);
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
			showRestoreDialog = false;
		} catch (error) {
			toast.error('Failed to restore from trash.');
			console.error('Error restoring photos from trash:', error);
		}
	}

	async function handlePurge() {
		try {
			if (selectedIds.length === 0) return;
			await photoService.purge(selectedIds);
			photos = photos.filter((photo) => !selectedIds.includes(photo.id));
			selectedIds = [];
			showPurgeDialog = false;
		} catch (error) {
			toast.error('Failed to permanently delete photos.');
			console.error('Error deleting photos from trash:', error);
		}
	}

	async function handleEmpty() {
		try {
			const photoIds = photos.map((photo) => photo.id);
			if (photos.length === 0) return;
			await photoService.purge(photoIds);
			photos = [];
			showEmptyDialog = false;
		} catch (error) {
			toast.error('Failed to empty trash.');
			console.error('Error emptying trash:', error);
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
					label="Delete "
					icon={TrashIcon}
					variant="secondary"
					onclick={() => (showPurgeDialog = true)}
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
		<div class="flex items-center justify-between">
			<Button
				onclick={sidebar.open}
				class="md:hidden {sidebar.isOpen ? 'hidden' : 'block'}"
				size="icon">☰</Button
			>
			<div class="flex items-center gap-2">
				<IconButton
					onclick={() => (showEmptyDialog = true)}
					variant="secondary"
					label="Empty "
					icon={TrashIcon}
				/>
			</div>
		</div>
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
	{:else}
		<div>No items in trash</div>
	{/if}
</div>

<RestorePhotosDialog bind:open={showRestoreDialog} onRestore={handleRestore} />
<PurgePhotosDialog bind:open={showPurgeDialog} onPurge={handlePurge} />
<EmptyTrashDialog bind:open={showEmptyDialog} onEmpty={handleEmpty} />
