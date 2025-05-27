import { ListEventsResponse } from '@modules/data-fetching/responses/networks.responses';
import { UseQueryResult } from '@tanstack/react-query';
import { createContext } from 'react';

export type EventsPageCtxType = {
	state: {};

	fn: {};

	queries: {
		eventsQuery: UseQueryResult<ListEventsResponse, Error>;
	};

	// mutations: {
	// 	upvoteMutation: UseMutationResult<string, any, UpvoteDto, unknown>;
	// 	removeUpvoteMutation: UseMutationResult<string, any, RemoveUpvoteDto, unknown>;
	// };
};

// @ts-expect-error init later
export const EventsPageCtx = createContext<EventsPageCtxType>();
