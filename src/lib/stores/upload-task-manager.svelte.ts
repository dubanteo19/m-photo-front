import { UploadStatus, type UploadTask } from "$lib/components/upload/upload.types";

class UploadTaskManager {
    tasks = $state<UploadTask[]>([]);

    add(task: UploadTask) {
        this.tasks = [...this.tasks, task];
    }

    updateStatus(id: number, status: UploadStatus) {
        this.tasks = this.tasks.map((task) =>
            task.id === id ? { ...task, status } : task
        );

        if (status === UploadStatus.COMPLETED) {
            setTimeout(() => this.remove(id), 3000);
        }
    }

    remove(id: number) {
        this.tasks = this.tasks.filter((task) => task.id !== id);
    }

}

export const uploadTaskManager = new UploadTaskManager();