export default function ProfileSkeleton() {
	return (
		<div className="bg-light-900 dark:bg-dark-900 rounded-lg p-4 w-full">
			<div className="relative flex sm:flex-row flex-col items-start gap-4">
				{/* Profile Image */}
				<div
					className={`flex flex-shrink-0 justify-center items-end relative skeleton-container skeleton-circle rounded-full w-16 h-16`}
				>
					<div className="skeleton-circle"></div>
				</div>
				{/* Profile Info */}
				<div className="space-y-2 w-full">
					<div className="flex items-center justify-between">
						<div className={`px-2 skeleton-line skeleton-container w-28`}></div>
						<div className="skeleton-container skeleton-circle w-[122px] h-[36px]"></div>
					</div>
					<div className={`px-2 skeleton-container skeleton-line`}></div>
					<div className={`px-2 skeleton-container skeleton-line w-1/2 !mt-3`}></div>
					{/* Social Links */}
					<div
						className={`flex items-center gap-x-4 px-2 text-agrey-700 dark:text-agrey-400 invisible `}
					>
						<i className="fa-brands fa-x-twitter"></i>
						<i className="fa-solid fa-paper-plane"></i>
						<i className="fa-brands fa-linkedin-in"></i>
					</div>
				</div>
			</div>
		</div>
	);
}
