import { createContext } from 'react';
import { UseQueryResult } from '@tanstack/react-query';

import { RetrieveEventResponse } from '@modules/data-fetching/responses/networks.responses';

type Tab = {
	id: number;
	label: string;
	onClick(): void;
	Component: JSX.Element;
};

export type EventDetailsPageCtxType = {
	state: {
		activeTab: number;

		tabs: Tab[];
	};

	fn: {
		manualHandleSubmit(): Promise<void>;
	};

	refs: {
		sectionRefs: React.MutableRefObject<(HTMLFieldSetElement | null)[]>;
	};

	queries: {
		eventQuery: UseQueryResult<RetrieveEventResponse, Error>;
	};
};

// @ts-expect-error init later
export const EventDetailsPageCtx = createContext<EventDetailsPageCtxType>();
