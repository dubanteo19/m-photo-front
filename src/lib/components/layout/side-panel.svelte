<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { authService } from '$lib/api/auth';
	import { Button } from '$lib/components/ui/button';
	import { useUserStatsQuery } from '$lib/queries/use-user-stats';
	import { useUser } from '$lib/stores/auth.svelte';
	import { useSidebar } from '$lib/stores/sidebar.svelte';
	import { AlbumIcon, ImageIcon, TrashIcon } from '@lucide/svelte';
	import StorageStats from '../photo/storageStats.svelte';
	import { Spinner } from '../ui/spinner';
	import { useQueryClient } from '@tanstack/svelte-query';
	import IconButton from '../common/icon-button.svelte';
	import type { Component } from 'svelte';
	import { page } from '$app/state';
	const { query } = useUserStatsQuery();
	const { data: stats, isLoading } = $derived(query);
	const sidebar = useSidebar();
	const queryClient = useQueryClient();
	const user = useUser();
	const { currentUser } = $derived(user);
	type NavItem = {
		label: string;
		href: string;
		icon: Component;
	};
	const navLinks: NavItem[] = [
		{ label: 'Photos', icon: ImageIcon, href: '/photo' },
		{ label: 'Alumbs', icon: AlbumIcon, href: '/album' },
		{ label: 'Trashs', icon: TrashIcon, href: '/trash' }
	];

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
	<div>
		<h1 class="text-center mt-4">M-Photo</h1>
		<nav class="px-2 py-4 gap-1 flex flex-col items-baseline justify-between">
			{#each navLinks as item}
				{@const active = page.url.pathname === item.href}
				<a href={item.href} class="w-full">
					<IconButton
						label={item.label}
						class="w-full"
						variant={active ? 'default' : 'outline'}
						icon={item.icon}
					/>
				</a>
			{/each}
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
