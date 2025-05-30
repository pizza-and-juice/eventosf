import { createContext } from 'react';
import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';

import { RetrieveEventResponse } from '@modules/data-fetching/responses/events.responses';
import { RegisterEventResponse } from '@modules/data-fetching/responses/events-actions.responses';
import { ListUserAttendingEventsIdsResponse } from '@modules/data-fetching/responses/user-events.responses';

type Tab = {
	id: number;
	label: string;
	onClick(): void;
	Component: () => JSX.Element;
};

export type EventDetailsPageCtxType = {
	state: {
		activeTab: number;

		tabs: Tab[];

		userRegistered: boolean;

		register: {
			registerLoading: boolean;
			registerError: string | null;
		};

		registerAsSpeaker: {
			registerAsSpeakerLoading: boolean;
			registerAsSpeakerError: string | null;
		};

		unregister: {
			unregisterLoading: boolean;
			unregisterError: string | null;
		};

		delete: {
			deleteLoading: boolean;
			deleteError: string | null;
		};
	};

	fn: {
		onRegisterClick(): Promise<void>;
		onRegisterAsSpeakerClick(): Promise<void>;
		onUnregisterClick(): Promise<void>;
		onDeleteClick(): Promise<void>;
		openContactModal(): void;
	};

	queries: {
		eventQuery: UseQueryResult<RetrieveEventResponse, Error>;
		userAttendingEventsQuery: UseQueryResult<ListUserAttendingEventsIdsResponse, Error>;
	};

	requests: {
		registerMutation: UseMutationResult<RegisterEventResponse, Error, string, unknown>;
	};
};

// @ts-expect-error init later
export const EventDetailsPageCtx = createContext<EventDetailsPageCtxType>();
