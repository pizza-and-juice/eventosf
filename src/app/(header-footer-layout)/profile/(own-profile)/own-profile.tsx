// react
import { createContext, useContext, useEffect } from 'react';
import { Signal, signal } from '@preact/signals-react';

// react query
import { useQuery } from 'react-query';
import QueryApi from 'src/shared/api/query-api';

// components
import ProjectComponent from 'src/components/not-reusable/project/project.nr-component';
import Button from 'src/components/internal/button/button.component';

// static
import ROUTES from 'src/static/router.data';
import ProjectBoxSkeleton from 'src/components/skeletons/project-box/project-box.skeleton';

// responses
import QUERY_KEYS from 'src/static/query.keys';

import { useParams } from 'react-router-dom';
import ProfileSkeleton from 'src/components/skeletons/profile/profile.skeleton';
import DocumentTitleService from 'src/shared/services/doc-title/doc-title.service';
import DocTitleSvcContext from 'src/shared/services/doc-title/doc-title.context';
import UserService from 'src/shared/services/user/user.service';
import UserSvcContext from 'src/shared/services/user/user.context';

function MainContent() {
	// *~~~ inject dependencies ~~~* //
	// #region
	useContext<DocumentTitleService>(DocTitleSvcContext).setTitle('Profile');
	const params = useParams<{ id: string }>();
	const profileId = params.id!;

	// #endregion

	// *~~~~ tabs ~~~~* //
	const tabHandler = useContext<TabHandler>(tabCxt);
	const tabs = {
		links: [
			{
				label: 'My upvotes',
				onClick: () => {
					tabHandler.setActiveTab(PROFILE_TABS.upvotes);
				},
				tab: PROFILE_TABS.upvotes,
			},
			{
				label: 'My submissions',
				onClick: () => {
					tabHandler.setActiveTab(PROFILE_TABS.submissions);
				},
				tab: PROFILE_TABS.submissions,
			},
		],
		getActive: () => tabHandler.getActiveTab(),
	};

	// *~~~ http req ~~~* //

	// GET profile
	const {
		data: profileData,
		isLoading: profileLoading,
		isError: profileError,
	} = useQuery([QUERY_KEYS.PROFILE_DATA, profileId], () =>
		QueryApi.user.googleGetInfo(profileId)
	);

	// *~~~ rendering ~~~* //
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	function UpvotesTab() {
		// GET upvoted projects
		const {
			data: upvotedProjects,
			isLoading: upvotesLoading,
			isError: upvotesError,
		} = useQuery(QUERY_KEYS.GET_USER_ALL_UPVOTES, () =>
			QueryApi.profile.getUpvotedProjects(profileId)
		);

		if (upvotesError || (!upvotesLoading && !upvotedProjects)) return <div>Error</div>;

		return (
			<div className="space-y-8">
				<h2 className="dark:text-white text-2xl !leading-[36px] font-bold px-2">
					My Upvotes
				</h2>

				<div className="space-y-8">
					{upvotesLoading ? (
						[1, 2, 3].map((_, idx) => <ProjectBoxSkeleton key={idx} />)
					) : upvotedProjects.length === 0 ? (
						<div
							className={`flex flex-col justify-center items-center text-center sm:gap-y-4 gap-y-6 bg-light-900 dark:bg-dark-900 sm:p-2.5 p-6 !h-[282px]`}
						>
							{/* Normal state */}
							<h2 className="text-base text-agrey-700 dark:text-agrey-400 leading-[26px] px-2">
								You have not upvoted any projects yet
							</h2>
							<Button
								className="comp_button small blue"
								tag_type="link"
								href={ROUTES.projects.root}
							>
								Go to Projects
							</Button>
						</div>
					) : (
						upvotedProjects.map((project, idx) => (
							<ProjectComponent
								key={idx}
								id={project.id}
								imageSrc={project.logoPath}
								title={project.projectName}
								description={project.bio}
								categories={project.categories}
								upvotes={project.totalUpvotes}
								onUpvoteClick={() => {}}
								onCheckClick={() => {}}
								onCommentClick={() => {}}
								isUpvoted={false}
								renderUpvote={false}
								renderComments={false}
								totalComments={0}
							/>
						))
					)}
				</div>
			</div>
		);
	}

	function SubmittedProjectsTab() {
		// GET submitted projects
		const {
			data: submittedProjects,
			isLoading: submittedProjectsLoading,
			isError: submittedProjectsError,
		} = useQuery([QUERY_KEYS.GET_SUBMITTED_PROJECTS, profileId], () =>
			QueryApi.profile.getSubmittedProjects(profileId)
		);

		if (submittedProjectsError || (!submittedProjectsLoading && !submittedProjects))
			return <div>Error</div>;

		return (
			<div className="space-y-8 ">
				<h2 className="dark:text-white text-2xl !leading-[36px] font-bold px-2">
					My Submissions
				</h2>

				{/* {hasSubmissions ? ( */}
				<div className="space-y-8">
					{submittedProjectsLoading ? (
						[1, 2, 3].map((_, idx) => <ProjectBoxSkeleton key={idx} />)
					) : submittedProjects.length === 0 ? (
						<div
							className={`flex flex-col justify-center items-center text-center sm:gap-y-4 gap-y-6 bg-light-900 dark:bg-dark-900 sm:p-2.5 p-6 !h-[282px]`}
						>
							{/* Normal state */}
							<h2 className="text-base text-agrey-700 dark:text-agrey-400 leading-[26px] px-2">
								You have not submitted any projects yet
							</h2>
							<Button
								className="comp_button small blue hover:scale-105 transition duration-300 ease-in-out"
								href={ROUTES.grantApply}
								tag_type="link"
							>
								Request Grant
							</Button>
						</div>
					) : (
						submittedProjects.map((_, idx) => (
							<ProjectComponent
								key={idx}
								id={_.id}
								imageSrc={_.logoPath}
								title={_.projectName}
								description={_.bio}
								categories={_.categories}
								upvotes={_.totalUpvotes}
								onUpvoteClick={() => {}}
								onCheckClick={() => {}}
								onCommentClick={() => {}}
								renderUpvote={false}
								isUpvoted={false}
								renderComments={false}
								totalComments={0}
							/>
						))
					)}
				</div>
			</div>
		);
	}

	if (profileError || (!profileLoading && !profileData)) return <div>Error</div>;

	return (
		<main className="w-full lg:max-w-[700px] 2xl:max-w-[940px] 3xl:max-w-[1324px] space-y-10 cursor-default">
			{/* Profile Header */}
			<section>
				<h1 className="text-black dark:text-white text-xl sm:text-4xl font-bold">
					Profile
				</h1>
			</section>

			{/* Profile Card */}
			<section>
				{profileLoading ? (
					<ProfileSkeleton />
				) : (
					<div className="bg-light-900 dark:bg-dark-900 rounded-lg p-4 w-full">
						<div className="relative flex sm:flex-row flex-col items-start gap-4">
							{/* Profile Image */}
							<div
								className={`flex flex-shrink-0 justify-center items-end relative bg-agrey-900 rounded-full w-16 h-16`}
							>
								<img
									src={profileData.pictureUrl}
									alt="Profile"
									className="w-16 h-16 rounded-full"
								/>
							</div>
							{/* Profile Info */}
							<div className="space-y-2 w-full">
								<div className="flex items-center justify-between">
									<h3 className="text-xl text-black dark:text-white font-medium px-2 capitalize flex-grow min-w-0">
										<span className="inline-block mr-4 whitespace-pre-wrap overflow-hidden text-ellipsis max-w-[calc(100%-130px)]">
											{profileData.name}
										</span>{' '}
									</h3>
									<Button
										className={`absolute top-0 right-0 small secondary !px-2 !w-[122px]`}
										tag_type="link"
										href={ROUTES.profile.edit}
									>
										Edit Profile
									</Button>
								</div>
								<p
									className={`text-agrey-700 leading-[26px] dark:text-agrey-400 px-2`}
								>
									{profileData.bio}
								</p>
								{/* Social Links */}
								<div
									className={`flex items-center gap-x-4 px-2 text-agrey-700 dark:text-agrey-400`}
								>
									{profileData.twitterUrl && (
										<a target="_blank" href={profileData.twitterUrl}>
											<i className="fa-brands fa-x-twitter"></i>
										</a>
									)}
									{profileData.telegramUrl && (
										<a
											target="_blank"
											href={ROUTES.external.telegram.replace(
												/:user/,
												profileData.telegramUrl
											)}
										>
											<i className="fa-solid fa-paper-plane"></i>
										</a>
									)}

									{profileData.linkedinUrl && (
										<a target="_blank" href={profileData.linkedinUrl}>
											<i className="fa-brands fa-linkedin-in"></i>
										</a>
									)}
								</div>
							</div>
						</div>
					</div>
				)}
			</section>

			{/* tabs | only on mobile devices */}
			<section className="lg:hidden">
				<div className="flex gap-x-6 items-center ">
					{tabs.links.map((tab, idx) => (
						<button
							className={`text-sm py-4 border-b-2 text-black dark:text-white ${
								tabs.getActive() === tab.tab
									? ' border-ablue-500 text-ablue-500 dark:border-ablue-200 dark:text-ablue-200'
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
			{tabs.getActive() === '_' && <UpvotesTab />}
			{tabs.getActive() === '__' && <SubmittedProjectsTab />}
		</main>
	);
}

function Sidebar() {
	const tabHandler = useContext<TabHandler>(tabCxt);
	const userSvc = useContext<UserService>(UserSvcContext);

	const link_group = [
		{
			title: `${userSvc.getUserData().name}`,
			links: [
				{
					tab: PROFILE_TABS.upvotes,
					name: 'My Upvotes',
					onClick: () => {
						tabHandler.setActiveTab(PROFILE_TABS.upvotes);
					},
				},
				{
					tab: PROFILE_TABS.submissions,
					name: 'My Submissions',
					onClick: () => {
						tabHandler.setActiveTab(PROFILE_TABS.submissions);
					},
				},
			],
			getActive: () => tabHandler.getActiveTab(),
		},
	];

	return (
		<aside
			id="projects_sidebar"
			className="project-aside w-[200px] hidden lg:block sticky top-headerP"
		>
			{/* container Section */}
			<div className="space-y-12">
				{link_group.map((group, index) => (
					<section className="space-y-4" key={index}>
						<h1 className="font-bold text-agrey-700 dark:text-white">
							<span className="inline-block mr-4 whitespace-pre-wrap overflow-hidden text-ellipsis max-w-[calc(100%-10px)]">
								{group.title}
							</span>
						</h1>
						<ul className="list-none ">
							{group.links.map((link, idx2) => (
								<li className="" key={idx2}>
									<button
										onClick={link.onClick}
										className={`prj-aside-button ${
											link.tab === group.getActive() && 'active'
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

export default function OwnProfile() {
	return (
		<div className="container-2">
			<div className="subcontainer">
				{/* Sidebar */}
				<div>
					<Sidebar />
				</div>

				{/* Main */}
				<MainContent />
			</div>
		</div>
	);
}

enum PROFILE_TABS {
	upvotes = '_',
	submissions = '__',
}

class TabHandler {
	private activeTab: Signal<string> = signal(PROFILE_TABS.upvotes);

	getActiveTab() {
		return this.activeTab.value;
	}

	setActiveTab(tab: string) {
		this.activeTab.value = tab;
	}
}

const tabCxt = createContext<TabHandler>(new TabHandler());
