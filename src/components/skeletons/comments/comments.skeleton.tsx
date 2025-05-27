export default function CommentsSkeleton() {
	return (
		<div className={`skeleton-container px-2`}>
			{/* Header */}
			<div className={`flex items-start gap-x-4`}>
				<div className="w-[48px] h-[48px] skeleton-circle"></div>
				<div className={`space-y-1 w-full mt-2`}>
					<div className="flex justify-between items-center">
						<div className="skeleton-title h-[26px] w-28"></div>
						<div className="skeleton-line w-10"></div>
					</div>
					<div className="space-y-3 pt-3">
						<div className="skeleton-line !w-full"></div>
						<div className="skeleton-line !w-full"></div>
					</div>
					<div className="skeleton-line w-[39px] !mt-3"></div>
				</div>
			</div>
		</div>
	);
}
