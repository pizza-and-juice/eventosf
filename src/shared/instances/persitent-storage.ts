import { AppStorage } from '@shared/types';

const appStorage: AppStorage = {
	get<T = string>(key: string): T | string | null {
		const item = localStorage.getItem(key);
		if (item === null) return null;

		// Intentamos parsear solo si parece un JSON válido
		const firstChar = item.trim()[0];
		const looksLikeJSON = firstChar === '{' || firstChar === '[' || firstChar === '"';

		if (looksLikeJSON) {
			try {
				return JSON.parse(item);
			} catch {
				// No se pudo parsear, devolvemos como string
				return item;
			}
		}

		return item;
	},
	set(key: string, value: any) {
		if (value === undefined) {
			console.warn(`No se puede guardar 'undefined' en localStorage. Key: ${key}`);
			return;
		}

		const str = typeof value === 'string' ? value : JSON.stringify(value);
		localStorage.setItem(key, str);
	},
	remove(key: string) {
		if (localStorage.getItem(key) !== null) {
			localStorage.removeItem(key);
		} else {
			console.warn(`No se encontró ningún valor en localStorage con la clave: ${key}`);
		}
	},
};

export default appStorage;
