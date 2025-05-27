// import { InitialData } from '@shared/models/global/initial-data.model';

// third party
import { useContext, useEffect, useState } from 'react';

// services
import AuthSvcContext from '@shared/services/auth/auth.context';
import UserSvcContext from '@shared/services/user/user.context';

// static
import { APP_EVENTS } from '@static/enums/app.events';
import { UserData } from '@shared/models/user/user.model';

type AppInitProps = {
	children: React.ReactNode;
};

export default function AppInit({ children }: AppInitProps) {
	// #region deps

	const authSvc = useContext(AuthSvcContext);
	const userSvc = useContext(UserSvcContext);

	// #endregion

	// *~~~ state ~~~* //
	const [appLoaded, setAppLoaded] = useState<boolean>(false);

	// set up storage api
	useEffect(() => {
		async function init() {
			// console.log("app initialized");

			// *~~~ auth ~~~* //

			// await genSettingsSvc.init();

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
					first_name: '',
					last_name: '',
					pfp: '',
					role: null,
				});
			}

			document.addEventListener(APP_EVENTS.AUTH_LOGGED_OUT, onLoggedOut as EventListener);

			// await authSvc.init();
			await authSvc.restoreSession(false);

			// *~~~ html head ~~~* //

			// font awesome
			const faKey = import.meta.env.VITE_APP_FONTAWESOME_KEY;
			const link = document.createElement('link');
			link.href = `https://kit.fontawesome.com/${faKey}.css`;
			link.rel = 'stylesheet';
			link.type = 'text/css';
			link.crossOrigin = 'anonymous';
			document.head.appendChild(link);

			// setAppLoaded(true);
		}

		init();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// TODO: add loading screen
	// if (!appLoaded) return <LoadingComponent />;

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
