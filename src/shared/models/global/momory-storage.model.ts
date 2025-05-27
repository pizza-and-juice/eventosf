export type MemoryStorage = {
	// remove(session_token: any): unknown;
	get<T>(key: string): T | null;
	set(key: string, value: any): void;
};
