import { signal, type Signal } from '@preact/signals-react';

import STORAGE_KEYS from 'src/static/storage.keys';
import { Theme } from 'src/shared/models/global/theme.model';
import { THEMES } from 'src/static/settings/general-settings.data';
import { type AppStorage } from 'src/shared/models/global/app-storage.model';

type GeneralSettings = {
	theme: Theme;
};

export default class GeneralSettingsService {
	private theme: Signal<Theme> = signal(THEMES.LIGHT);

	constructor(private storage: AppStorage) {}

	init() {
		const settings = this.storage.get<GeneralSettings>(STORAGE_KEYS.generalSettings);

		if (settings) {
			this.theme.value = settings.theme;
		}

		document.querySelector('html')!.classList.add(this.theme.value);
	}

	save() {
		const settings: GeneralSettings = {
			theme: this.theme.value,
		};

		this.storage.set(STORAGE_KEYS.generalSettings, settings);
	}

	// *~~*~~*~~ svc api *~~*~~*~~ //

	toggleTheme() {
		const newTheme = this.theme.value === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
		const html = document.querySelector('html');

		html?.classList.replace(this.theme.value, newTheme);

		this.theme.value = newTheme;
		this.save();
	}

	getTheme() {
		return this.theme.value;
	}
}
