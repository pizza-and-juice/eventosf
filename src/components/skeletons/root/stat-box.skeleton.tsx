export default function StatBoxSkeleton() {
	return (
		<div className="bg-abrandc-light-grey dark:bg-agrey-900 w-full h-[88px] rounded-xl p-4">
			<div className="flex items-center gap-x-4 skeleton-container h-full">
				<div className="skeleton-circle !h-[28px] w-[28px] "></div>

				<div className="flex-grow space-y-4">
					<div className="skeleton-title max-w-[150px]"></div>
					<div className="skeleton-line max-w-[100px]"></div>
					<span className="sr-only">Loading...</span>
				</div>
			</div>
		</div>
	);
}
