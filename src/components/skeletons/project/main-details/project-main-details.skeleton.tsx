export default function ProjectMainDetailsSkeleton() {
	return (
		<div className="skeleton-container flex  gap-x-6 ">
			<div className="skeleton-box !w-[130px] !h-[130px]" />

			<div className="space-y-4 flex-grow">
				<div className="skeleton-title w-[30%] " />

				<div className="space-y-2">
					<div className="skeleton-line w-full" />
					<div className="skeleton-line w-[80%]" />
				</div>
			</div>
		</div>
	);
}
