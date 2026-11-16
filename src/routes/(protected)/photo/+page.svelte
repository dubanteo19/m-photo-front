<script lang="ts">
	import { photoService } from '$lib/api/photo-service';
	import { storageService } from '$lib/api/storage';
	import MoveToTrashDialog from '$lib/components/dialogs/photo/move-to-trash-dialog.svelte';
	import Header from '$lib/components/layout/header.svelte';
	import PhotoGrid from '$lib/components/photo/photo-grid.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Spinner } from '$lib/components/ui/spinner';
	import UploadPanel from '$lib/components/upload/upload-panel.svelte';
	import { UploadStatus, type UploadTask } from '$lib/components/upload/upload.types';
	import { useUserPhotosQuery } from '$lib/queries/use-user-photos';
	import { UserEvent, userEventService } from '$lib/services/user-event.svelte';
	import { type PhotoInfo } from '$lib/types/photo';
	import { infiniteScroll } from '$lib/utils/infinite-scroll';
	import { openPhotoViewer } from '$lib/utils/photo-viewer';
	import { EllipsisVerticalIcon, LoaderIcon, PlusIcon, TrashIcon, XIcon } from '@lucide/svelte';
	import 'photoswipe/dist/photoswipe.css';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	const { query, moveToTrash } = useUserPhotosQuery();
	const { isLoading, data } = $derived(query);
	let photos = $derived(data?.pages.flatMap((page) => page.items) ?? []);
	let showDeleteDialog = $state(false);
	let selectedIds = $state<number[]>([]);
	let uploadTasks = $state<UploadTask[]>([]);
	let selectionMode = $derived(selectedIds.length > 0);
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

	onMount(() => {
		const handlePhotoProcessed = (payload: PhotoInfo) => {
			photos = [payload, ...photos];
			updateTaskStatus(payload.id, UploadStatus.COMPLETED);
		};
		return userEventService.subscribe(UserEvent.PHOTO_PROCESSED, handlePhotoProcessed);
	});

	function addTask(task: UploadTask) {
		uploadTasks = [...uploadTasks, task];
	}

	function updateTaskStatus(photoId: number, status: UploadStatus) {
		uploadTasks = uploadTasks.map((task) => (task.id === photoId ? { ...task, status } : task));
	}

	async function uploadPhoto(file: File) {
		try {
			const { photoId, uploadUrl } = await photoService.createUpload({
				contentType: file.type,
				filename: file.name,
				size: file.size
			});
			addTask({
				id: photoId,
				filename: file.name,
				status: UploadStatus.UPLOADING,
				size: file.size
			});
			await storageService.uploadFile(uploadUrl, file);
			updateTaskStatus(photoId, UploadStatus.UPLOADED);
			await photoService.completeUpload(photoId);
			updateTaskStatus(photoId, UploadStatus.PROCESSING);
		} catch (error) {
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
			await moveToTrash(selectedIds);
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
	{:else}
		<h3 class="text-center">Gallary is empty! Start upload now</h3>
	{/if}
	<div
		use:infiniteScroll={{
			onLoadMore: query.fetchNextPage,
			hasNextPage: query.hasNextPage,
			isFetching: query.isFetchingNextPage
		}}
		class="flex min-h-16 items-center justify-center py-6"
	>
		{#if query.isFetchingNextPage}
			<LoaderIcon class="size-5 animate-spin" />
		{/if}
	</div>
	<UploadPanel tasks={uploadTasks} />
</div>

<MoveToTrashDialog bind:open={showDeleteDialog} onConfirm={handleMoveToTrash} />
