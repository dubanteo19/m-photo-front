<script lang="ts">
	import { UploadStatus } from "./upload.types";

	let { status }: { status: UploadStatus } = $props();

	const config = {
		[UploadStatus.PENDING]: {
			label: 'Waiting',
			class: 'bg-muted text-muted-foreground'
		},
		[UploadStatus.UPLOADING]: {
			label: 'Uploading',
			class: 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
		},
		[UploadStatus.UPLOADED]: {
			label: 'Uploaded',
			class: 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
		},
		[UploadStatus.PROCESSING]: {
			label: 'Processing',
			class: 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
		},
		[UploadStatus.COMPLETED]: {
			label: 'Completed',
			class: 'bg-green-500/10 text-green-600 dark:text-green-400'
		},
		[UploadStatus.FAILED]: {
			label: 'Failed',
			class: 'bg-destructive/10 text-destructive'
		}
	};

	const isActive = $derived(
		status === UploadStatus.UPLOADING || status === UploadStatus.PROCESSING
	);
</script>

<span
	class="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium {config[
		status
	].class}"
>
	{#if isActive}
		<span class="size-3 animate-spin rounded-full border-2 border-current border-r-transparent"
		></span>
	{:else if status === UploadStatus.COMPLETED}
		<span class="text-xs">✓</span>
	{:else if status === UploadStatus.FAILED}
		<span>!</span>
	{:else}
		<span class="size-1.5 rounded-full bg-current"></span>
	{/if}

	{config[status].label}
</span>
