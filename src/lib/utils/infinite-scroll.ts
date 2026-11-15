type InfiniteScrollOptions = {
	onLoadMore: () => void;
	hasNextPage: boolean;
	isFetching: boolean;
};

export function infiniteScroll(node: HTMLElement, options: InfiniteScrollOptions) {
	let observer: IntersectionObserver;

	const observe = () => {
		observer?.disconnect();

		if (!options.hasNextPage) return;

		observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting || options.isFetching) return;

				options.onLoadMore();
			},
			{
				rootMargin: '300px'
			}
		);

		observer.observe(node);
	};

	observe();

	return {
		update(newOptions: InfiniteScrollOptions) {
			options = newOptions;
			observe();
		},

		destroy() {
			observer?.disconnect();
		}
	};
}
