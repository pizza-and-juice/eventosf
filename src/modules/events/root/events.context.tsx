// third party
import { createContext } from 'react';
import { UseQueryResult } from '@tanstack/react-query';

// data-fetching
import { ListEventsResponse } from '@modules/data-fetching/responses/events.responses';
import { ListUserAttendingEventsIdsResponse } from '@modules/data-fetching/responses/user-events.responses';

// shared
import { SortEventsBy } from '@shared/enums/sort-events.enum';
import { FilterEvents } from '@shared/enums/events-filter.enum';
import { UseFormReturn } from 'react-hook-form';
import { SearchEventsSchema } from '@app/pages/events/root/search.schema';

export type EventsPageCtxType = {
	form: UseFormReturn<SearchEventsSchema, unknown, unknown>;

	state: {
		sidebar_data: {
			title: string;
			links: {
				name: string;
				value: any;
				onClick: () => void;
			}[];
		}[];
		sortBy: SortEventsBy;
		filters: {
			status: FilterEvents;
		};
	};

	fn: {
		changePage(newPage: number): void;
		deleteResults(): void;
	};

	queries: {
		eventsQuery: UseQueryResult<ListEventsResponse, Error>;
		searchQuery: UseQueryResult<ListEventsResponse, Error>;
		attendingEventsQuery: UseQueryResult<ListUserAttendingEventsIdsResponse, Error>;
	};

	// mutations: {
	// 	upvoteMutation: UseMutationResult<string, any, UpvoteDto, unknown>;
	// 	removeUpvoteMutation: UseMutationResult<string, any, RemoveUpvoteDto, unknown>;
	// };
};

// @ts-expect-error init later
export const EventsPageCtx = createContext<EventsPageCtxType>();
