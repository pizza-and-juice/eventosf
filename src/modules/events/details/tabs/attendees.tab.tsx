import { useContext } from 'react';

// services
import ModalSvcContext from '@shared/services/modal/modal.context';

// static
import { EventDetailsPageCtx } from '../events-details.context';

export default function AttendeesTab() {
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

					<div>
						{eventData?.attendees_list && eventData.attendees_list.length > 0 ? (
							<ul className="list-none space-y-1">
								{eventData.attendees_list.map((attendee, idx) => (
									<li
										key={idx}
										className="  bg-gray-100 py-2 px-4 rounded-lg dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300 ease-in-out "
									>
										<div className="flex justify-between items-center">
											<div className="flex items-center gap-x-3">
												<img
													src={attendee.pfp}
													alt=""
													className="w-8 h-8 rounded-full hover:scale-105 hover:shadow-2xl transition duration-300 ease-in-out"
													onError={() => {
														attendee.pfp = '/default-user.png'; // Fallback image
													}}
												/>
												<div>
													<div className=" text-sm text-black dark:text-white">
														{attendee.name}
													</div>
													<div className="text-xs text-gray-500 dark:text-gray-400">
														{attendee.email}
													</div>
												</div>
											</div>

											<div>
												{attendee.is_speaker && (
													<div>
														<span className="text-black dark:text-white">
															<i className="fa-regular fa-microphone-stand" />
														</span>
														<span className="text-sm text-blue-500 ml-2">
															Speaker
														</span>
													</div>
												)}
											</div>
										</div>
									</li>
								))}
							</ul>
						) : (
							<div className="text-gray-500">Sin participantes aun</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
