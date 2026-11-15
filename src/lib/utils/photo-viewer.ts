import PhotoSwipe from 'photoswipe';

export type PhotoViewerItem = {
	id: string | number;
	imageUrl: string;
	width?: number | null;
	height?: number | null;
};

export function openPhotoViewer(photos: PhotoViewerItem[], selectedPhotoId: number) {
	if (!photos.length) return;

	const dataSource = photos.map((photo) => ({
		src: photo.imageUrl,
		width: photo.width ?? 800,
		height: photo.height ?? 600,
		alt: 'Photo'
	}));

	const initialIndex = photos.findIndex((photo) => photo.id === selectedPhotoId);

	const viewer = new PhotoSwipe({
		dataSource,
		index: initialIndex >= 0 ? initialIndex : 0,
		imageClickAction: 'zoom-or-close',
		bgClickAction: 'close',
		wheelToZoom: true,
		secondaryZoomLevel: 1.5,
		maxZoomLevel: 3,
		bgOpacity: 0.95,
		loop: true,
		padding: { top: 20, bottom: 40, left: 10, right: 10 },
		closeOnVerticalDrag: true
	});

	viewer.init();

	return viewer;
}
