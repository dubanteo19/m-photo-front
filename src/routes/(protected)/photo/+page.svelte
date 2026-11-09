<script lang="ts">
	import { photoService } from '$lib/api/photo-service';
	import { storageService } from '$lib/api/storage';
	import FileUploader from '$lib/components/common/file-uploader.svelte';
	import { Button } from '$lib/components/ui/button';

	import { Spinner } from '$lib/components/ui/spinner';
	import { useUserPhotosQuery } from '$lib/queries/use-user-sticker';
	import { PhotoStatus, type PhotoInfo } from '$lib/types/photo';
	import { Plus, Trash2 } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	const { query } = useUserPhotosQuery();

	const { isLoading, data } = $derived(query);
	let photos = $derived(data?.pages.flatMap((page) => page.items) ?? []);
	let optimisticIdCounter = 0;
	function generateOptimisticId() {
		return -++optimisticIdCounter;
	}

	async function handleFiles(files: FileList | null) {
		if (!files) return;

		const MAX_PHOTOS = 50;
		if (files.length > MAX_PHOTOS)
			return toast.error('You can only upload up to 50 photos at a time.');
		const validFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));
		const concurrentUploads = 5;
		for (let i = 0; i < validFiles.length; i += concurrentUploads) {
			const chunk = validFiles.slice(i, i + concurrentUploads);
			await Promise.allSettled(chunk.map(uploadPhoto));
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
				takenAt: null
			};

			photos = [...photos, { ...optimisticPhoto }];
			try {
				// create upload
				const { photoId, uploadUrl } = await photoService.createUpload({
					contentType: file.type,
					filename: file.name,
					size: file.size
				});
				// upload file to storage
				await storageService.uploadFile(uploadUrl, file);

				const updatedPhoto = await photoService.completeUpload(photoId);
				photos = photos.map((p) => (p.id === optimisticId ? updatedPhoto : p));
			} catch (error) {
				photos = photos.filter((p) => p.id !== optimisticId);
				toast.error(`Failed to upload photo: ${file.name}`);
			}
		}
	}
</script>

<div class="mx-auto w-full max-w-4xl space-y-6 p-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div class="space-y-1">
			<p class="text-sm">Create and manage your sticker packages.</p>
		</div>

		<Button size="icon">
			<Plus />
		</Button>
	</div>
	{#if isLoading}
		<div class="flex-center min-h-60">
			<Spinner />
		</div>
	{/if}
	{#if photos.length > 0}
		<div class="grid gap-4 sm:grid-cols-2">
			{#each photos as photo (photo.id)}
				<div class="group relative aspect-square rounded-lg border bg-muted p-2">
					<img src={photo.thumbnailUrl} alt={'Sticker'} class="size-full object-contain" />
					{@render photoStatus(photo.status)}
					<Button
						class="absolute flex-center right-0 top-0 hidden rounded-full  group-hover:block"
						size="icon-sm"
						variant="destructive"
					>
						<Trash2 />
					</Button>
				</div>
			{/each}
		</div>
	{:else}
		<FileUploader label="Add stickers" onFilesChanged={handleFiles} />
	{/if}
</div>

<!-- <Dialog.Root
	open={packToDelete !== null}
	onOpenChange={(value) => {
		if (!value) packToDelete = null;
	}}
>
	<Dialog.Content onCloseAutoFocus={(event) => event.preventDefault()} class="rounded-3xl">
		<Dialog.Header>
			<Dialog.Title>Delete Pack?</Dialog.Title>
			<Dialog.Description>
				Are you sure you want to delete this sticker package? This action cannot be undone.
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button variant="secondary" onclick={() => (packToDelete = null)}>Cancel</Button>
			<Button variant="destructive" onclick={handleDeletePack}>Delete Pack</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root> -->

{#snippet photoStatus(status: PhotoStatus)}
	<div
		class="absolute bottom-1 right-1 rounded-lg bg-black/70 p-1 text-[10px] text-white"
		class:bg-green-700={status === PhotoStatus.READY}
		class:bg-blue-500={status === PhotoStatus.UPLOADING}
		class:bg-yellow-500={status === PhotoStatus.PROCESSING}
		class:bg-red-500={status === PhotoStatus.FAILED}
	>
		{status}
	</div>
{/snippet}
