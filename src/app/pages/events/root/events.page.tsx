// third party
import { useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// module
import EventsView from '@modules/events/root/events.view';
import { EventsPageCtx, EventsPageCtxType } from '@modules/events/root/events.context';

// data-fethching
import api from '@modules/data-fetching/api';

// services
import DocTitleSvcContext from '@shared/services/doc-title/doc-title.context';
import AuthSvcContext from '@shared/services/auth/auth.context';
import UserSvcContext from '@shared/services/user/user.context';

// shared
import { useDebounce } from '@shared/hooks/use-debounce.hook';
import { FilterEvents } from '@shared/enums/events-filter.enum';
import { SortEventsBy } from '@shared/enums/sort-events.enum';

// static
import QUERY_KEYS from '@static/query.keys';

// schemas
import { searchEventsSchema } from './search.schema';
import queryClient from '@shared/instances/query-client.instance';

export default function EventsPage() {
	//#region dependencies
	useContext(DocTitleSvcContext).setTitle('Proximos eventos');
	const authSvc = useContext(AuthSvcContext);
	const userSvc = useContext(UserSvcContext);

	// const pageHandler = useContext(ctx);
	// #endregion

	// #region search form

	const form = useForm({
		resolver: zodResolver(searchEventsSchema),
		defaultValues: {
			search: '',
		},
	});

	const { watch } = form;

	const searchDebValue = useDebounce(watch('search'), 500);

	function deleteResults() {
		form.reset({ search: '' });
		queryClient.setQueryData([QUERY_KEYS.LIST_EVENTS + '_SEARCH', searchDebValue], undefined);
	}
	// #endregion

	// #region sidebar

	const [filters, setFilters] = useState({
		status: FilterEvents.INCOMING,
	});

	const [sortBy, setSortBy] = useState<SortEventsBy>(SortEventsBy.CREATED_AT);

	const sidebar_data = [
		{
			title: 'Ordenar por',
			links: [
				{
					name: 'Fecha',
					value: SortEventsBy.CREATED_AT,
					onClick: () => {
						setSortBy(SortEventsBy.CREATED_AT);
					},
				},
			],
		},
		{
			title: 'Filtrar por',
			links: [
				{
					name: 'Todos',
					value: FilterEvents.ALL,
					onClick: () => {
						setFilters({ status: FilterEvents.ALL });
					},
				},
				{
					name: 'Proximos',
					value: FilterEvents.INCOMING,
					onClick: () => {
						setFilters({ status: FilterEvents.INCOMING });
					},
				},
				{
					name: 'Concluidos',
					value: FilterEvents.COMPLETED,
					onClick: () => {
						setFilters({ status: FilterEvents.COMPLETED });
					},
				},
			],
		},
	];

	// #endregion

	// #region http reqs

	const [page, setPage] = useState<number>(0);

	// GET projects
	const eventsQuery = useQuery({
		queryKey: [QUERY_KEYS.LIST_EVENTS, page, filters],
		queryFn: () =>
			api.events.list({
				status: filters.status,
			}),
	});

	const searchQuery = useQuery({
		queryKey: [QUERY_KEYS.LIST_EVENTS + '_SEARCH', searchDebValue],
		queryFn: () => api.events.list({ search: searchDebValue }),
		enabled: !!searchDebValue,
	});

	const attendingEventsQuery = useQuery({
		queryKey: [
			QUERY_KEYS.LIST_USER_ATTENDING_EVENTS_IDS,
			userSvc.getUserData().id,
			eventsQuery.data?.events.map((e) => e.id),
		],
		queryFn: () =>
			api.user_events.list_attending_ids({
				event_ids: eventsQuery.data?.events.map((e) => e.id) || [],
			}),
		enabled: authSvc.isLoggedIn && !!eventsQuery.data?.events.length,
	});

	// #endregion

	// #region

	function changePage(newPage: number) {
		setPage(newPage);
	}

	const ctx: EventsPageCtxType = {
		form,

		fn: {
			changePage,
			deleteResults,
		},
		queries: {
			eventsQuery,
			searchQuery,
			attendingEventsQuery,
		},
		state: {
			sidebar_data,
			filters,
			sortBy,
		},
	};

	return (
		<EventsPageCtx.Provider value={ctx}>
			<EventsView />
		</EventsPageCtx.Provider>
	);
}
