// third party
import { ReactNode, useState } from 'react';

// ctx
import SettingsSvcContext from './settings.context';

// shared
import { AppStorage, Theme } from '@shared/types';

// static
import STORAGE_KEYS from '@static/storage.keys';

export interface ISettingsService {
	theme: Theme;
	init(): void;
	toggleTheme(): void;
}

type Props = {
	storage: AppStorage;
	children: ReactNode;
	event_channel: EventTarget;
};

export default function SettingsServiceComponent({ children, storage, event_channel }: Props) {
	const [theme, setTheme] = useState<Theme>('light');

	function init() {
		const theme = storage.get<Theme>(STORAGE_KEYS.settings.theme);

		if (theme) {
			setTheme(theme);
			const event = new CustomEvent<Theme>('themeChanged', { detail: theme });
			event_channel.dispatchEvent(event);
		}
	}

	function save({ theme }: { theme: Theme }) {
		storage.set(STORAGE_KEYS.settings.theme, theme);
	}

	function toggleTheme() {
		const newTheme = theme === 'light' ? 'dark' : 'light';
		setTheme(newTheme);

		const event = new CustomEvent<Theme>('themeChanged', { detail: newTheme });
		event_channel.dispatchEvent(event);

		save({ theme });
	}

	const svc: ISettingsService = {
		theme,
		init,
		toggleTheme,
	};

	return <SettingsSvcContext.Provider value={svc}>{children}</SettingsSvcContext.Provider>;
}
