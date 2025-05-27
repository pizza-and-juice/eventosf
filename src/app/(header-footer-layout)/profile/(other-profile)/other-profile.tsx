/* eslint-disable react-hooks/rules-of-hooks */
// react
import { createContext, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { signal } from '@preact/signals-react';

// react query
import QueryApi from 'src/shared/api/query-api';
import QUERY_KEYS from 'src/static/query.keys';
import { useQuery } from 'react-query';

// components
import ProjectComponent from 'src/components/not-reusable/project/project.nr-component';
import ProjectBoxSkeleton from 'src/components/skeletons/project-box/project-box.skeleton';

// static
import ProfileSkeleton from 'src/components/skeletons/profile/profile.skeleton';
import ROUTES from 'src/static/router.data';

function MainContent() {
	// *~~~ inject dependencies ~~~*
	const userName = useContext<Username>(ctx);
	// #region
	const params = useParams<{ id: string }>();
	const profileId = params.id!;

	// #endregion

	// *~~~ http req ~~~* //
	// fetch profile
	const {
		data: profileData,
		isLoading: profileLoading,
		isError: profileError,
	} = useQuery(
		[QUERY_KEYS.PROFILE_DATA, profileId],
		() => QueryApi.user.googleGetInfo(profileId),
		{
			onSuccess: (data: any) => {
				userName.setUserName(data.name);
			},
		}
	);

	// *~~~~ tabs ~~~~* //
	const tabHandler = useContext<TabHandler>(tabCxt);

	const tabs = {
		links: [
			{
				label: 'Upvotes',
				onClick: () => {
					tabHandler.setActiveTab(PROFILE_TABS.upvotes);
				},
				tab: PROFILE_TABS.upvotes,
			},
			{
				label: 'Submissions',
				onClick: () => {
					tabHandler.setActiveTab(PROFILE_TABS.submissions);
				},
				tab: PROFILE_TABS.submissions,
			},
		],
		getActive: () => tabHandler.getActiveTab(),
	};

	function UpvotesTab() {
		const {
			data: upvotesData,
			isLoading: upvotesLoading,
			isError: upvotesError,
		} = useQuery(QUERY_KEYS.GET_USER_ALL_UPVOTES, () =>
			QueryApi.profile.getUpvotedProjects(profileId)
		);

		if (upvotesError || (!upvotesLoading && !upvotesData)) return <div>Error</div>;
		useEffect(() => {
			window.scrollTo(0, 0);
		}, []);
		return (
			<div className="space-y-8">
				<h2 className="dark:text-white text-2xl !leading-[36px] font-bold px-2">Upvotes</h2>

				<div className="space-y-8">
					{upvotesLoading ? (
						[1, 2, 3].map((_, idx) => <ProjectBoxSkeleton key={idx} />)
					) : upvotesData.length === 0 ? (
						<div
							className={`flex flex-col justify-center items-center text-center sm:gap-y-4 gap-y-6 bg-light-900 dark:bg-dark-900 sm:p-2.5 p-6 !h-[282px]`}
						>
							{/* Normal state */}
							<h2 className="text-base text-agrey-700 dark:text-agrey-400 leading-[26px] px-2">
								User has not upvoted any projects yet
							</h2>
						</div>
					) : (
						upvotesData.map((_, idx) => (
							<ProjectComponent
								key={idx}
								id={_.id}
								imageSrc={_.logoPath}
								title={_.projectName}
								description={_.bio}
								categories={_.categories}
								upvotes={_.totalUpvotes}
								onCheckClick={() => {}}
								onUpvoteClick={() => {}}
								isUpvoted={false}
								renderUpvote={false}
								onCommentClick={() => {}}
								renderComments={false}
								totalComments={0}
							/>
						))
					)}
				</div>
			</div>
		);
	}

	function SubmissionsTab() {
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
			<div className="space-y-8">
				<h2 className="dark:text-white text-2xl !leading-[36px] font-bold px-2">
					Submissions
				</h2>

				<div className="space-y-8">
					{submittedProjectsLoading ? (
						[1, 2, 3].map((_, idx) => <ProjectBoxSkeleton key={idx} />)
					) : !submittedProjects.length ? (
						<div
							className={`flex flex-col justify-center items-center text-center sm:gap-y-4 gap-y-6 bg-light-900 dark:bg-dark-900 sm:p-2.5 p-6 !h-[282px]`}
						>
							{/* Normal state */}
							<h2 className="text-base text-agrey-700 dark:text-agrey-400 leading-[26px] px-2">
								this profile hasn't submitted any projects yet
							</h2>
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

	if (profileError || (!profileLoading && !profileData)) return <div>Error</div>;

	return (
		<main className="w-full lg:max-w-[700px] 2xl:max-w-[940px] 3xl:max-w-[1324px] space-y-10">
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
									<h3 className="text-xl text-black dark:text-white font-medium px-2 capitalize">
										{profileData.name}
									</h3>
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
							className={`text-sm py-4 border-b-2 ${
								tabs.getActive() === tab.tab
									? ' border-ablue-500 text-ablue-500'
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
			{tabs.getActive() === PROFILE_TABS.upvotes && <UpvotesTab />}
			{tabs.getActive() === PROFILE_TABS.submissions && <SubmissionsTab />}
		</main>
	);
}

function Sidebar() {
	const tabHandler = useContext<TabHandler>(tabCxt);
	const userName = useContext<Username>(ctx);

	const link_gruop = [
		{
			title: `${userName.getUserName()}`,
			links: [
				{
					tab: PROFILE_TABS.upvotes,
					name: 'Upvotes',
					onClick: () => {
						tabHandler.setActiveTab(PROFILE_TABS.upvotes);
					},
				},
				{
					tab: PROFILE_TABS.submissions,
					name: 'Submissions',
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
				{link_gruop.map((group, index) => (
					<section className="space-y-4" key={index}>
						<h1 className="font-bold text-agrey-700 dark:text-white">{group.title}</h1>
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

export default function OtherProfile() {
	return (
		<div className="container-2 mx-auto">
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
	private activeTab = signal(PROFILE_TABS.upvotes);

	getActiveTab() {
		return this.activeTab.value;
	}

	setActiveTab(tab: PROFILE_TABS) {
		this.activeTab.value = tab;
	}
}

const tabCxt = createContext<TabHandler>(new TabHandler());

class Username {
	private userName = signal<string>('');

	public setUserName(name: string) {
		this.userName.value = name;
	}

	public getUserName() {
		return this.userName.value;
	}
}

const ctx = createContext<Username>(new Username());
