export default function ProjectMetadataSkeleton() {
	return (
		<div className="skeleton-container flex justify-between gap-x-6 ">
			<div className="border border-light-700 dark:border-dark-700 flex-grow">
				<div className="flex justify-between gap-x-12 px-4 py-6">
					{[1, 2, 3].map((_, idx) => (
						<div key={idx} className="space-y-6">
							<div className="skeleton-title w-[80px] "></div>

							<div className="skeleton-line w-[120px]"></div>
						</div>
					))}
				</div>
			</div>
			<div className="w-[100px] aspect-square ">
				<div className="skeleton-box w-full !h-full"></div>
			</div>
		</div>
	);
}
