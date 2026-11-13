<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { authService } from '$lib/api/auth';
	import { Button } from '$lib/components/ui/button';
	import { useUserStatsQuery } from '$lib/queries/use-user-stats';
	import { useUser } from '$lib/stores/auth.svelte';
	import { useSidebar } from '$lib/stores/sidebar.svelte';
	import { ImageIcon, TrashIcon } from '@lucide/svelte';
	import StorageStats from '../photo/storageStats.svelte';
	import { Spinner } from '../ui/spinner';
	import { useQueryClient } from '@tanstack/svelte-query';
	const { query } = useUserStatsQuery();
	const { data: stats, isLoading } = $derived(query);
	const sidebar = useSidebar();
	const queryClient = useQueryClient();
	const user = useUser();
	const { currentUser } = $derived(user);
	async function handleLogout() {
		await authService.logout();
		queryClient.clear();
		await goto(resolve('/login'));
	}
</script>

<aside
	class="
		fixed inset-y-0 left-0 z-50
		flex h-full min-h-0 w-56 md:w-64 shrink-0 flex-col
		border-r bg-sidebar
		justify-between
		transition-transform duration-200 ease-in-out
		{sidebar.isOpen ? 'translate-x-0' : '-translate-x-full'}
		md:static md:translate-x-0 md:transition-none
	"
>
	<Button
		onclick={() => sidebar.open()}
		class="fixed md:hidden translate-x-58 translate-y-6 z-50 {sidebar.isOpen ? 'hidden' : 'block'}"
		size="icon"
		aria-label="Open sidebar">☰</Button
	>
	<div>
		<h1 class="text-center mt-4">M-Photo</h1>
		<nav class="px-2 py-4 gap-1 flex flex-col items-baseline justify-between">
			<Button variant="outline" class="flex gap-2 w-full" onclick={() => goto(resolve('/photo'))}>
				<ImageIcon />
				<h3 class="flex-1 flex">Photos</h3>
			</Button>
			<Button variant="outline" class="flex  gap-2 w-full" onclick={() => goto(resolve('/photo'))}>
				<ImageIcon />
				<h3 class="flex-1 flex">Albums</h3>
			</Button>
			<Button variant="outline" class="flex  gap-2 w-full" onclick={() => goto(resolve('/trash'))}>
				<TrashIcon size="20" />
				<h3 class="flex-1 flex">Trash</h3>
			</Button>
		</nav>
	</div>
	<div>
		<div class="p-2">
			{#if isLoading}
				<div class="flex-center min-h-60">
					<Spinner />
				</div>
			{/if}
			{#if stats}
				<StorageStats {stats} />
			{/if}
		</div>
		<div class="p-4 border-t flex shrink-0 items-center justify-between">
			<div class="truncate mr-2">
				<span class="text-sm">
					{currentUser.username}
				</span>
			</div>
			<Button onclick={handleLogout} size="sm" variant="secondary">Logout</Button>
		</div>
	</div>
</aside>
