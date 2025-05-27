export type AppStorage = {
	remove(key: string): void;
	get<T>(key: string): T | null;
	set(key: string, value: any): void;
};
