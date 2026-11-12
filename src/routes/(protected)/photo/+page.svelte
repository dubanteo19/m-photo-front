<script lang="ts">
	import { photoService } from '$lib/api/photo-service';

	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { authService } from '$lib/api/auth';
	import { storageService } from '$lib/api/storage';
	import FileUploader from '$lib/components/common/file-uploader.svelte';
	import PhotoGrid from '$lib/components/photo/photo-grid.svelte';
	import StorageStats from '$lib/components/photo/storageStats.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Spinner } from '$lib/components/ui/spinner';
	import { useUserPhotosQuery } from '$lib/queries/use-user-photos';
	import { useUserStatsQuery } from '$lib/queries/use-user-stats';
	import { PhotoStatus, type PhotoInfo } from '$lib/types/photo';
	import { Plus } from '@lucide/svelte';
	import PhotoSwipe from 'photoswipe';
	import 'photoswipe/dist/photoswipe.css';
	import { toast } from 'svelte-sonner';
	import { useUser } from '$lib/stores/auth.svelte';
	const { query } = useUserPhotosQuery();
	const { query: userStatsQuery } = useUserStatsQuery();
	const { isLoading, data } = $derived(query);
	let photos = $derived(data?.pages.flatMap((page) => page.items) ?? []);
	console.log('photos', data);
	let { data: stats, isLoading: isStatsLoading } = $derived(userStatsQuery);
	const user = useUser();
	const { currentUser } = $derived(user);
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

			await photoService.completeUpload(photoId);
		} catch (error) {
			photos = photos.filter((p) => p.id !== optimisticId);
			toast.error(`Failed to upload photo: ${file.name}`);
		}
	}

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

	async function handleLogout() {
		await authService.logout();
		await goto(resolve('/login'));
	}
</script>

<div class="mx-auto w-full max-w-4xl overflow-y-auto space-y-6 p-6">
	<div class="flex items-center justify-between">
		<span>Hi {currentUser.username}!</span>
		<Button onclick={handleLogout} size="sm" variant="secondary">Logout</Button>
	</div>
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div class="space-y-1">
			<p class="text-sm">Create and manage your sticker packages.</p>
		</div>

		<Button size="icon">
			<Plus />
		</Button>
	</div>

	<div>
		{#if isStatsLoading}
			<Spinner />
		{/if}
		{#if stats}
			<StorageStats {stats} />
		{/if}
	</div>

	<div class="flex w-full">
		<FileUploader label="add photo" onFilesChanged={handleFiles} />
	</div>
	{#if isLoading}
		<div class="flex-center min-h-60">
			<Spinner />
		</div>
	{/if}
	{#if photos.length > 0}
		<PhotoGrid {photos} onPhotoClick={openPhoto} />
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
