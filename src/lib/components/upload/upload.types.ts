import type { PhotoInfo } from "$lib/types/photo";

export enum UploadStatus {
    PENDING = 'PENDING',
    UPLOADING = 'UPLOADING',
    UPLOADED = 'UPLOADED',
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED'
}


export interface UploadTask {
    id: number;
    filename: string;
    size: number;
    status: UploadStatus;
    photo?: PhotoInfo;
    error?: string;
}