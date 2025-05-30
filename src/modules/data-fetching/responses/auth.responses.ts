import { UserRole } from '@shared/enums/user-enums';

export type RegisterResponse = {
	user: {
		id: string;
		email: string;
		pfp: string;
		name: string;
		role: UserRole;
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
		name: string;
		role: UserRole;
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
		name: string;
		role: UserRole;
	};
};
