import { Role } from '@shared/enums/user-enums';

export type RegisterResponse = {
	accessToken: string;
	user: {
		id: string;
		email: string;
		pfp: string;
		username: string;
		role: Role;
		createdAt: string;
	};
	token: {
		access_token: string;
		expires_at: EpochTimeStamp;
	};
};

export type LoginResponse = {
	user: {
		id: string;
		email: string;
		pfp: string;
		username: string;
		role: Role;
		created_at: string;
	};
	token: {
		access_token: string;
		expires_at: EpochTimeStamp;
	};
};

export type LogoutResponse = {
	message: string;
};

export type SessionResponse = {
	user: {
		id: string;
		email: string;
		pfp: string;
		username: string;
		role: Role;
		created_at: string;
	};
};
