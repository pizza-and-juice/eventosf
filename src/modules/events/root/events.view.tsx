/* eslint-disable no-mixed-spaces-and-tabs */
// third party
import { useContext } from 'react';

import ProjectBoxSkeleton from '@components/skeletons/project-box/project-box.skeleton';
import { EventsPageCtx } from './events.context';

// components
import EventCard from '@components/composed/event-card.component';
import Pagination from '@components/internal/pagination/pagination.component';
import HttpReqErrorComponent from '@components/internal/http-req-error/http-req-error.component';

// status
import { Link } from 'react-router-dom';
import ROUTES from '@static/router.data';

import './events.scss';

function Sidebar() {
	const {
		state: { sidebar_data, filters, sortBy },
	} = useContext(EventsPageCtx);
	return (
		<aside
			id="projects_sidebar"
			className="project-aside min-w-[200px] hidden lg:block sticky top-headerP cursor-default"
		>
			{/* container Section */}
			<div className="space-y-12">
				{sidebar_data.map((group, index) => (
					<section className="space-y-4" key={index}>
						<h1 className="font-bold text-agrey-700 dark:text-white">{group.title}</h1>
						<ul className="list-none ">
							{group.links.map((link, idx2) => (
								<li className="" key={idx2}>
									<button
										onClick={link.onClick}
										className={`prj-aside-button ${
											(filters.status === link.value ||
												sortBy === link.value) &&
											'active'
										}`}
									>
										{link.name}
									</button>
								</li>
							))}
						</ul>
					</section>
				))}
			</div>
		</aside>
	);
}

export default function EventsView() {
	// *~~~  dependencies ~~~* //

	// #endregion

	const { queries, fn, form } = useContext(EventsPageCtx);

	const { eventsQuery, searchQuery, attendingEventsQuery } = queries;

	const { data: _eventsData, isLoading: eventsLoading, error: eventsError } = eventsQuery;
	const {
		fetchStatus: fetchingStatus_r2,
		data: attendingEvents,
		isError: attendingEventsError,
		isLoading: attendingEventsLoading,
	} = attendingEventsQuery;

	const {
		data: searchResults,
		isLoading: searchLoading,
		error: searchError,
		fetchStatus: searchStatus,
	} = searchQuery;

	// // *~~~  render ~~~* //
	// if (projectsError || (!projectsLoading && !projectsData)) {
	// 	return <div>Error fetching projects</div>;
	// }

	// if (authSvc.isLoggedIn && (userUpvotesError || (!userUpvotesLoading && !upvotesData))) {
	// 	return <div>Error fetching user upvotes</div>;
	// }

	const { register, watch } = form;

	if (
		attendingEventsError ||
		(fetchingStatus_r2 !== 'idle' && !attendingEventsLoading && !attendingEvents)
	) {
		return <HttpReqErrorComponent message="error fetching attending events" />;
	}

	if (searchError || (searchStatus !== 'idle' && !searchLoading && !searchResults))
		return <HttpReqErrorComponent message="error searching dapps" />;

	if (eventsError || (!eventsLoading && !_eventsData)) {
		return <HttpReqErrorComponent message="error fetching events" />;
	}

	const eventsData = _eventsData!;

	return (
		<div className="container-2 ">
			<div className="subcontainer">
				{/* Sidebar */}
				<div>
					<Sidebar />
				</div>

				{/* Main */}
				<main className="w-full lg:max-w-[700px] 2xl:max-w-[940px] 3xl:max-w-[1324px] space-y-10 cursor-default">
					{/* title */}
					<section className="space-y-2">
						<div className="flex justify-between items-center mb-4 sm:mb-0">
							<h1 className="text-xl sm:text-4xl font-bold text-black dark:text-white">
								Proximos Eventos
							</h1>
							{/* <button
						className="md:block sm:hidden lg:hidden bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
						onClick={openFilterPopup}
					>
						Filter
					</button> */}
						</div>

						<p className="text-sm text-agrey-700 dark:text-agrey-400">
							Encuentra los eventos más recientes y relevantes de la comunidad.
						</p>
					</section>

					<section>
						<form className="space-y-6">
							<div className="field">
								<div className="form-control">
									<input
										className="text-field pr-20 pl-9"
										type="text"
										{...register('search')}
										placeholder="Buscar eventos..."
									/>

									{/* icon */}
									<div className="text-black dark:text-white absolute inset-y-0 left-0 flex items-center pl-3 ">
										<i className="fa-solid fa-magnifying-glass"></i>
									</div>

									<div className="absolute inset-y-0 right-0 flex items-center gap-x-2 pr-3">
										{watch('search').length > 0 && (
											<button
												type="button"
												className="text-light-600  dark:text-dark-500 hover:text-ablue-200"
												onClick={fn.deleteResults}
											>
												<i className="fa-solid fa-xmark"></i>
											</button>
										)}
										{/* enter button 
								<button type="submit">
									<div className="flex justify-center items-center gap-x-2 text-light-600  dark:text-dark-500 hover:text-ablue-200">
										<i className="fa-solid fa-arrow-turn-down-right"></i>
										<h2>Enter</h2>
									</div>
								</button>*/}
									</div>

									{/* Dropdown for search results   */}
									{searchResults !== undefined && (
										<>
											{searchLoading ? (
												<ul className="absolute w-full top-full translate-y-2 dropdown-menu   bg-light-800 dark:bg-dark-800 z-searchPanel overflow-hidden rounded-xl py-2 max-h-[240px] overflow-y-scroll  shadow-xl">
													{[1, 2, 3].map((_, idx) => (
														<li className="" key={idx}>
															<div className="skeleton-container flex p-3 gap-x-2 hover:bg-light-400 dark:hover:bg-dark-400">
																<div className="skeleton-box w-14 h-14" />
																<div className=" space-y-4">
																	<h1 className="skeleton-title w-[120px]"></h1>
																	<div className="flex gap-x-2">
																		<h1 className="skeleton-line w-[50px]"></h1>
																		<h1 className="skeleton-line w-[50px]"></h1>
																		<h1 className="skeleton-line w-[50px]"></h1>
																	</div>
																</div>
															</div>
														</li>
													))}
												</ul>
											) : searchResults &&
											  searchResults.events.length === 0 ? (
												<div className="p-3 absolute w-full top-full translate-y-2 dropdown-menu   bg-light-800 dark:bg-dark-800 z-searchPanel overflow-hidden rounded-xl py-2 max-h-[240px] shadow-xl">
													<h1 className="text-agrey-900 dark:text-white">
														No results found
													</h1>
												</div>
											) : (
												searchResults && (
													<ul className="absolute w-full top-full translate-y-2 dropdown-menu   bg-light-800 dark:bg-dark-800 z-searchPanel overflow-hidden rounded-xl py-2 max-h-[240px] overflow-y-scroll  shadow-xl">
														{searchResults!.events.map((_, idx) => (
															<li key={idx}>
																<Link
																	to={ROUTES.events.details.replace(
																		/:id/,
																		_.id
																	)}
																>
																	<div className="flex p-3 gap-x-2 hover:bg-light-400 dark:hover:bg-dark-400">
																		<img
																			src={_.image}
																			alt=""
																			className="w-14 h-14"
																		/>

																		<div>
																			<h1 className="text-black dark:text-white">
																				{_.title}
																			</h1>

																			<div className="flex gap-x-2 ">
																				<p className="text-agrey-700 dark:text-agrey-400 text-sm">
																					{_.subtitle}
																				</p>
																			</div>
																		</div>
																	</div>
																</Link>
															</li>
														))}
													</ul>
												)
											)}
										</>
									)}
								</div>
							</div>
						</form>
					</section>

					{/* error */}

					{/* projects */}
					<section className="space-y-8">
						{/* <h1 className="sm:text-2xl font-bold text-black dark:text-white">New projects</h1> */}

						<ul className="space-y-8">
							{eventsLoading || attendingEventsLoading
								? [1, 2, 3].map((_, idx) => <ProjectBoxSkeleton key={idx} />)
								: eventsData.events.map((e, idx) => (
										<li key={idx}>
											<EventCard
												id={e.id}
												image={e.image}
												title={e.title}
												subtitle={e.subtitle}
												attendees_capacity={e.attendees_capacity}
												confirmed_attendees={e.attendees}
												speakers={e.speakers}
												isRegistered={
													attendingEvents?.includes(e.id) || false
												} // Simulating registration status
											/>
										</li>
								  ))}
						</ul>

						{eventsLoading ? null : (
							<Pagination
								metadata={eventsData.metadata}
								onPageChange={fn.changePage}
							/>
						)}
					</section>
				</main>
			</div>
		</div>
	);
}
