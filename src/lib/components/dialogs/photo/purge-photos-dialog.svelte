<script lang="ts">
	import ConfirmDialog from '../confirm-dialog.svelte';

	type Props = {
		open?: boolean;
		onPurge: () => void;
	};

	let { open = $bindable(false), onPurge }: Props = $props();
</script>

<ConfirmDialog
	bind:open
	title="Permanently delete photos?"
	description="Are you sure you want to permanently delete these photos?"
	confirmText="Delete"
	onConfirm={onPurge}
/>
