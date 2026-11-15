<script lang="ts">
	import ConfirmDialog from '../confirm-dialog.svelte';

	type Props = {
		open?: boolean;
		onRestore: () => void;
	};

	let { open = $bindable(false), onRestore }: Props = $props();
</script>

<ConfirmDialog
	bind:open
	title="Restore photos?"
	description="Are you sure you want to restore these photos?"
	confirmText="Restore"
	onConfirm={onRestore}
/>
