<script lang="ts">
	import { photoService } from '$lib/api/photo-service';
	import * as Dialog from '$lib/components/ui/dialog';
	import { storageService } from '$lib/api/storage';
	import PhotoGrid from '$lib/components/photo/photo-grid.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Spinner } from '$lib/components/ui/spinner';
	import { useUserPhotosQuery } from '$lib/queries/use-user-photos';
	import { PhotoStatus, type PhotoInfo } from '$lib/types/photo';
	import { EllipsisVerticalIcon, LoaderIcon, PlusIcon, TrashIcon, XIcon } from '@lucide/svelte';
	import 'photoswipe/dist/photoswipe.css';
	import { toast } from 'svelte-sonner';
	import Header from '$lib/components/layout/header.svelte';
	import { infiniteScroll } from '$lib/utils/infinite-scroll';
	import { openPhotoViewer } from '$lib/utils/photo-viewer';
	import MoveToTrashDialog from '$lib/components/dialogs/photo/move-to-trash-dialog.svelte';

	const { query } = useUserPhotosQuery();
	const { isLoading, data } = $derived(query);
	let photos = $derived(data?.pages.flatMap((page) => page.items) ?? []);
	let showDeleteDialog = $state(false);
	let selectedIds = $state<number[]>([]);
	let selectionMode = $derived(selectedIds.length > 0);
	let optimisticIdCounter = 0;
	function generateOptimisticId() {
		return -++optimisticIdCounter;
	}
	async function handleFiles(files: FileList | null) {
		if (!files) return;

		const MAX_PHOTOS = 200;
		if (files.length > MAX_PHOTOS)
			return toast.error('You can only upload up to 50 photos at a time.');
		const validFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));
		const concurrentUploads = 5;
		for (let i = 0; i < validFiles.length; i += concurrentUploads) {
			const chunk = validFiles.slice(i, i + concurrentUploads);
			await Promise.allSettled(chunk.map(uploadPhoto));
		}
	}

	async function uploadPhoto(file: File) {
		const blob = URL.createObjectURL(file);
		const optimisticId = generateOptimisticId();
		const optimisticPhoto: PhotoInfo = {
			id: optimisticId,
			thumbnailUrl: blob,
			status: PhotoStatus.UPLOADING,
			uploadedAt: new Date().toISOString(),
			height: null,
			width: null,
			imageUrl: '',
			latitude: null,
			longitude: null,
			size: file.size,
			sourceSize: file.size,
			takenAt: null
		};

		photos = [{ ...optimisticPhoto }, ...photos];
		try {
			const { photoId, uploadUrl } = await photoService.createUpload({
				contentType: file.type,
				filename: file.name,
				size: file.size
			});
			await storageService.uploadFile(uploadUrl, file);
			await photoService.completeUpload(photoId);
		} catch (error) {
			photos = photos.filter((p) => p.id !== optimisticId);
			toast.error(`Failed to upload photo: ${file.name}`);
		}
	}

	function openPhoto(selectedPhoto: PhotoInfo) {
		openPhotoViewer(photos, selectedPhoto.id);
	}

	function clearSelection() {
		selectedIds = [];
	}
	async function handleMoveToTrash() {
		try {
			if (selectedIds.length === 0) return;
			await photoService.moveToTrash(selectedIds);
			photos = photos.filter((photo) => !selectedIds.includes(photo.id));
			selectedIds = [];
			showDeleteDialog = false;
		} catch (error) {
			toast.error('Failed to move photos to trash.');
			console.error('Error moving photos to trash:', error);
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
				<Button size="icon" variant="secondary">
					<PlusIcon />
				</Button>
				<Button onclick={() => (showDeleteDialog = true)} size="icon" variant="secondary">
					<TrashIcon />
				</Button>
				<Button size="icon" variant="secondary">
					<EllipsisVerticalIcon />
				</Button>
			</div>
		</div>
	{:else}
		<!-- Header -->
		<Header onFilesChanged={handleFiles} />
	{/if}

	{#if isLoading}
		<div class="flex-center min-h-60">
			<Spinner />
		</div>
	{/if}
	{#if photos.length > 0}
		<PhotoGrid {photos} onPhotoClick={openPhoto} bind:selectedIds bind:selectionMode />
	{/if}
	<div
		use:infiniteScroll={{
			onLoadMore: () => query.fetchNextPage(),
			hasNextPage: query.hasNextPage,
			isFetching: query.isFetchingNextPage
		}}
		class="flex min-h-16 items-center justify-center py-6"
	>
		{#if query.isFetchingNextPage}
			<LoaderIcon class="size-5 animate-spin" />
		{/if}
	</div>
</div>

<MoveToTrashDialog bind:open={showDeleteDialog} onConfirm={handleMoveToTrash} />
