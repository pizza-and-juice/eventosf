/* eslint-disable react-hooks/rules-of-hooks */
// FilterComponent.tsx

import React from 'react';

interface FilterComponentProps {
	isVisible: boolean;
	onClose: () => void;
	// additional props for managing filter state can be added here
}
const FilterComponent: React.FC<FilterComponentProps> = ({ isVisible, onClose }) => {
	if (!isVisible) return null;

	// Dummy state for selected filters
	const [selectedFilter, setSelectedFilter] = React.useState<string>('All');

	// Dummy function to handle filter change
	const handleFilterChange = (filter: string) => {
		setSelectedFilter(filter);
		// Here, you can add logic to update the actual filter state used by your application
	};

	return (
		<div className="fixed inset-0 z-50 lg:hidden flex  overflow-y-auto  dark:bg-[#1B1B1F]		">
			<div className="absolute inset-0   p-4  max-h-screen overflow-y-auto ">
				<div className="relative flex justify-between items-center mb-4">
					<h2 className="text-xl font-bold">Filters</h2>
                    <i className="fas fa-times cursor-pointer" onClick={onClose}></i>

				</div>

				{/* Filter sections */}
				<div>
					<h3 className="text-lg font-semibold mb-2">Lorem</h3>
					<ul className="space-y-2 mb-4">
						{['All', 'Upvotes', 'Submissions'].map((filter) => (
							<li
								key={filter}
								onClick={() => handleFilterChange(filter)}
								className={`p-2 rounded-lg bg-agrey-1000 cursor-pointer flex justify-between dark:bg-[#18181A] items-center ${
									selectedFilter === filter ? 'bg-blue-100' : ''
								}`}
							>
								{filter}
								{selectedFilter === filter && (
									<i className="fas fa-check-circle text-blue-600"></i>
								)}
							</li>
						))}
					</ul>

					<h3 className="text-lg font-semibold mb-2">Filters</h3>
					<ul className="space-y-2 mb-4">
						{['All', 'Most Voted', 'New Submissions'].map((filter) => (
							<li
								key={filter}
								onClick={() => handleFilterChange(filter)}
								className={`p-2 rounded-lg bg-agrey-1000 cursor-pointer flex dark:bg-[#18181A] justify-between items-center ${
									selectedFilter === filter ? 'bg-blue-100' : ''
								}`}
							>
								{filter}
								{selectedFilter === filter && (
									<i className="fas fa-check-circle text-blue-600"></i>
								)}
							</li>
						))}
					</ul>

					<h3 className="text-lg font-semibold mb-2">Filters</h3>
					<ul className="space-y-2">
						{[
							'All',
							'External VM',
							'Virtual Machine',
							'Smart Contract dApp',
							'Software based app',
						].map((filter) => (
							<li
								key={filter}
								onClick={() => handleFilterChange(filter)}
								className={`p-2 rounded-lg bg-agrey-1000 cursor-pointer dark:bg-[#18181A] flex justify-between items-center ${
									selectedFilter === filter ? 'bg-blue-100' : ''
								}`}
							>
								{filter}
								{selectedFilter === filter && (
									<i className="fas fa-check-circle text-blue-600"></i>
								)}
							</li>
						))}
					</ul>
				</div>

				<div className="flex mt-6 space-x-4">
					<button className="flex-1 py-3 px-8 bg-gray-200 dark:bg-[#18181A] rounded-full">clear</button>
					<button className="flex-1 py-3 px-8 bg-blue text-white rounded-full">
						Apply
					</button>
				</div>
			</div>
		</div>
	);
};

export default FilterComponent;
