<script lang="ts">
	import type { PhotoInfo } from '$lib/types/photo';

	interface Props {
		photo: PhotoInfo;
		thumbnail?: boolean;
		fit?: 'cover' | 'contain';
		aspectRatio?: string;
	}

	let { photo, thumbnail = true, fit = 'cover', aspectRatio = '1 / 1' }: Props = $props();

	let src = $derived(thumbnail ? photo.thumbnailUrl : photo.imageUrl);
</script>

<div class="relative w-full overflow-hidden rounded-lg bg-muted" style:aspect-ratio={aspectRatio}>
	{#if !photo.status}
		<img
			{src}
			alt={`Photo ${photo.id}`}
			loading="lazy"
			class="block size-full"
			class:object-cover={fit === 'cover'}
			class:object-contain={fit === 'contain'}
		/>
	{:else if photo.status === 'UPLOADING' || photo.status === 'PROCESSING'}
		<div
			class="absolute inset-0 flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground"
		>
			<span
				class="size-6 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary"
			></span>
			<span>
				{photo.status === 'UPLOADING' ? 'Uploading...' : 'Processing...'}
			</span>
		</div>
	{:else if photo.status === 'FAILED'}
		<div class="absolute inset-0 flex items-center justify-center text-sm text-destructive">
			Failed to process photo
		</div>
	{/if}
</div>
