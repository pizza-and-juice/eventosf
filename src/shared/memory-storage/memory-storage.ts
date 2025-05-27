import { type MemoryStorage } from '../models/global/momory-storage.model';

const storage: { [key: string]: any } = {};

const memoryStorage: MemoryStorage = {
	get<T>(key: string): T | null {
		return storage[key] || null;
	},
	set(key: string, value: any) {
		Object.assign(storage, { [key]: value });
	},
};

export default memoryStorage;
