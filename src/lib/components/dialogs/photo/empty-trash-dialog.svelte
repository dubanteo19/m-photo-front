<script lang="ts">
	import ConfirmDialog from '../confirm-dialog.svelte';

	type Props = {
		open?: boolean;
		onEmpty: () => void;
	};

	let { open = $bindable(false), onEmpty }: Props = $props();
</script>

<ConfirmDialog
	bind:open
	title="Empty trash?"
	description="Are you sure you want to empty trash?"
	confirmText="Empty"
	onConfirm={onEmpty}
/>
