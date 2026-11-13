<script lang="ts">
	import { Plus } from '@lucide/svelte';
	import { Input } from '../ui/input';
	import { Button } from '../ui/button';
	import FileUploader from '../common/file-uploader.svelte';
	type Props = {
		onFilesChanged?: (files: FileList | null) => void;
	};
	let { onFilesChanged }: Props = $props();
</script>

<div class="flex items-center justify-end md:justify-between ml-6 md:ml-0">
	<div class="space-y-1 hidden md:block">
		<Input class="text-sm text-white" placeholder="Search photos..." />
	</div>
	<div class="flex items-center gap-2">
		<FileUploader onFilesChanged={(files) => onFilesChanged?.(files)} />
		<Button size="icon">
			<Plus />
		</Button>
	</div>
</div>
