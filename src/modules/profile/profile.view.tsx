import { useContext } from 'react';
import { ProfileCtxType, ProfilePageCtx } from './profile.context';
import Button from '@components/internal/button/button.component';
// import ProfileSkeleton from 'src/components/skeletons/profile/profile.skeleton';
import { useDefaultUserImg } from '@shared/utils/functions';

function Sidebar() {
	const {
		fn,
		state: { tabs, activeTab, ownProfile },
	} = useContext<ProfileCtxType>(ProfilePageCtx);

	return (
		<aside
			id="projects_sidebar"
			className="project-aside min-w-[200px] hidden lg:block sticky top-headerP cursor-default"
		>
			{/* container Section */}
			<div className="space-y-12">
				<section className="space-y-4">
					<h1 className="font-bold text-agrey-700 dark:text-white">
						{ownProfile ? 'Mi Perfil' : 'Perfil'}
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

export default function ProfileView() {
	const { state, queries } = useContext<ProfileCtxType>(ProfilePageCtx);

	const { data: userData, isLoading: userLoading, error: userError } = queries.userQuery;

	// *~~~ profile img ~~~* //

	if (userError || (!userLoading && !userData))
		return <div className="text-red-500">Error fetching profile</div>;

	return (
		<div className="container-2 mx-auto">
			<div className="flex subcontainer">
				{/* Sidebar */}
				<div>
					<Sidebar />
				</div>
				{/* Main */}
				<main className="w-full space-y-10 cursor-default ">
					{/* Profile Card */}
					{userLoading ? (
						<div>Loading...</div>
					) : (
						// <ProfileSkeleton />
						<section className="bg-light-900 dark:bg-dark-900 rounded-lg p-4 w-full">
							<div className="relative flex sm:flex-row flex-col items-start gap-4">
								{/* Profile Image */}
								<div className="flex-shrink-0  items-end rounded-full w-16 h-16">
									<img
										src={userData!.pfp}
										alt=""
										className="w-full h-full"
										onError={useDefaultUserImg}
									/>
								</div>
								{/* Profile Info */}
								<div className="space-y-2 w-full">
									<div className="flex items-center justify-between">
										<div>
											<h3 className="text-xl text-black dark:text-white font-medium  capitalize flex-grow min-w-0">
												<span className="inline-block mr-4 whitespace-pre-wrap ">
													{userData!.name}
												</span>{' '}
											</h3>

											<h3 className="text-sm text-agrey-700 dark:text-agrey-400 ">
												{userData!.email}
											</h3>
										</div>
									</div>
									{/* <p className="text-agrey-700 dark:text-agrey-400 leading-[26px]  px-2">
										{userData.user.bio || 'User has not set a bio yet'}
									</p> */}
									{/* Social Links *
									<div className="flex items-center gap-x-4 px-2 text-agrey-700 dark:text-agrey-400">
										{userData.user.twitterUrl && (
											<a target="_blank" href={userData.user.twitterUrl}>
												<i className="fa-brands fa-x-twitter" />
											</a>
										)}
										{userData.user.telegramUrl && (
											<a target="_blank" href={userData.user.telegramUrl}>
												<i className="fa-solid fa-paper-plane"></i>
											</a>
										)}

										{userData.user.linkedinUrl && (
											<a target="_blank" href={userData.user.linkedinUrl}>
												<i className="fa-brands fa-linkedin-in"></i>
											</a>
										)}
									</div> */}
								</div>
							</div>
						</section>
					)}

					{/* tabs | only on mobile devices */}
					<section className="lg:hidden">
						<div className="flex gap-x-6 items-center ">
							{state.tabs.map((tab, idx) => (
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
				</main>
			</div>
		</div>
	);
}
