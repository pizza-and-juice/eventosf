import { Role } from '@shared/enums/user-enums';

export type Theme = 'light' | 'dark';

export type AppStorage = {
	remove(key: string): void;
	get<T>(key: string): T | string | null;
	set(key: string, value: any): void;
};

export type MemoryStorage = {
	// remove(session_token: any): unknown;
	get<T>(key: string): T | null;
	set(key: string, value: any): void;
};

export type UserData = {
	id: string;
	name: string;
	pfp: string;
	email: string;
	role: Role;
};
