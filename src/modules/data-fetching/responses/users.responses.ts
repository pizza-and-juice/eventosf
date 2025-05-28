import { Role } from '@shared/enums/user-enums';

export type RetrieveUserResponse = {
	id: string;
	name: string;
	email: string;
	pfp: string;
	role: Role;
};

export type ListUsersResponse = {
	users: {
		id: string;
		name: string;
		email: string;
		pfp: string;
		role: Role;
	};
	metadata: {
		items_per_page: number;
		total_items: number;
		current_page: number;
		total_pages: number;
	};
}[];
