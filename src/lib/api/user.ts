import type { UserInfo } from '$lib/types/user';
import { apiClient } from './client';

export const userService = {
	getUserProfile: async (username: string): Promise<UserInfo> => {
		return apiClient.get(`/users/${username}/profile`);
	},
};
