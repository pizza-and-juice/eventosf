// third party
import { Suspense, lazy, useContext, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { Route, BrowserRouter, Routes, useLocation } from 'react-router-dom';

// context components
import AppContext from '@components/composed/app-context.component';
import AppInit from '@components/composed/app-init.component';
import ModalContainer from '@components/modals/modal-container.component';

// layout
import MainLayout from '@modules/layout/main.layout';
import AuthRequiredLayout from '@modules/layout/auth-required.layout';

// page
import NotFoundPage from '@app/pages/not-found/404.page';
import LandingPage from '@app/pages/root/root.page';
import EventsPage from '@app/pages/events/root/events.page';
import EventsDetailsPage from '@app/pages/events/detalis/events-details.page';
import CreateEventPage from '@app/pages/events/create/create-event.page';
import ProfilePage from '@app/pages/profile/profile.page';

// services
import SettingsSvcContext from '@shared/services/settings/settings.context';
import ModalSvcContext from 'src/shared/services/modal/modal.context';

// static
import APP_MODALS from '@static/enums/app.modals';
import ROUTES from '@static/router.data';

// styles
import 'react-toastify/dist/ReactToastify.css';
import 'src/scss/globals.scss';

// modules
import { ModalData } from '@modules/modals/modals.types';

// prettier-ignore

const TestPage = lazy(() => import('./pages/test/test.page'));
const UiKitPage = lazy(() => import('./dev/ui-kit/ui-kit'));

function ScrollToTop() {
	const { pathname } = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	return null;
}

function RoutingComponent() {
	return (
		<>
			<Routes>
				{/* unprotected */}
				<Route element={<MainLayout />}>
					{/* dev only routes */}
					{import.meta.env.DEV && (
						<>
							<Route path="/test" element={<TestPage />} />
							<Route path={'/ui'} element={<UiKitPage />} />
						</>
					)}

					<Route path={ROUTES.root} element={<LandingPage />} />

					{/* events */}
					<Route path={ROUTES.events.root} element={<EventsPage />} />
					<Route path={ROUTES.events.create} element={<CreateEventPage />} />

					{/* 404 */}
					<Route path={ROUTES.any} element={<NotFoundPage />} />
				</Route>

				{/* protected */}
				<Route element={<AuthRequiredLayout />}>
					<Route element={<MainLayout />}>
						{/* events */}
						<Route path={ROUTES.events.details} element={<EventsDetailsPage />} />

						{/* profile */}
						<Route path={ROUTES.profile.root} element={<ProfilePage />} />
					</Route>
				</Route>
			</Routes>
		</>
	);
}

function AppModals() {
	const modals: {
		[key: string]: any;
	} = {
		// [APP_MODALS.EXAMPLE_MODAL]: ExampleModal,
		[APP_MODALS.LOGIN_MODAL]: lazy(() => import('@modules/modals/auth/login.modal')),
		[APP_MODALS.REGISTER_MODAL]: lazy(() => import('@modules/modals/auth/register.modal')),
		[APP_MODALS.CONTACT_MODAL]: lazy(() => import('@modules/modals/contact/contact.modal')),
	};

	const modalSvc = useContext(ModalSvcContext);

	return (
		<ModalContainer>
			<Suspense fallback={<div></div>}>
				{modalSvc.getOpenModals().map((modal: ModalData, idx: number) => {
					const ModalComp = modals[modal.id];

					return <ModalComp modalId={modal.id} data={modal.data} key={idx} />;
				})}
			</Suspense>
		</ModalContainer>
	);
}

function AppToaster() {
	const settingsSvc = useContext(SettingsSvcContext);
	return <ToastContainer theme={settingsSvc.theme} />;
}

export default function RootLayout() {
	return (
		<AppContext>
			<AppInit>
				<BrowserRouter>
					<Suspense fallback={<div></div>}>
						<RoutingComponent />
					</Suspense>

					<ScrollToTop />
					<AppToaster />
					<AppModals />
				</BrowserRouter>
			</AppInit>
		</AppContext>
	);
}
