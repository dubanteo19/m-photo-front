import PhotoSwipe, { type UIElementData } from 'photoswipe';

export type PhotoViewerItem = {
	id: string | number;
	imageUrl: string;
	width?: number | null;
	height?: number | null;
};

export function openPhotoViewer(photos: PhotoViewerItem[], selectedPhotoId: number, onInfoClick: () => void) {
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
		padding: { top: 10, bottom: 10, left: 10, right: 10 },
		closeOnVerticalDrag: true
	});

	const extraButtons: UIElementData[] = [
		{
			name: 'info-button',
			order: 8,
			isButton: true,
			title: 'Info photo',
			html: {
				isCustomSVG: true,
				inner: '<path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>',
				outlineID: 'pswp__icn-info'
			},
			onClick: onInfoClick
		},
		{
			name: 'info-download',
			order: 9,
			isButton: true,
			title: 'download photo',
			html: {
				isCustomSVG: true,
				inner: '<path d="M12 2a1 1 0 0 1 1 1v10.586l2.293-2.293a1 1 0 0 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L11 13.586V3a1 1 0 0 1 1-1zM5 17a1 1 0 0 1 1 1v2h12v-2a1 1 0 1 1 2 0v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a1 1 0 0 1 1-1z" fill="#ffffff"/>',
				outlineID: 'pswp__icn-donwload'
			},
			onClick: () => {
				const photo = photos[viewer.currIndex];
				const link = document.createElement('a');
				link.href = photo.imageUrl;
				link.download = `photo-${photo.id}`;
				link.click();
			}
		}
	]


	viewer.on('uiRegister', () => {


		extraButtons.forEach((button) => {
			viewer.ui?.registerElement(button);
		});

	});
	viewer.init();

	return viewer;
}
