/* eslint-disable no-mixed-spaces-and-tabs */
// third party
import { useContext } from 'react';

// components
import ProjectMainDetailsSkeleton from '@components/skeletons/project/main-details/project-main-details.skeleton';
import Button from '@components/internal/button/button.component';

// local components
import Sidebar from './components/ed-sidebar';
import MetadataSidebar from './components/ed-metadata-sidebar';
import { EventDetailsPageCtx } from './events-details.context';

// skeletons
import DetailsMetadataSkeleton from '@modules/skeletons/events-details/metadata-skeleton';

// services
import UserSvcContext from '@shared/services/user/user.context';

// shared
import dateToText from '@shared/utils/formatters';

export default function EventsDetailsView() {
	const userSvc = useContext(UserSvcContext);

	const { state, queries } = useContext(EventDetailsPageCtx);

	const { eventQuery } = queries;

	const { data: event, isError: eventsError, isLoading: eventsLoading } = eventQuery;

	const { tabs } = state;

	if (eventsError || (!eventsLoading && event === undefined)) {
		return <div className="text-red-500">Error fetching events</div>;
	}

	return (
		<div className="container-2">
			<div className="subcontainer">
				<div>
					<Sidebar />
				</div>

				{/* Main */}
				<div className="flex-grow min-w-0">
					<main className="flex gap-x-10">
						{/* Main Content */}
						<div className="flex-grow min-w-0 space-y-10 ">
							{/*  details */}
							{eventsLoading ? (
								<ProjectMainDetailsSkeleton />
							) : (
								<section className="flex flex-col sm:flex-row gap-x-6 gap-y-4 relative">
									{/* image */}
									<img
										src={event?.image}
										alt=""
										className="w-[64px] h-[64px] md:w-[130px] md:h-[130px]"
									/>

									{/* Content to the right of the image */}
									<div className="flex-grow space-y-2">
										<div className="flex items-center justify-between ">
											<h1 className="text-xl font-medium text-black dark:text-white">
												{event?.title}
											</h1>

											{/* {dappData.upgradable && (
												<HoverTooltip
													text={TOOLTIPS.dappDetails.upgradable}
													placement="top-end"
													strategy="fixed"
												>
													<div className="px-2 py-1 bg-ghostly_grey-50 dark:bg-agrey-800 text-black dark:text-white flex gap-x-1 rounded-lg">
														<span>Upgradable</span>
														<span>
															<i className="fa-regular fa-info-circle" />
														</span>
													</div>
												</HoverTooltip>
											)} */}
										</div>

										<div>
											<h2 className="text-xs text-agrey-700 dark:text-agrey-400 font-medium ">
												{dateToText(event?.start_date ?? '')} -{' '}
												{dateToText(event?.end_date ?? '')}
											</h2>
										</div>
										<p className=" text-agrey-700 dark:text-agrey-400 whitespace-pre-line cursor-default">
											{event?.subtitle}
										</p>
										<div className="flex gap-x-4">
											{/* {dappData.categories.map((categoryId, idx) => {
												const category = CategoriesData.find(
													(c) => c.id === categoryId
												)!;
												return (
													<div
														key={idx}
														className="px-2 py-1 rounded-lg  bg-light-700 dark:bg-dark-700 text-black  dark:text-white flex items-center gap-2 text-sm"
													>
														<span>{category.emoji}</span>
														<p>{category.label}</p>
													</div>
												);
											})} */}

											<h1 className="space-x-1 text-black dark:text-white flex items-center">
												<span>
													<i className="fa-solid fa-users" />
												</span>{' '}
												<span className="text-sm">
													{event?.attendees_list.length} Confirmaciones
												</span>
											</h1>
										</div>
									</div>
								</section>
							)}

							{eventsLoading
								? null
								: (userSvc.isAdmin() || 1) && (
										<div className="block lg:hidden space-y-2">
											<hr />

											<div className="space-y-2">
												<h2 className="text-sm text-agrey-700 dark:text-agrey-400 font-medium cursor-default">
													Admin operations
												</h2>
												<div className="flex flex-wrap gap-2">
													<Button className="blue small ">Edit</Button>
													<Button className="blue small">Contact</Button>
													<Button className="red small">Delete</Button>
												</div>
											</div>

											<hr />
										</div>
								  )}

							{/* project metadata mobile  */}
							<section className="lg:hidden">
								{eventsLoading ? (
									<div className="text-black dark:text-white md:hidden sm:block ">
										<>
											<div className="skeleton-title w-[20%] mb-5" />
											<div className="skeleton-line w-[10%] mb-5" />
											<div className="skeleton-box w-[10%] h-3 mb-10" />
											<div className=" flex skeleton-container ">
												<div className="skeleton-box w-full h-40 flex-shrink-0 mr-5"></div>
											</div>
										</>
									</div>
								) : (
									<MetadataSidebar />
								)}
							</section>

							{/* tabs | only on mobile devices */}
							<section className="lg:hidden">
								<div className="flex gap-x-6 items-center ">
									{tabs.map((tab, idx) => (
										<button
											className={`text-sm py-4 border-b-2 text-black dark:text-white ${
												state.activeTab === tab.id
													? ' border-ablue-500 !text-ablue-500 dark:border-ablue-300 dark:!text-ablue-300'
													: 'border-transparent'
											}`}
											key={idx}
											onClick={tab.onClick}
										>
											{tab.label}
										</button>
									))}
								</div>
							</section>

							{/* tabs */}
							{/* tab element */}
							<section className=" lg:flex-grow md:min-h-0 relative ">
								{state.tabs.map(
									(tab, idx) =>
										state.activeTab === tab.id && (
											<div
												className="animate-fadeIn h-full overflow-y-hidden"
												key={idx}
											>
												<tab.Component />
											</div>
										)
								)}
							</section>
						</div>

						<div className="hidden lg:block">
							{eventsLoading ? (
								<DetailsMetadataSkeleton />
							) : (
								<aside className="min-w-[200px] sticky top-headerP">
									<MetadataSidebar />
								</aside>
							)}
						</div>
					</main>
				</div>
			</div>
		</div>
	);
}
