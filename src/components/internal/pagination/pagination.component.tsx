// import { useState } from 'react';
// import { useMediaQuery } from '@react-hook/media-query';
// import useMediaQuery from '@react-hook/media-query';

import './pagination.scss';

// pages start form 0
type PaginationProps = {
	metadata: {
		items_per_page: number;
		total_items: number;
		current_page: number;
		total_pages: number;
	};
	onPageChange: (page: number) => void;
};

export default function Pagination({ metadata, onPageChange }: PaginationProps) {
	const isSmallScreen = false; //useMediaQuery('(max-width: 704px)');

	const totalPages = metadata.total_pages;
	const currentPage = metadata.current_page;

	let buttonsToShow = 5; // number of buttons to show, including ellipsis
	if (isSmallScreen) {
		buttonsToShow = 2;
	}

	let firstPage = 0;
	let endPage = totalPages;

	// *~~*~~*~~ handle ellipsis ~~*~~*~~* //

	if (totalPages > buttonsToShow) {
		const half = Math.floor(buttonsToShow / 2);
		if (currentPage <= half) {
			endPage = buttonsToShow;
		} else if (currentPage + half >= totalPages) {
			firstPage = totalPages - buttonsToShow + 1;
		} else {
			if (isSmallScreen) {
				firstPage = currentPage;
				endPage = currentPage;
			} else {
				firstPage = currentPage - half;
				endPage = currentPage + half;
			}
		}
	}

	// *~~~ handle clicks ~~~* //
	// #region handle clicks
	function loadPrevPage() {
		if (metadata.current_page > 0) {
			onPageChange(metadata.current_page - 1);
		}
	}
	function loadNextPage() {
		if (metadata.current_page < metadata.total_pages) {
			onPageChange(metadata.current_page + 1);
		}
	}

	function handlePageClick(pageNumber: number) {
		onPageChange(pageNumber);
	}
	// #endregion

	// const [inputValue, setInputValue] = useState<number>(metadata.currentPage);

	// function inputChange(e: React.ChangeEvent<HTMLInputElement>) {
	// 	const targetPage = parseInt(e.target.value, 10);

	// 	// Check if the input is valid (greater than 0 and less than or equal to total pages)
	// 	if (targetPage > 0 && targetPage <= metadata.totalPages) {
	// 		// Reset the red border and navigate to the selected page
	// 		e.target.style.borderColor = ''; // Reset the border color
	// 		onPageChange(targetPage);
	// 	} else {
	// 		// Set a red border around the input
	// 		e.target.style.borderColor = 'red';
	// 	}
	// }

	// *~~*~~*~~ render buttons ~~*~~*~~* //
	// #regon render buttons

	// create buttons
	const pageButtons = [];

	for (let i = firstPage; i < endPage; i++) {
		// console.log('This is the total NUMBER OF ITEMS', metadata.totalItems);
		pageButtons.push(
			<button
				key={i}
				onClick={() => handlePageClick(i + 1)}
				className={`pagination-btn ${metadata.current_page === i + 1 && 'active'}`}
			>
				{i + 1}
			</button>
		);
	}

	//
	if (firstPage > 0) {
		// if first page is not 1, add ellipsis and first page button
		if (firstPage > 1) {
			pageButtons.unshift(
				<span key="ellipsis-start" className="text-agrey-500 dark:text-agrey-600">
					...
				</span>
			);
		}

		pageButtons.unshift(
			<button onClick={() => handlePageClick(1)} className="pagination-btn">
				1
			</button>
		);
	}

	if (endPage < totalPages) {
		if (endPage < totalPages - 1) {
			pageButtons.push(
				<span key="ellipsis-end" className="text-agrey-500 dark:text-agrey-600">
					...
				</span>
			);
		}
		pageButtons.push(
			<button onClick={() => handlePageClick(totalPages)} className="pagination-btn !w-auto">
				{totalPages}
			</button>
		);
	}

	// #endregion

	return (
		<div className="pagination">
			{/* total results */}
			<div>
				{/* <h1 className="text-agrey-900 dark:text-white text-sm font-medium">
					<span className="md:block hidden">Results: </span>{' '}
					{(metadata.current_page - 1) * metadata.items_per_page} -{' '}
					{(metadata.current_page - 1) * metadata.items_per_page +
						metadata.items_per_page}{' '}
					of {metadata.total_items}
				</h1> */}
			</div>

			{/* buttons */}
			<div className="flex items-center gap-x-2">
				{/* prev button */}
				<button
					onClick={loadPrevPage}
					className="prev-button"
					disabled={metadata.current_page === 1}
				>
					<i className="far fa-angle-left fa-lg"></i>
				</button>

				<ul className="flex gap-x-1">
					{pageButtons.map((btn, idx) => (
						<li key={idx}>{btn}</li>
					))}
				</ul>

				{/* next button */}
				<button
					onClick={loadNextPage}
					className="next-button"
					disabled={
						metadata.current_page === metadata.total_pages || metadata.total_pages === 0
					}
				>
					<i className="far fa-angle-right fa-lg"></i>
				</button>
			</div>

			{/* go to page */}
			<div className="flex items-center gap-x-2">
				{/* <label className="text-agrey-900 dark:text-white text-sm font-medium hidden md:block">
					Go to page
				</label>

				<input
					style={{
						border:
							inputValue > metadata.totalPages
								? '2px solid red'
								: '2px solid transparent',
						transition: 'border 0.7s ease', // Add a transition for the border
					}}
					className="rounded-lg bg-abrandc-light-grey dark:bg-abrandc-dark-grey focus:outline-none text-agray-900 dark:text-white pl-4 h-8 w-[50px]"
					type="number"
					onFocus={(e) => (e.target as HTMLInputElement).select()} // Select the entire text on input focus
					onChange={(e) => setInputValue(parseInt(e.target.value, 10))}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							if (inputValue <= metadata.totalPages && inputValue > 0) {
								onPageChange(inputValue);
							} else {
								// Prevent changing the page and set red border
								e.preventDefault();
								setInputValue(metadata.currentPage);
								setTimeout(() => (e.target as HTMLInputElement).select(), 0); // Select the entire text after a brief delay
							}
						}
					}}
					value={inputValue}
				/> */}
			</div>
		</div>
	);
}
