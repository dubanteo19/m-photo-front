<script>
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { formatBytes } from '$lib/utils/common';
	import { CalendarIcon, ImageIcon, MapPinIcon } from '@lucide/svelte';
	let { photo = $bindable(null) } = $props();
</script>

<Sheet.Root open={photo !== null} onOpenChange={() => (photo = null)}>
	<Sheet.Content class="z-100010">
		<Sheet.Header>
			<Sheet.Title>Photo information</Sheet.Title>
			<Sheet.Description>Details about this photo.</Sheet.Description>
		</Sheet.Header>
		<div class="flex flex-col gap-6 p-4">
			{#if photo}
				<div class="flex gap-4">
					<CalendarIcon />
					<div class="flex flex-col gap-1">
						<p>{photo.takenAt}</p>
					</div>
				</div>
				<div class="flex gap-4">
					<ImageIcon />
					<div class="flex flex-col gap-1">
						<p>{photo.id}</p>
						<div>
							<span class="line-through">{formatBytes(photo.sourceSize)}</span>
							<span>{formatBytes(photo.size)}</span>
							<span>{photo.width} x {photo.height}</span>
						</div>
					</div>
				</div>
				{#if photo.latitude && photo.longitude}
					<div class="flex gap-4">
						<MapPinIcon />
						<div class="flex flex-col gap-1">
							<p>Latitude: {photo.latitude}</p>
							<p>Longitude: {photo.longitude}</p>
						</div>
					</div>
				{/if}
			{/if}
		</div>
	</Sheet.Content>
</Sheet.Root>
