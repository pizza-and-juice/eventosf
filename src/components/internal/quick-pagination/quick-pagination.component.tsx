'use client';

import './quick-pagination.scss';

type PaginationProps = {
	metadata: {
		totalPages: number;
		currentPage: number;
		itemsPerPage: number;
		totalItems: number;
		nextPage: number; // -1 if no next page
		previousPage: number; // -1 if no previous page
		startIndex: number;
		endIndex: number;
	};
	onPageChange: (page: number) => void;
};

export default function QuickPagination({ metadata, onPageChange }: PaginationProps) {
	// const totalPages = metadata.totalPages;
	// const currentPage = metadata.currentPage;
	// const buttonsToShow = 5; // number of buttons to show, including ellipsis

	// *~~*~~*~~ handle clicks ~~*~~*~~* //
	function loadPrevPage() {
		if (metadata.previousPage) {
			onPageChange(metadata.previousPage);
		}
	}
	function loadNextPage() {
		if (metadata.nextPage) {
			onPageChange(metadata.nextPage);
		}
	}
	// function handlePageClick(pageNumber: number) {
	// 	onPageChange(pageNumber);
	// }

	function handleFirstPageClick() {
		onPageChange(1);
	}

	function handleLastPageClick() {
		onPageChange(metadata.totalPages);
	}

	return (
		<div className="quick-pagination">
			{/* total results */}
			<button className="prev-button text-sm" onClick={handleFirstPageClick}>
				First
			</button>

			{/* buttons */}
			<div className="flex items-center gap-x-2">
				<button
					onClick={loadPrevPage}
					className="prev-button"
					disabled={metadata.currentPage === 1}
				>
					<i className="far fa-angle-left fa-lg"></i>
				</button>

				{/* <ul className="flex gap-x-1">
					{pageButtons.map((btn, idx) => (
						<li key={idx}>{btn}</li>
					))}
				</ul> */}

				<h1 className="text-agrey-900 dark:text-white text-sm font-medium bg-agrey-50 dark:bg-agrey-900 py-1 px-2 rounded-lg  ">
					Results: {metadata.startIndex} - {metadata.endIndex} of {metadata.totalItems}
				</h1>

				<button
					onClick={loadNextPage}
					className="next-button"
					disabled={metadata.currentPage === metadata.totalPages}
				>
					<i className="far fa-angle-right fa-lg"></i>
				</button>
			</div>

			<button className="prev-button text-sm" onClick={handleLastPageClick}>
				Last
			</button>
		</div>
	);
}
