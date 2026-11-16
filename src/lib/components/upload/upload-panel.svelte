<script lang="ts">
	import { ChevronDown, ChevronUp, Upload } from '@lucide/svelte';

	import { UploadStatus, type UploadTask } from './upload.types';
	import UploadTaskItem from './upload-task-item.svelte';

	let { tasks = [] }: { tasks: UploadTask[] } = $props();

	const completedCount = $derived(tasks.filter((t) => t.status === UploadStatus.COMPLETED).length);

	const activeCount = $derived(
		tasks.filter(
			(t) =>
				t.status === UploadStatus.PENDING ||
				t.status === UploadStatus.UPLOADING ||
				t.status === UploadStatus.UPLOADED ||
				t.status === UploadStatus.PROCESSING
		).length
	);

	const failedCount = $derived(tasks.filter((t) => t.status === UploadStatus.FAILED).length);
</script>

{#if tasks.length > 0}
	<div
		class="fixed bottom-6 right-6 z-50 w-[min(350px,calc(100vw-2rem))] overflow-hidden rounded-xl bg-secondary text-muted-foreground border shadow-xl"
	>
		<header class="flex items-center justify-between border-b px-4 py-3">
			<div class="flex items-center gap-3">
				<div>
					<h3 class="text-sm font-semibold">
						{#if activeCount > 0}
							Uploading photos
						{:else}
							Uploads
						{/if}
					</h3>

					<p class="text-xs text-muted-foreground">
						{completedCount} of {tasks.length} completed
						{#if failedCount > 0}
							· {failedCount} failed
						{/if}
					</p>
				</div>
			</div>
		</header>

		<div class="max-h-80 divide-y overflow-y-auto">
			{#each tasks as task (task.id)}
				<UploadTaskItem {task} />
			{/each}
		</div>
	</div>
{/if}
