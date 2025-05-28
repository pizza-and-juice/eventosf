import { createContext } from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import { RetrieveUserResponse } from '@modules/data-fetching/responses/users.responses';

// i will still put more types
type Tab = {
	id: number;
	label: string;
	onClick: () => void;
	Component: () => JSX.Element;
	admin: boolean;
	self: boolean;
};

export type ProfileCtxType = {
	queries: {
		userQuery: UseQueryResult<RetrieveUserResponse, Error>;
	};

	state: {
		userId: string;
		ownProfile: boolean;

		activeTab: number;
		tabs: Tab[];
	};
};

// @ts-expect-error init later
export const ProfilePageCtx = createContext<ProfileCtxType>();
