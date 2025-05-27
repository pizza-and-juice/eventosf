export default function ProjectBoxSkeleton() {
	return (
		<div className="prjt-box bg-light-900 dark:bg-dark-900 p-2 rounded-lg">
			<div className="flex gap-x-8 relative">
				{/* details container */}
				<div className="flex flex-col sm:flex-row gap-x-6 gap-y-4 w-full">
					<div className="skeleton-container skeleton-box w-[80px] !h-[80px] sm:!w-[170px] sm:!h-[130px]"></div>

					<div className="flex flex-col justify-between w-full">
						<div className="space-y-2">
							{/* project title */}
							<div className="flex items-center gap-x-3">
								<div className="skeleton-container skeleton-title w-28"></div>
								<div className="skeleton-container skeleton-box w-[26px] h-[26px] rounded-[4px]"></div>
								{/* <div className="skeleton-container skeleton-line w-12"></div> */}
							</div>

							{/* project description */}
							<div className={`px-2 skeleton-container skeleton-line !mt-4`}></div>
							<div
								className={`px-2 skeleton-container skeleton-line w-1/2 !mt-4`}
							></div>
						</div>
						<div className="sm:flex hidden gap-x-4">
							<div className="skeleton-container skeleton-box w-[79px] !h-[32px] rounded-lg"></div>
							<div className="skeleton-container skeleton-box w-[79px] !h-[32px] rounded-lg"></div>
						</div>
					</div>
				</div>

				{/* upvote button */}
				{/* <div className="absolute sm:relative flex flex-col !justify-end top-0 right-0">
					<div className="skeleton-container skeleton-box w-[78px] !h-[38px] !rounded-lg"></div>
				</div> */}
			</div>
		</div>
	);
}
