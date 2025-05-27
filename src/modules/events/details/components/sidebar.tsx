import { useContext } from 'react';
import { EventDetailsPageCtx } from '../events-details.context';

export default function Sidebar() {
	const {
		state: { tabs, activeTab },
		queries: { eventQuery },
	} = useContext(EventDetailsPageCtx);

	const { data: event } = eventQuery;

	return (
		<aside
			id="projects_sidebar"
			className="project-aside min-w-[200px] hidden lg:block sticky top-headerP"
		>
			{/* container Section */}
			<div className="space-y-12 ">
				<section className="space-y-4">
					<h1 className="font-bold text-agrey-700 dark:text-white cursor-default">
						{event?.title || 'Evento'}
					</h1>
					<ul className="list-none ">
						{tabs.map((tab, idx) => (
							<li className="" key={idx}>
								<button
									onClick={tab.onClick}
									className={`prj-aside-button ${
										tab.id === activeTab && 'active'
									}`}
								>
									{tab.label}
								</button>
							</li>
						))}
					</ul>
				</section>
			</div>
		</aside>
	);
}
