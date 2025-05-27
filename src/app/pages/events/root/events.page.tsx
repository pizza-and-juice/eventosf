import { useContext, useEffect, useState } from 'react';

import { ProjectSorting } from 'src/static/enums/projectsSorting.enums';
import { Signal, signal } from '@preact/signals-react';
import { DeploymentType } from 'src/static/enums/projects-deployment.enum';
import EventsView from '@modules/events/root/events.view';
import { EventsPageCtx, EventsPageCtxType } from '../../../../modules/events/root/events.context';
import DocTitleSvcContext from '@shared/services/doc-title/doc-title.context';
import AuthSvcContext from '@shared/services/auth/auth.context';
import UserSvcContext from '@shared/services/user/user.context';
import ModalSvcContext from '@shared/services/modal/modal.context';
import LayoutSvcContext from '@shared/services/layout/layout.context';
import { MultipleProjectsModel } from '@shared/models/projects/project.model';
import { useFormik } from 'formik';
import { useDebounce } from '@shared/hooks/use-debounce.hook';
import QUERY_KEYS from '@static/query.keys';
import QueryApi from '@shared/api/query-api';
import { onUpvoteMutate_ProjectsList } from '@shared/api/mutations/upvote.mutation';
import { toast } from 'react-toastify';
import APP_MODALS from '@static/enums/app.modals';
import { useQuery } from '@tanstack/react-query';
import api from '@modules/data-fetching/api';

// class PageHandler {
// 	private typeFilter: Signal<string> = signal(DeploymentType.ALL);
// 	private sortFilter: Signal<string> = signal(ProjectSorting.SORT_BY_DATE);

// 	// *~~~ getters ~~~* //

// 	getTypeFilter() {
// 		return this.typeFilter.value;
// 	}

// 	getSortFilter() {
// 		return this.sortFilter.value;
// 	}

// 	// *~~~ setters ~~~* //
// 	setTypeFilter(type: DeploymentType) {
// 		this.typeFilter.value = type;
// 	}

// 	setSortFilter(sortType: ProjectSorting) {
// 		this.sortFilter.value = sortType;
// 	}
// }

export default function EventsPage() {
	//#region dependencies
	useContext(DocTitleSvcContext).setTitle('Projects');
	const authSvc = useContext(AuthSvcContext);
	const userSvc = useContext(UserSvcContext);
	const modalSvc = useContext(ModalSvcContext);

	const layoutSvc = useContext(LayoutSvcContext);
	// const pageHandler = useContext(ctx);
	// #endregion

	// #region search form

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

	// #region

	function openProjectQV(id: number) {
		layoutSvc.openProjectQV(id);
	}

	function openProjectQVComments(id: number) {
		layoutSvc.openProjectQV(id, PROJECT_QV_TABS.comments);
	}
	// #endregion

	// *~~~  http reqs ~~~* //
	// #region http reqs
	// const filters = {
	// 	deploymentType: pageHandler.getTypeFilter(),
	// 	sortType: pageHandler.getSortFilter(),
	// };

	const [page, setPage] = useState<number>(0);

	// GET projects
	const eventsQuery = useQuery({
		queryKey: [QUERY_KEYS.LIST_EVENTS, page /*filters*/],
		queryFn: () => api.events.list(),
	});

	// GET user upvotes
	// const {
	// 	data: upvotesData,
	// 	isLoading: userUpvotesLoading,
	// 	isError: userUpvotesError,
	// } = useQuery(
	// 	[QUERY_KEYS.GET_USER_ALL_UPVOTES, userSvc.getUserData().id],
	// 	() => QueryApi.user.getUpvotedProjects(userSvc.getUserData().id),
	// 	{
	// 		enabled: authSvc.isLoggedIn,
	// 	}
	// );

	// GET search results
	// const searchProjectMutation = useMutation({
	// 	mutationFn: (search: string) => QueryApi.projects.searchProjects(search),

	// 	onSuccess: (data) => {
	// 		setSearchResults(data);
	// 	},

	// 	onError: () => {
	// 		toast.error('Error fetching search results');
	// 	},
	// });

	// POST upvote
	// const postUpvoteMutation = useMutation({
	// 	mutationFn: (prjctId: number) =>
	// 		QueryApi.projects.addUpvote(userSvc.getUserData().id, prjctId),

	// 	// optimistic update to have a better performance
	// 	onMutate: (prjctId: number) =>
	// 		onUpvoteMutate_ProjectsList({
	// 			projectId: prjctId,
	// 			userId: userSvc.getUserData().id,
	// 			page,
	// 			filters,
	// 			operation: 1,
	// 		}),

	// 	onError: () => {
	// 		toast.error('Error upvoting project');
	// 		// postUpvoteMutation.reset();
	// 	},
	// });

	// DELETE upvote
	// const delUpvoteMutation = useMutation({
	// 	mutationFn: (prjctId: number) =>
	// 		QueryApi.projects.delUpvote(userSvc.getUserData().id, prjctId),

	// 	onMutate: (prjctId: number) =>
	// 		onUpvoteMutate_ProjectsList({
	// 			projectId: prjctId,
	// 			userId: userSvc.getUserData().id,
	// 			page,
	// 			filters,
	// 			operation: 0,
	// 		}),

	// 	onError: () => {
	// 		delUpvoteMutation.reset();
	// 		toast.error('Error removing upvote from project');
	// 	},
	// });

	// #endregion

	// *~~~ functions (related to http req) ~~~* //
	// #region

	function changePage(newPage: number) {
		setPage(newPage);
	}

	// function isProjectUpvoted(projectId: number) {
	// 	return !authSvc.isLoggedIn
	// 		? false
	// 		: upvotesData!.upvotedProjects.some((p) => p.id === projectId);
	// }

	// async function handleUpvoteBtnClick(projectId: number, isUpvoted: boolean) {
	// 	if (!authSvc.isLoggedIn) {
	// 		modalSvc.open(APP_MODALS.LOGIN_MODAL, null);
	// 		return;
	// 	}

	// 	const toggle = isUpvoted ? delUpvoteMutation.mutateAsync : postUpvoteMutation.mutateAsync;

	// 	await toggle(projectId);
	// }

	const ctx: EventsPageCtxType = {
		fn: {},
		queries: {
			eventsQuery,
		},
		state: {},
	};

	return (
		<EventsPageCtx.Provider value={ctx}>
			<EventsView />
		</EventsPageCtx.Provider>
	);
}
