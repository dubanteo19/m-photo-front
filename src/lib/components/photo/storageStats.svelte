<script lang="ts">
	import type { AccountStorageStats } from '$lib/api/photo-service';
	import { formatBytes } from '$lib/utils/common';

	let { stats }: { stats: AccountStorageStats } = $props();
</script>

<div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950">
	<!-- Header -->
	<div class="mb-5 flex items-center justify-between">
		<h3 class="text-sm font-semibold text-gray-900 dark:text-white">Storage overview</h3>
		<span
			class="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-400"
		>
			{stats.photoCount.toLocaleString()} photos optimized
		</span>
	</div>

	<!-- Statistics -->
	<div class="grid grid-cols-2 gap-x-2 gap-y-3 py-2">
		<div>
			<p class="mb-1 text-xs text-gray-500 dark:text-gray-400">Original size</p>
			<p class="text-xl font-semibold tabular-nums text-red-500 dark:text-white">
				{formatBytes(stats.originalBytes)}
			</p>
		</div>

		<div>
			<p class="mb-1 text-xs text-gray-500 dark:text-gray-400">Stored size</p>
			<p class="text-xl font-semibold tabular-nums text-gray-900 dark:text-white">
				{formatBytes(stats.storedBytes)}
			</p>
		</div>

		<div>
			<p class="mb-1 text-xs text-gray-500 dark:text-gray-400">Storage saved</p>
			<p class="text-xl font-semibold tabular-nums text-green-600 dark:text-green-400">
				{formatBytes(stats.savedBytes)}
			</p>
		</div>

		<div>
			<p class="mb-1 text-xs text-gray-500 dark:text-gray-400">Compression</p>
			<p class="text-xl font-semibold tabular-nums text-gray-900 dark:text-white">
				{stats.compressionPercentage.toFixed(1)}%
			</p>
		</div>
	</div>
</div>
