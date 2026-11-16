<script lang="ts">
	import { formatBytes } from '$lib/utils/common';
	import { FileImage } from '@lucide/svelte';
	import { UploadStatus, type UploadTask } from './upload.types';
	import UploadTaskStatus from './upload-task-status.svelte';

	let { task }: { task: UploadTask } = $props();
</script>

<div class="flex gap-3 px-4 py-3">
	<div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
		<FileImage class="size-5 text-muted-foreground" />
	</div>

	<div class="min-w-0 flex-1 space-y-1.5">
		<div class="flex items-start justify-between gap-2">
			<p class="truncate text-sm font-medium" title={task.filename}>
				{task.filename}
			</p>
			<UploadTaskStatus status={task.status} />
		</div>

		<div class="flex items-center gap-1.5 text-xs text-muted-foreground">
			<span>{formatBytes(task.size)}</span>
		</div>

		{#if task.status === UploadStatus.FAILED && task.error}
			<p class="text-xs text-destructive">{task.error}</p>
		{/if}
	</div>
</div>
