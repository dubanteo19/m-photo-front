import type {
	PhotoInfo,
	PhotoPageResponse,
	PhotoUploadRequest,
	PhotoUploadResponse
} from '$lib/types/photo';
import { apiClient } from './client';

export const photoService = {
	getPhotos: async (cursor?: string): Promise<PhotoPageResponse> => {
		return apiClient.get('/photos', {
			params: cursor ? { cursor } : {}
		});
	},

	getPhoto: async (id: number): Promise<PhotoInfo> => {
		return apiClient.get(`/photos/${id}`);
	},

	createUpload: async (
		request: PhotoUploadRequest
	): Promise<PhotoUploadResponse> => {
		return apiClient.post('/photos', request);
	},

	completeUpload: async (id: number): Promise<PhotoInfo> => {
		return apiClient.post(`/photos/${id}/complete`);
	},

	deletePhoto: async (id: number): Promise<void> => {
		return apiClient.delete(`/photos/${id}`);
	}
};