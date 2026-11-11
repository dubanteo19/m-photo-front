import { photoService } from '$lib/api/photo-service';
import { createQuery } from '@tanstack/svelte-query';

export const USER_STATS_QUERY_KEY = ['user-photos'];

export function useUserStatsQuery() {
    const query = createQuery(() => ({
        queryKey: USER_STATS_QUERY_KEY,
        queryFn: () => photoService.getStorageStats(),
        staleTime: 1000 * 60 * 5
    }));

    return {
        query
    };
}