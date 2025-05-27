import { Role } from '@shared/enums/user-enums';

export type UserData = {
	id: string;
	first_name: string;
	last_name: string;
	pfp: string;
	email: string;
	role: Role;
};
