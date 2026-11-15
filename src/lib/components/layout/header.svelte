<script lang="ts">
	import { Plus } from '@lucide/svelte';
	import { Input } from '../ui/input';
	import { Button } from '../ui/button';
	import FileUploader from '../common/file-uploader.svelte';
	import { useSidebar } from '$lib/stores/sidebar.svelte';
	type Props = {
		onFilesChanged?: (files: FileList | null) => void;
	};
	const sidebar = useSidebar();
	let { onFilesChanged }: Props = $props();
</script>

<div class="flex items-center justify-between">
	<Button onclick={sidebar.open} class="md:hidden {sidebar.isOpen ? 'hidden' : 'block'}" size="icon"
		>☰</Button
	>
	<div class="space-y-1 hidden md:block">
		<Input class="text-sm text-white" placeholder="Search photos..." />
	</div>
	<div class="flex items-center gap-2">
		<FileUploader onFilesChanged={(files) => onFilesChanged?.(files)} />
		<!-- <Button size="icon"> -->
		<!-- 	<Plus /> -->
		<!-- </Button> -->
	</div>
</div>
