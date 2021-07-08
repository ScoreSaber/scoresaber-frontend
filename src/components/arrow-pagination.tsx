type PaginationProperties = {
	page: number;
	maxPages: number;
	callback: PageClickCallback;
};

export interface PageClickCallback {
	(page: number): void;
}

export default function ArrowPagination(properties: PaginationProperties) {
	return (
		<nav className="pagination">
			{properties.page <= 1 && <br />}
			{properties.page > 1 && (
				<button onClick={() => properties.callback(properties.page - 1)} className="button arrow">
					<span className="icon is-small">
						<i className="fas fa-arrow-left" />
					</span>
				</button>
			)}
			{properties.page < properties.maxPages && (
				<button onClick={() => properties.callback(properties.page + 1)} className="button arrow">
					<span className="icon is-small">
						<i className="fas fa-arrow-right" />
					</span>
				</button>
			)}
		</nav>
	);
}
