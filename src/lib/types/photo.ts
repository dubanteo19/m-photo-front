export const PhotoStatus = {
    UPLOADING: 'UPLOADING',
    PROCESSING: 'PROCESSING',
    READY: 'READY',
    FAILED: 'FAILED'
} as const;

export type PhotoStatus = (typeof PhotoStatus)[keyof typeof PhotoStatus];

export interface PhotoInfo {
    id: number;
    takenAt: string | null;
    uploadedAt: string;
    latitude: number | null;
    longitude: number | null;
    width: number | null;
    height: number | null;
    size: number;
    imageUrl: string;
    thumbnailUrl: string;
    status: PhotoStatus;
}

export interface PhotoPageResponse {
    items: PhotoInfo[];
    nextCursor: string | null;
}

export interface PhotoUploadRequest {
    filename: string;
    contentType: string;
    size: number;
}

export interface PhotoUploadResponse {
    photoId: number;
    uploadUrl: string;
}