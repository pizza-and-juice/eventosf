import { useContext } from 'react';
import { CreateEventPageCtx } from '../create-event.context';

export default function Sidebar() {
	const {
		state: { link_group, activeSection },
	} = useContext(CreateEventPageCtx);
	return (
		<aside
			id="projects_sidebar"
			className="project-aside min-w-[200px] hidden lg:block sticky top-headerP"
		>
			{/* container Section */}
			<div className="space-y-12 ">
				{link_group.map((group, index) => (
					<section className="space-y-4" key={index}>
						<h1 className="font-bold text-agrey-700 dark:text-white">{group.title}</h1>
						<ul className="list-none ">
							{group.links.map((link, idx2) => (
								<li className="" key={idx2}>
									<button
										onClick={link.onClick}
										className={`prj-aside-button ${
											idx2 === activeSection && 'active'
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
