// react
import { createContext, useContext, useEffect, useState } from 'react';
import { Signal, signal } from '@preact/signals-react';
import { useFormik } from 'formik';
// import { useNavigate } from 'react-router-dom';

// react query
import { useMutation, useQueries, useQuery } from 'react-query';
import QueryApi from 'src/shared/api/query-api';
import QUERY_KEYS from 'src/static/query.keys';

import Button from 'src/components/internal/button/button.component';
import StatBox from 'src/components/internal/stat-box/stat-box.component';
import ProjectBoxSkeleton from 'src/components/skeletons/project-box/project-box.skeleton';

// models
import Pagination from 'src/components/internal/pagination/pagination.component';
import { toast } from 'react-toastify';
import { useDebounce } from 'src/shared/hooks/use-debounce.hook';
import { MultipleProjectsModel } from 'src/shared/models/projects/project.model';
import ROUTES from 'src/static/router.data';
import { Link } from 'react-router-dom';
import Tag from 'src/components/internal/tags/tags.component';
import ProjectAdminComponent from 'src/components/not-reusable/project/project.admin-nr-component';
import ModalService from 'src/shared/services/modal/modal.service';
import ModalSvcContext from 'src/shared/services/modal/modal.context';
import APP_MODALS from 'src/static/enums/app.modals';
import StatBoxesSkeleton from 'src/components/skeletons/dashboard/stat-box.skeleton';
import ChartComponent from 'src/components/not-reusable/charts/chart.component';

function DashboardMainContent() {
	// *~~~  deps ~~~* //
	const modalSvc = useContext<ModalService>(ModalSvcContext);

	// *~~~  search ~~~* //
	// #region

	const [searchResults, setSearchResults] = useState<MultipleProjectsModel[]>([]);

	const formik = useFormik({
		initialValues: {
			search: '',
		},
		onSubmit: async (values) => {
			if (values.search === '') {
				return;
			}

			searchProjectMutation.mutate(values.search);
		},
	});
	const value = useDebounce(formik.values.search, 500);

	useEffect(() => {
		if (value === '') {
			deleteResults();
			return;
		}

		searchProjectMutation.mutate(value);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

	function deleteResults() {
		formik.setFieldValue('search', '');
		setSearchResults([]);
	}

	const { handleSubmit, getFieldProps } = formik;
	// #endregion

	// *~~~ http req ~~~* //
	// #region

	// for the total number of users

	const statisticsQueries = useQueries([
		{
			queryKey: QUERY_KEYS.ADMIN_GET_TOTAL_SUBMBISSIONS,
			queryFn: QueryApi.admin.getTotalSubmissions,
		},
		{
			queryKey: QUERY_KEYS.ADMIN_GET_TOTAL_USERS,
			queryFn: QueryApi.admin.getTotalUsers,
		},
		{
			queryKey: QUERY_KEYS.ADMIN_GET_TOTAL_GRANTS,
			queryFn: QueryApi.admin.getTotalGrants,
		},
	]);

	const filters = {
		deploymentType: '',
		sortType: '',
	};

	const [page, setPage] = useState<number>(0);

	function changePage(newPage: number) {
		setPage(newPage);
	}

	// GET projects
	const {
		data: projectsData,
		isLoading: projectsLoading,
		isError: projectsError,
	} = useQuery([QUERY_KEYS.GET_ALL_PROJECTS, page, filters], () =>
		QueryApi.projects.getAll(filters, page)
	);

	const {
		data: projectsStatus,
		isLoading: projectStatusLoading,
		isError: projectStatusError,
	} = useQuery(QUERY_KEYS.GET_PROJECT_STATUS, QueryApi.admin.getProjectsStatus);

	// GET search results
	const searchProjectMutation = useMutation({
		mutationFn: (search: string) => QueryApi.projects.searchProjects(search),

		onSuccess: (data) => {
			setSearchResults(data);
		},

		onError: () => {
			toast.error('Error fetching search results');
		},
	});

	const [time, setTime] = useState<'yearly' | 'monthly' | 'weekly'>('monthly');
	// get grant chart data
	const {
		data: grantChartData,
		isLoading: grantChartLoading,
		isError: grantChartError,
	} = useQuery(
		[QUERY_KEYS.ADMIN_GET_GRANT_CHART_DATA, time],
		() => QueryApi.admin.getGrantChartData(time),
		{
			onSuccess: (data) => {
				const xaxis = Object.keys(data);
				const series = Object.values(data);

				setXaxis(xaxis);
				setSeries(series);
			},
		}
	);

	// get user data
	const {
		data: userData,
		isLoading: userDataLoading,
		isError: userDataError,
	} = useQuery([QUERY_KEYS.ADMIN_GET_USER_DATA], QueryApi.admin.getUsersData);

	// #endregion

	// *~~~ fx ~~~* //
	// #region
	function openContactModal(project: MultipleProjectsModel) {
		modalSvc.open(APP_MODALS.CONTACT_MODAL, {
			grantAmount: project.grantAmount,
			currency: project.currency,
			framework: project.framework,
			projectDeployment: project.projectDeployment,
			telegramUsername: project.telegramUsername,
			email: project.email,
			twitterLinkedinUrl: project.twitterLinkedinUrl,
			walletAddress: project.walletAddress,
		});
	}

	// #endregion

	const [xaxis, setXaxis] = useState<string[]>([]);
	const [series, setSeries] = useState<any[]>([]);

	// *~~~ rendering ~~~* //

	if (
		statisticsQueries.some((q) => q.isError) ||
		statisticsQueries.some((q) => !q.isLoading && !q.data)
	) {
		return <div>Something went wrong with statistics data</div>;
	}

	if (grantChartError || (!grantChartLoading && !grantChartData)) {
		return <div>Something went wrong with grant chart data</div>;
	}

	if (projectsError || (!projectsLoading && !projectsData)) {
		return <div>Something went wrong with projects data</div>;
	}

	if (projectStatusError || (!projectStatusLoading && !projectsStatus)) {
		return <div>Something went wrong with project status</div>;
	}

	if (userDataError || (!userDataLoading && !userData)) {
		return <div>Something went wrong with user data</div>;
	}

	return (
		<main className="w-full lg:max-w-[700px] 2xl:max-w-[940px] 3xl:max-w-[1324px] space-y-10">
			{/* title */}
			<section className="space-y-2">
				<h1 className="text-xl sm:text-4xl font-bold text-black dark:text-white">
					Dashboard
				</h1>
				<p className="text-sm text-agrey-700 dark:text-agrey-400">
					See all submissions, users and edit project pages here.
				</p>
			</section>

			{/* Search Bar */}
			<section>
				<form onSubmit={handleSubmit}>
					<div className="field">
						<div className="form-control">
							<input
								className="text-field pr-20 pl-9"
								type="text"
								{...getFieldProps('search')}
								placeholder="Search projects"
							/>

							{/* icon */}
							<div className="text-black dark:text-white absolute inset-y-0 left-0 flex items-center pl-3 ">
								<i className="fa-solid fa-magnifying-glass"></i>
							</div>

							<div className="absolute inset-y-0 right-0 flex items-center gap-x-2 pr-3">
								{formik.values.search.length > 0 && (
									<button
										type="button"
										className="text-light-600  dark:text-dark-500 hover:text-ablue-200"
										onClick={deleteResults}
									>
										<i className="fa-solid fa-xmark"></i>
									</button>
								)}
								{/* enter button */}
								<button type="submit">
									<div className="flex justify-center items-center gap-x-2 text-light-600  dark:text-dark-500 hover:text-ablue-200">
										<i className="fa-solid fa-arrow-turn-down-right"></i>
										<h2>Enter</h2>
									</div>
								</button>
							</div>

							{/* Dropdown for search results  */}
							{searchProjectMutation.isLoading ? (
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
									))}{' '}
								</ul>
							) : formik.values.search.length > 0 && searchResults.length === 0 ? (
								<div className="p-3 absolute w-full top-full translate-y-2 dropdown-menu   bg-light-800 dark:bg-dark-800 z-searchPanel overflow-hidden rounded-xl py-2 max-h-[240px] shadow-xl">
									<h1 className="text-agrey-900 dark:text-white">
										No results found
									</h1>
								</div>
							) : (
								searchResults.length > 0 && (
									<ul className="absolute w-full top-full translate-y-2 dropdown-menu   bg-light-800 dark:bg-dark-800 z-searchPanel overflow-hidden rounded-xl py-2 max-h-[240px] overflow-y-scroll  shadow-xl">
										{searchResults.map((_, idx) => (
											<li key={idx}>
												<Link
													to={ROUTES.projects.details.replace(
														/:id/,
														_.id.toString()
													)}
												>
													<div className="flex p-3 gap-x-2 hover:bg-light-400 dark:hover:bg-dark-400">
														<img
															src={_.logoPath}
															alt=""
															className="w-14 h-14"
														/>

														<div>
															<h1 className="text-black dark:text-white">
																{_.projectName}
															</h1>

															<div className="flex gap-x-2 ">
																{_.categories.map(
																	(category, index) => (
																		<Tag key={index}>
																			{category}
																		</Tag>
																	)
																)}
															</div>
														</div>
													</div>
												</Link>
											</li>
										))}
									</ul>
								)
							)}
						</div>
					</div>
				</form>
			</section>

			{/* stats part 1 */}
			{statisticsQueries.some((q) => q.isLoading) ? (
				<section className="grid grid-rows-3 grid-cols-1 sm:grid-rows-1 sm:grid-cols-3 gap-3">
					{[1, 2, 3].map((_, idx) => (
						<div key={idx} className=" bg-light-900 dark:bg-dark-900 rounded-xl p-6 ">
							<StatBoxesSkeleton />
						</div>
					))}
				</section>
			) : (
				<section className="space-y-8 ">
					<div className="grid grid-rows-3 grid-cols-1 sm:grid-rows-1 sm:grid-cols-3 gap-3">
						<div>
							<StatBox
								title="Total Submissions"
								value={statisticsQueries[0].data!.total_submissions}
							/>
						</div>
						<div>
							<StatBox
								title="Total Users"
								value={statisticsQueries[1].data!.total_users}
							/>
						</div>

						<div>
							<StatBox
								title="Total Grants"
								value={statisticsQueries[2].data!.totalGrant}
							/>
						</div>
					</div>
				</section>
			)}

			{/* chart */}
			{grantChartLoading ? (
				<div className="mt-[35px] sm:mt-[100px]">
					{/* the graph */}
					<div className="h-[337px] w-[320px] mt-[16px] sm:w-full animate-pulse  rounded-md bg-light-900 dark:bg-dark-900"></div>
				</div>
			) : (
				<section className="space-y-8 ">
					<div className="flex justify-between items-center flex-col sm:flex-row">
						<div className="">
							<h1 className="text-xl font-medium dark:text-white text-dark">
								Submissions
							</h1>
						</div>
						<div className="flex items-center gap-1">
							<Button
								className={`small ${time === 'yearly' ? 'blue' : 'ghostgray'}`}
								onClick={() => setTime('yearly')}
							>
								Yearly
							</Button>

							<Button
								className={`small ${time === 'monthly' ? 'blue' : 'ghostgray'}`}
								onClick={() => setTime('monthly')}
							>
								Monthly
							</Button>
							<Button
								className={`small ${time === 'weekly' ? 'blue' : 'ghostgray'}`}
								onClick={() => setTime('weekly')}
							>
								Weekly
							</Button>
						</div>
					</div>
					<div className="w-[343px] h-[337px] sm:h-auto sm:w-auto">
						<ChartComponent
							series={[
								{
									name: 'Submissions',
									data: series,
								},
							]}
							categories={xaxis}
							width="100%"
							height="400"
						/>
					</div>
				</section>
			)}

			{/* stats part 2  */}
			{projectStatusLoading ? (
				<section className="grid grid-rows-3 grid-cols-1 sm:grid-rows-1 sm:grid-cols-3 gap-3">
					{[1, 2, 3].map((_, idx) => (
						<div key={idx} className=" bg-light-900 dark:bg-dark-900 rounded-xl p-6 ">
							<StatBoxesSkeleton />
						</div>
					))}
				</section>
			) : (
				<section className="space-y-8 ">
					<div className="grid grid-rows-3 grid-cols-1 sm:grid-rows-1 sm:grid-cols-3 gap-3">
						<div>
							<StatBox title="In review" value={projectsStatus.under_review} />
						</div>
						<div>
							<StatBox title="Accepted" value={projectsStatus.accepted} />
						</div>

						<div>
							<StatBox title="Rejected" value={projectsStatus.rejected} />
						</div>
					</div>
				</section>
			)}

			{/* stats part 3 */}
			{userDataLoading ? (
				<section className="grid grid-rows-2 grid-cols-1 sm:grid-rows-1 sm:grid-cols-2 gap-3">
					{[1, 2].map((_, idx) => (
						<div key={idx} className=" bg-light-900 dark:bg-dark-900 rounded-xl p-6 ">
							<StatBoxesSkeleton />
						</div>
					))}
				</section>
			) : (
				<section className="space-y-8 ">
					<h1 className="text-xl font-medium dark:text-white text-dark">Users</h1>
					<div className="grid grid-rows-2 grid-cols-1 sm:grid-rows-1 sm:grid-cols-2 gap-3">
						<div>
							<StatBox title="Users through Google" value={userData.googleUsers} />
						</div>
						<div>
							<StatBox title="Users through X" value={userData.xUsers} />
						</div>
					</div>
				</section>
			)}

			{/* projects display */}
			<section className="space-y-8 ">
				<h1 className="sm:text-2xl font-bold text-black dark:text-white">
					Requests ({projectsData?.metadata.totalItems || 0})
				</h1>

				{projectsLoading ? (
					// Loading state
					[1, 2, 3, 4, 5].map((_, index) => <ProjectBoxSkeleton key={index} />)
				) : (
					// Render actual projects
					<ul className="space-y-8">
						{projectsData.projects.map((project, idx) => (
							<div key={idx}>
								<ProjectAdminComponent
									id={project.id}
									imageSrc={project.logoPath}
									title={project.projectName}
									description={project.bio}
									categories={project.categories}
									upvotes={project.totalUpvotes}
									onContact={() => openContactModal(project)}
									totalComments={project.totalComments}
								/>
							</div>
						))}
					</ul>
				)}

				{projectsLoading ? null : (
					<Pagination metadata={projectsData.metadata} onPageChange={changePage} />
				)}
			</section>
		</main>
	);
}

function Sidebar() {
	const pageHandler = useContext<PageHandler>(ctx);

	const link_group = [
		{
			title: 'Overview',
			links: [
				{
					name: 'All',
					onClick: function () {
						pageHandler.setDisplay(Display.ALL);
					},
					value: Display.ALL,
				},
				{
					name: 'Submissions',
					onClick: function () {
						pageHandler.setDisplay(Display.SUBMISSIONS);
					},
					value: Display.SUBMISSIONS,
				},
				{
					name: 'Users',
					onClick: function () {
						pageHandler.setDisplay(Display.USERS);
					},
					value: Display.USERS,
				},
			],
		},
	];

	return (
		<aside
			id="projects_sidebar"
			className="project-aside min-w-[200px] hidden lg:block sticky top-headerP"
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
											link.value === pageHandler.getDisplay() && 'active'
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

export default function DashboardPage() {
	return (
		<div className="container-2">
			<div className="subcontainer">
				{/* Sidebar */}
				<div>
					<Sidebar />
				</div>

				{/* Main */}
				<DashboardMainContent />
			</div>
		</div>
	);
}

enum Display {
	ALL = 'All',
	SUBMISSIONS = 'Submissions',
	USERS = 'Users',
}

class PageHandler {
	private display: Signal<string> = signal(Display.ALL);

	// *~~~ getters ~~~* //

	getDisplay() {
		return this.display.value;
	}

	// *~~~ setters ~~~* //

	setDisplay(value: Display) {
		this.display.value = value;
	}
}

const ctx = createContext<PageHandler>(new PageHandler());
