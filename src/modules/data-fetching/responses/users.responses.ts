import { UserRole } from '@shared/enums/user-enums';

export type RetrieveUserResponse = {
	id: string;
	name: string;
	email: string;
	pfp: string;
	role: UserRole;
};

export type ListUsersResponse = {
	users: {
		id: string;
		name: string;
		email: string;
		pfp: string;
		role: UserRole;
	};
	metadata: {
		items_per_page: number;
		total_items: number;
		current_page: number;
		total_pages: number;
	};
}[];
