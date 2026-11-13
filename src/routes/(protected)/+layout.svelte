<script lang="ts">
	import SidePanel from '$lib/components/layout/side-panel.svelte';
	import { setProtectedUser } from '$lib/stores/auth.svelte';
	import { initSidebar } from '$lib/stores/sidebar.svelte.js';

	let { data, children } = $props();

	const sidebar = initSidebar();
	setProtectedUser(data.user);
	// onMount(() => {
	// 	userEventService.connect();
	// 	return () => {
	// 		userEventService.disconnect();
	// 	};
	// });
</script>

<div class="app flex min-h-0 h-screen overflow-hidden">
	{#if sidebar.isOpen}
		<!-- Backdrop -->
		<button
			type="button"
			aria-label="Close sidebar"
			class="fixed inset-0 z-40 bg-black/40 md:hidden"
			onclick={() => sidebar.close()}
		></button>
	{/if}
	<SidePanel />
	<main class="flex-1 flex flex-col min-h-0 overflow-hidden">
		{@render children()}
	</main>
</div>
