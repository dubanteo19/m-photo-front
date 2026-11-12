import { photoService } from '$lib/api/photo-service';
import type { PhotoPageResponse } from '$lib/types/photo';
import { createInfiniteQuery } from '@tanstack/svelte-query';

export const USER_PHOTOS_QUERY_KEY = ['user-photos'];

export function useUserPhotosQuery() {
    const query = createInfiniteQuery(() => ({
        queryKey: USER_PHOTOS_QUERY_KEY,
        queryFn: ({ pageParam }) => photoService.getPhotos(pageParam),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage: PhotoPageResponse) =>
            lastPage.nextCursor ?? undefined,
        staleTime: 1000 * 60 * 5
    }));

    return {
        query
    };
}