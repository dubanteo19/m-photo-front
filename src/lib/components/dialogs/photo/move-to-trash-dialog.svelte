<script lang="ts">
	import ConfirmDialog from '../confirm-dialog.svelte';

	type Props = {
		open?: boolean;
		onConfirm: () => void;
	};

	let { open = $bindable(false), onConfirm }: Props = $props();
</script>

<ConfirmDialog
	bind:open
	title="Move to trash?"
	description="Are you sure you want to move this photo to trash"
	confirmText="Move to trash"
	{onConfirm}
/>
