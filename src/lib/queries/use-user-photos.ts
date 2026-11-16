import { photoService } from '$lib/api/photo-service';
import type { InfiniteData } from '@tanstack/svelte-query';
import type { PhotoPageResponse } from '$lib/types/photo';
import { createInfiniteQuery, useQueryClient } from '@tanstack/svelte-query';

export const USER_PHOTOS_QUERY_KEY = ['user-photos'];

export function useUserPhotosQuery() {
	const queryClient = useQueryClient();

	const query = createInfiniteQuery(() => ({
		queryKey: USER_PHOTOS_QUERY_KEY,
		queryFn: ({ pageParam }) => photoService.getPhotos(pageParam),
		initialPageParam: undefined as string | undefined,
		getNextPageParam: (lastPage: PhotoPageResponse) => lastPage.nextCursor ?? undefined,
		staleTime: 1000 * 60 * 5
	}));

	return {
		query,
		moveToTrash: async (ids: number[]) => {
			await photoService.moveToTrash(ids);
			queryClient.setQueryData<InfiniteData<PhotoPageResponse>>(
				USER_PHOTOS_QUERY_KEY,
				(oldData) => {
					if (!oldData) return oldData;
					return {
						...oldData,
						pages: oldData.pages.map((page) => ({
							...page,
							items: page.items.filter(
								(photo) => !ids.includes(photo.id)
							)
						}))
					};
				}
			);
		},
	};
}
