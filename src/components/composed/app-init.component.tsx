// third party
import { useContext, useEffect, useState } from 'react';

// services
import AuthSvcContext from '@shared/services/auth/auth.context';
import UserSvcContext from '@shared/services/user/user.context';

// static
import { APP_EVENTS } from '@static/enums/app.events';

// shared
import { Theme, UserData } from '@shared/types';
import { Role } from '@shared/enums/user-enums';
import SettingsSvcContext from '@shared/services/settings/settings.context';
import settings_eventChannel from '@shared/instances/settings.event-channel';

type AppInitProps = {
	children: React.ReactNode;
};

function LoadingComponent() {
	return (
		<div className="flex items-center justify-center h-screen bg-white dark:bg-dark-800">
			<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 "></div>
		</div>
	);
}

export default function AppInit({ children }: AppInitProps) {
	// #region deps

	const authSvc = useContext(AuthSvcContext);
	const userSvc = useContext(UserSvcContext);
	const settingsSvc = useContext(SettingsSvcContext);

	// #endregion

	// *~~~ state ~~~* //
	const [appLoaded, setAppLoaded] = useState<boolean>(false);

	// set up storage api
	useEffect(() => {
		async function init() {
			// console.log("app initialized");

			// *~~~ auth ~~~* //

			function onThemeChanged(e: CustomEvent<Theme>) {
				const html = document.querySelector('html')!;
				html.classList.remove('light', 'dark');
				html.classList.add(e.detail);
			}

			settings_eventChannel.addEventListener('themeChanged', onThemeChanged as EventListener);

			settingsSvc.init();

			// *~~~ user ~~~* //

			// *~~~ LOAD EVENTS ~~~* //

			// set user data on loggin

			function onLoggedIn(e: CustomEvent<UserData>) {
				userSvc.setUserData(e.detail);
			}

			document.addEventListener(APP_EVENTS.AUTH_LOGGED_IN, onLoggedIn as EventListener);

			function onLoggedOut() {
				userSvc.setUserData({
					id: '',
					email: '',
					name: '',
					pfp: '',
					role: Role.NULL,
				});
			}

			document.addEventListener(APP_EVENTS.AUTH_LOGGED_OUT, onLoggedOut as EventListener);

			// await authSvc.init();
			await authSvc.restoreSession();

			// *~~~ html head ~~~* //

			// font awesome
			const faKey = import.meta.env.VITE_APP_FONTAWESOME_KEY;
			const link = document.createElement('link');
			link.href = `https://kit.fontawesome.com/${faKey}.css`;
			link.rel = 'stylesheet';
			link.type = 'text/css';
			link.crossOrigin = 'anonymous';
			document.head.appendChild(link);

			setAppLoaded(true);
		}

		init();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// TODO: add loading screen
	if (!appLoaded) return <LoadingComponent />;

	// if (process.env.NODE_ENV === "development") {
	// 	return (
	// 		<>
	// 			{/* <DevMenu /> */}
	// 			{/* {children} */}
	// 			{children}
	// 		</>
	// 	);
	// }

	return children;
}
