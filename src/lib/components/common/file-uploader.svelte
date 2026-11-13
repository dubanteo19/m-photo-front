<script lang="ts">
	import { Upload } from '@lucide/svelte';
	let {
		onFilesChanged,
		multiple = true
	}: {
		onFilesChanged: (files: FileList | null) => void;
		multiple?: boolean;
	} = $props();

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		onFilesChanged(event.dataTransfer?.files ?? null);
	}
</script>

<label
	class="flex-center aspect-square bg-primary rounded-full p-2 cursor-pointer flex-col transition hover:bg-muted hover:text-primary"
	ondragover={(event) => event.preventDefault()}
	ondrop={handleDrop}
>
	<Upload size="16" />
	<input
		type="file"
		accept="image/*"
		{multiple}
		class="hidden"
		onchange={(event) => onFilesChanged(event.currentTarget.files)}
	/>
</label>
