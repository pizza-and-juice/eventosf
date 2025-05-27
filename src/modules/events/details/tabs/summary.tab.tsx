import { useContext } from 'react';

// services
import ModalSvcContext from '@shared/services/modal/modal.context';

// static
import { EventDetailsPageCtx } from '../events-details.context';

export default function SummaryTab() {
	const {
		state,
		queries: { eventQuery },
	} = useContext(EventDetailsPageCtx);
	const modalSvc = useContext(ModalSvcContext);

	const { data: eventData, isLoading: eventLoading, isError: eventError } = eventQuery;

	function openImgModal(imgs: string[], idx: number) {}

	// if (dappIddle) {
	// 	return <div></div>;
	// }

	if (eventError || (!eventLoading && !eventData)) {
		return <div className="text-ared-500">error fetching event data</div>;
	}

	// const proposalData = data!;

	return (
		<div className="space-y-10">
			{/* Gray divs row */}
			{eventLoading ? (
				<div className="skeleton-container">
					<div className="grid grid-cols-3 gap-x-2 ">
						<div className="skeleton-box w-full h-24"></div>
						<div className="skeleton-box w-full h-24"></div>
						<div className="skeleton-box w-full h-24"></div>
					</div>

					<br />

					<div className="space-y-6">
						<div className="skeleton-title w-[120px]"></div>
						<div className="space-y-3">
							<div className="skeleton-line w-full"></div>
							<div className="skeleton-line w-[90%]"></div>
							<div className="skeleton-line w-[95%]"></div>
						</div>
					</div>
				</div>
			) : (
				<div className="space-y-10">
					<div className="grid grid-cols-3 gap-x-2">
						{/* {[].images.map((img, idx, imgs) => {
							return (
								<img
									key={idx}
									src={img}
									alt=""
									className="cursor-pointer w-full  object-cover h-[72px] sm:h-[116px] hover:shadow-2xl transition duration-300 ease-in-out" // Adjust width (w-full) and height (h-48) as needed
									onClick={() => openImgModal(imgs, idx)}
								/>
							);
						})} */}
					</div>

					{/* Paragraphs */}
					<div className="text-sm text-black dark:text-white">
						<p className="whitespace-pre-line ">{eventData?.description}</p>
					</div>
				</div>
			)}
		</div>
	);
}
