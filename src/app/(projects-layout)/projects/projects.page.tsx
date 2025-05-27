/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-mixed-spaces-and-tabs */
import { createContext, useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';

import ProjectComponent from 'src/components/not-reusable/project/project.nr-component';
import { ProjectSorting } from 'src/static/enums/projectsSorting.enums';
import './project.scss';
import LayoutService from 'src/shared/services/layout/layout.service';
import LayoutSvcContext from 'src/shared/services/layout/layout.context';
import QUERY_KEYS from 'src/static/query.keys';
import QueryApi from 'src/shared/api/query-api';
import { useMutation, useQuery } from 'react-query';
import ProjectBoxSkeleton from 'src/components/skeletons/project-box/project-box.skeleton';
import { Signal, signal } from '@preact/signals-react';
import { DeploymentType } from 'src/static/enums/projects-deployment.enum';
import AuthService from 'src/shared/services/auth/auth.service';
import AuthSvcContext from 'src/shared/services/auth/auth.context';
import UserService from 'src/shared/services/user/user.service';
import UserSvcContext from 'src/shared/services/user/user.context';
import { MultipleProjectsModel } from 'src/shared/models/projects/project.model';
import APP_MODALS from 'src/static/enums/app.modals';
import ModalService from 'src/shared/services/modal/modal.service';
import ModalSvcContext from 'src/shared/services/modal/modal.context';
import { toast } from 'react-toastify';
import DocumentTitleService from 'src/shared/services/doc-title/doc-title.service';
import DocTitleSvcContext from 'src/shared/services/doc-title/doc-title.context';

import Pagination from 'src/components/internal/pagination/pagination.component';
import { PROJECT_QV_TABS } from 'src/static/enums/qv.enum';
import Tag from 'src/components/internal/tags/tags.component';
import { Link } from 'react-router-dom';
import ROUTES from 'src/static/router.data';
import { useDebounce } from 'src/shared/hooks/use-debounce.hook';
import { onUpvoteMutate_ProjectsList } from 'src/shared/api/mutations/upvote.mutation';

function ProjectsMainContent() {
	// *~~~  dependencies ~~~* //
	//#region
	useContext<DocumentTitleService>(DocTitleSvcContext).setTitle('Projects');
	const authSvc = useContext<AuthService>(AuthSvcContext);
	const userSvc = useContext<UserService>(UserSvcContext);
	const modalSvc = useContext<ModalService>(ModalSvcContext);

	const layoutSvc = useContext<LayoutService>(LayoutSvcContext);
	const pageHandler = useContext<PageHandler>(ctx);
	// #endregion

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

	// *~~~  project qv ~~~* //
	// #region

	function openProjectQV(id: number) {
		layoutSvc.openProjectQV(id);
	}

	function openProjectQVComments(id: number) {
		layoutSvc.openProjectQV(id, PROJECT_QV_TABS.comments);
	}
	// #endregion

	// *~~~  http reqs ~~~* //
	// #region
	const filters = {
		deploymentType: pageHandler.getTypeFilter(),
		sortType: pageHandler.getSortFilter(),
	};

	const [page, setPage] = useState<number>(0);

	// GET projects
	const {
		data: projectsData,
		isLoading: projectsLoading,
		isError: projectsError,
	} = useQuery([QUERY_KEYS.GET_ALL_PROJECTS, page, filters], () =>
		QueryApi.projects.getAll(filters, page)
	);

	// GET user upvotes
	const {
		data: upvotesData,
		isLoading: userUpvotesLoading,
		isError: userUpvotesError,
	} = useQuery(
		[QUERY_KEYS.GET_USER_ALL_UPVOTES, userSvc.getUserData().id],
		() => QueryApi.user.getUpvotedProjects(userSvc.getUserData().id),
		{
			enabled: authSvc.isLoggedIn(),
		}
	);

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

	// POST upvote
	const postUpvoteMutation = useMutation({
		mutationFn: (prjctId: number) =>
			QueryApi.projects.addUpvote(userSvc.getUserData().id, prjctId),

		// optimistic update to have a better performance
		onMutate: (prjctId: number) =>
			onUpvoteMutate_ProjectsList({
				projectId: prjctId,
				userId: userSvc.getUserData().id,
				page,
				filters,
				operation: 1,
			}),

		onError: () => {
			toast.error('Error upvoting project');
			// postUpvoteMutation.reset();
		},
	});

	// DELETE upvote
	const delUpvoteMutation = useMutation({
		mutationFn: (prjctId: number) =>
			QueryApi.projects.delUpvote(userSvc.getUserData().id, prjctId),

		onMutate: (prjctId: number) =>
			onUpvoteMutate_ProjectsList({
				projectId: prjctId,
				userId: userSvc.getUserData().id,
				page,
				filters,
				operation: 0,
			}),

		onError: () => {
			delUpvoteMutation.reset();
			toast.error('Error removing upvote from project');
		},
	});

	// #endregion

	// *~~~ functions (related to http req) ~~~* //
	// #region

	function changePage(newPage: number) {
		setPage(newPage);
	}

	function isProjectUpvoted(projectId: number) {
		return !authSvc.isLoggedIn()
			? false
			: upvotesData!.upvotedProjects.some((p) => p.id === projectId);
	}

	async function handleUpvoteBtnClick(projectId: number, isUpvoted: boolean) {
		if (!authSvc.isLoggedIn()) {
			modalSvc.open(APP_MODALS.LOGIN_MODAL);
			return;
		}

		const toggle = isUpvoted ? delUpvoteMutation.mutateAsync : postUpvoteMutation.mutateAsync;

		await toggle(projectId);
	}

	// #endregion

	// *~~~  render ~~~* //
	if (projectsError || (!projectsLoading && !projectsData)) {
		return <div>Error fetching projects</div>;
	}

	if (authSvc.isLoggedIn() && (userUpvotesError || (!userUpvotesLoading && !upvotesData))) {
		return <div>Error fetching user upvotes</div>;
	}

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<main className="w-full lg:max-w-[700px] 2xl:max-w-[940px] 3xl:max-w-[1324px] space-y-10 cursor-default">
			{/* title */}
			<section className="space-y-2">
				<div className="flex justify-between items-center mb-4 sm:mb-0">
					<h1 className="text-xl sm:text-4xl font-bold text-black dark:text-white">
						Top Projects{' '}
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

			{/* projects */}
			<section className="space-y-8">
				{/* <h1 className="sm:text-2xl font-bold text-black dark:text-white">New projects</h1> */}

				<ul className="space-y-8">
					{projectsLoading || userUpvotesLoading
						? [1, 2, 3].map((_, idx) => <ProjectBoxSkeleton key={idx} />)
						: projectsData.projects.map((p, idx) => (
								<li key={idx}>
									<ProjectComponent
										isUpvoted={isProjectUpvoted(p.id)}
										id={p.id}
										imageSrc={p.logoPath}
										title={p.projectName}
										description={p.bio}
										categories={p.categories}
										upvotes={p.totalUpvotes}
										onCheckClick={() => openProjectQV(p.id)}
										onUpvoteClick={() =>
											handleUpvoteBtnClick(p.id, isProjectUpvoted(p.id))
										}
										onCommentClick={() => openProjectQVComments(p.id)}
										renderUpvote
										renderComments
										totalComments={p.totalComments}
									/>
								</li>
						  ))}
				</ul>

				{projectsLoading ? null : (
					<Pagination metadata={projectsData.metadata} onPageChange={changePage} />
				)}
			</section>
		</main>
	);
}

function Sidebar() {
	// *~~~ page context ~~~* //
	const pageHandler = useContext<PageHandler>(ctx);

	// *~~~ state ~~~* //

	const link_group = [
		{
			title: 'Sort by',
			links: [
				{
					name: 'Date',
					onClick: () => {
						pageHandler.setSortFilter(ProjectSorting.SORT_BY_DATE);
					},
					value: ProjectSorting.SORT_BY_DATE,
				},
				{
					name: 'Most Upvoted',
					onClick: () => {
						pageHandler.setSortFilter(ProjectSorting.SORT_BY_UPVOTES);
					},
					value: ProjectSorting.SORT_BY_UPVOTES,
				},
			],
			getActive: () => pageHandler.getSortFilter(),
		},
		{
			title: 'Type',
			links: [
				{
					name: 'All',
					onClick: () => {
						pageHandler.setTypeFilter(DeploymentType.ALL);
					},
					value: DeploymentType.ALL,
				},
				{
					name: 'External VM',
					onClick: () => {
						pageHandler.setTypeFilter(DeploymentType.EXTERNAL_VM);
					},
					value: DeploymentType.EXTERNAL_VM,
				},
				{
					name: 'Bitcoin side chain',
					onClick: () => {
						pageHandler.setTypeFilter(DeploymentType.BITCON_DAPP);
					},
					value: DeploymentType.BITCON_DAPP,
				},
				{
					name: 'Eth side chain',
					onClick: () => {
						pageHandler.setTypeFilter(DeploymentType.ETH_DAPP);
					},
					value: DeploymentType.ETH_DAPP,
				},
				{
					name: 'Software based app',
					onClick: () => {
						pageHandler.setTypeFilter(DeploymentType.SOFTWARE_BASED_APP);
					},
					value: DeploymentType.SOFTWARE_BASED_APP,
				},
			],
			getActive: () => pageHandler.getTypeFilter(),
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

export default function ProjectsPage() {
	return (
		<div className="container-2 ">
			<div className="subcontainer">
				{/* Sidebar */}
				<div>
					<Sidebar />
				</div>

				{/* Main */}
				<ProjectsMainContent />
			</div>
		</div>
	);
}

class PageHandler {
	private typeFilter: Signal<string> = signal(DeploymentType.ALL);
	private sortFilter: Signal<string> = signal(ProjectSorting.SORT_BY_DATE);

	// *~~~ getters ~~~* //

	getTypeFilter() {
		return this.typeFilter.value;
	}

	getSortFilter() {
		return this.sortFilter.value;
	}

	// *~~~ setters ~~~* //
	setTypeFilter(type: DeploymentType) {
		this.typeFilter.value = type;
	}

	setSortFilter(sortType: ProjectSorting) {
		this.sortFilter.value = sortType;
	}
}

const ctx = createContext<PageHandler>(new PageHandler());
