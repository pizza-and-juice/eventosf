export default function DetailsMetadataSkeleton() {
	return (
		<div className="space-y-4 flex-grow">
			<div className="skeleton-box w-28 h-28 " />

			<div className="">
				<div className=" mt-10 mb-10">
					<div className="skeleton-title w-14 mb-3" />
					<div className="skeleton-line w-28" />
				</div>
				<div className="  mb-6">
					<div className="skeleton-title w-14  mb-3" />
					<div className="skeleton-line w-12" />
				</div>
				<div className="mt-10 mb-10">
					<div className="skeleton-title w-14  mb-5" />
					<div className="skeleton-line w-10" />
				</div>
				<div className="  mb-10">
					<div className="skeleton-title w-14  mb-5" />
					<div className="skeleton-line w-12" />
				</div>
			</div>
		</div>
	);
}
