// third party
import { useContext } from 'react';

import ProjectBoxSkeleton from '@components/skeletons/project-box/project-box.skeleton';
import ProjectComponent from '@components/not-reusable/project/project.nr-component';
import { EventsPageCtx } from './events.context';

import './events.scss';

function Sidebar() {
	// *~~~ page context ~~~* //

	// const pageHandler = useContext<PageHandler>(ctx);

	// *~~~ state ~~~* //

	const link_group = [
		{
			title: 'Sort by',
			links: [
				{
					name: 'Date',
					onClick: () => {},
					value: '',
				},
				{
					name: 'Most Upvoted',
					onClick: () => {},
					value: '',
				},
			],
			getActive: () => '',
		},
		{
			title: 'Type',
			links: [
				{
					name: 'All',
					onClick: () => {},
					value: '',
				},
				{
					name: 'External VM',
					onClick: () => {},
					value: '',
				},
				{
					name: 'Bitcoin side chain',
					onClick: () => {},
					value: '',
				},
				{
					name: 'Eth side chain',
					onClick: () => {},
					value: '',
				},
				{
					name: 'Software based app',
					onClick: () => {},
					value: '',
				},
			],
			getActive: () => '',
		},
	];

	return (
		<aside
			id="projects_sidebar"
			className="project-aside min-w-[200px] hidden lg:block sticky top-headerP cursor-default"
		>
			{/* container Section */}
			<div className="space-y-12">
				{link_group.map((group, index) => (
					<section className="space-y-4" key={index}>
						<h1 className="font-bold text-agrey-700 dark:text-white">{group.title}</h1>
						<ul className="list-none ">
							{group.links.map((link, idx2) => (
								<li className="" key={idx2}>
									<button
										onClick={link.onClick}
										className={`prj-aside-button ${
											link.value === group.getActive() && 'active'
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

	const { queries } = useContext(EventsPageCtx);

	const { eventsQuery } = queries;

	const { data: eventsData, isLoading: eventsLoading, error: eventsError } = eventsQuery;

	// // *~~~  render ~~~* //
	// if (projectsError || (!projectsLoading && !projectsData)) {
	// 	return <div>Error fetching projects</div>;
	// }

	// if (authSvc.isLoggedIn && (userUpvotesError || (!userUpvotesLoading && !upvotesData))) {
	// 	return <div>Error fetching user upvotes</div>;
	// }

	if (eventsError || (!eventsLoading && !eventsData)) {
		return <div>Error fetching events</div>;
	}

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
								Incoming events
							</h1>
							{/* <button
						className="md:block sm:hidden lg:hidden bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
						onClick={openFilterPopup}
					>
						Filter
					</button> */}
						</div>

						<p className="text-sm text-agrey-700 dark:text-agrey-400">
							Explore PWR project applicants from founders and developers worldwide.
						</p>
					</section>

					{/* projects */}
					<section className="space-y-8">
						{/* <h1 className="sm:text-2xl font-bold text-black dark:text-white">New projects</h1> */}

						<ul className="space-y-8">
							{eventsLoading /*|| userUpvotesLoading */
								? [1, 2, 3].map((_, idx) => <ProjectBoxSkeleton key={idx} />)
								: eventsData?.events.map((e, idx) => (
										<li key={idx}>
											<ProjectComponent
												isUpvoted={false}
												id={e.id}
												imageSrc={e.thumbnail}
												title={e.title}
												description={e.description}
												categories={[]}
												upvotes={0}
												onCheckClick={() => {}}
												onUpvoteClick={() => {}}
												onCommentClick={() => {}}
												renderUpvote
												renderComments
												totalComments={0}
											/>
										</li>
								  ))}
						</ul>

						{/* {eventsLoading ? null : (
							<Pagination metadata={eventsData.metadata} onPageChange={changePage} />
						)} */}
					</section>
				</main>
			</div>
		</div>
	);
}
