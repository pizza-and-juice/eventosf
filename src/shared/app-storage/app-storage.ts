import { type AppStorage } from 'src/shared/models/global/app-storage.model';

const appStorage: AppStorage = {
	get<T>(key: string): T | null {
		const item = localStorage.getItem(key);
		if (!item) return null;

		return JSON.parse(item);
	},
	set(key: string, value: any) {
		const str = JSON.stringify(value);
		localStorage.setItem(key, str);
	},
	remove(key: string) {
		localStorage.removeItem(key);
	},
};

export default appStorage;
