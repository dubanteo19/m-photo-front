type DragAndDropOptions = {
    onDrop: (files: FileList | null) => void;
    onDragChange?: (isDragging: boolean) => void;
};
export function dragAndDrop(options: DragAndDropOptions) {
    return (node: HTMLElement) => {
        let dragCounter = 0;
        function handleDragEnter(event: DragEvent) {
            event.preventDefault();
            if (!event.dataTransfer?.types.includes('Files')) return;
            dragCounter++;
            options.onDragChange?.(true);
        }
        function handleDragLeave(event: DragEvent) {
            event.preventDefault();
            dragCounter--;
            if (dragCounter <= 0) {
                dragCounter = 0;
                options.onDragChange?.(false);
            }
        }
        function handleDragOver(event: DragEvent) {
            event.preventDefault();
            if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
        }
        function handleDrop(event: DragEvent) {
            event.preventDefault();
            dragCounter = 0;
            options.onDragChange?.(false);
            const files = event.dataTransfer?.files;
            if (!files || files.length === 0) return;
            options.onDrop(event.dataTransfer?.files ?? null);
        }
        node.addEventListener('dragenter', handleDragEnter);
        node.addEventListener('dragleave', handleDragLeave);
        node.addEventListener('dragover', handleDragOver);
        node.addEventListener('drop', handleDrop);
        return () => {
            node.removeEventListener('dragenter', handleDragEnter);
            node.removeEventListener('dragleave', handleDragLeave);
            node.removeEventListener('dragover', handleDragOver);
            node.removeEventListener('drop', handleDrop);
        }
    }
}