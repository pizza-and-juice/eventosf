// third party
import { Suspense, lazy, useContext, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { Route, BrowserRouter, Routes, useLocation } from 'react-router-dom';

// context components
import ContextComponent from '@components/composed/app-context.component';
import AppInit from '@components/composed/app-init.component';

import ModalContainer from '@components/modals/modal-container.component';

// layout
import MainLayout from '@modules/layout/main.layout';
import AuthRequiredLayout from '@modules/layout/auth-required.layout';

// page
import NotFoundPage from '@app/pages/not-found/404.page';

import LandingPage from '@app/pages/root/root.page';
import EventsPage from '@app/pages/events/root/events.page';
import CreateEventPage from '@app/pages/events/create/create-event.page';

import ModalSvcContext from 'src/shared/services/modal/modal.context';
import { ModalData } from 'src/shared/models/modals/modals.model';
// import FaqPage from './FAQs/faqs-page';

import GeneralSettingsService from 'src/shared/services/general-settings/general-settings.service';
import geneneralSettingsSvcContext from 'src/shared/services/general-settings/general-settings.context';

// static
import APP_MODALS from '@static/enums/app.modals';
import { THEMES } from 'src/static/settings/general-settings.data';
import ROUTES from '@static/router.data';

// styles
import 'react-toastify/dist/ReactToastify.css';
import 'src/scss/globals.scss';
import EventsDetailsPage from './pages/events/detalis/events-details.page';

// prettier-ignore
const ProjectDetailsPage = lazy(() => import('./(projects-layout)/projects/details/project-details[id].page'));
// prettier-ignore
const EditProjectPage = lazy(() => import('./(header-footer-layout)/projects/edit/project-edit[idx].page'));
const EditProjectsAdmin = lazy(
	() => import('./(header-footer-layout)/projects/edit/project-edit[idx].admin.page')
);

// prettier-ignore

const ProfilePage = lazy(() => import('./(header-footer-layout)/profile/profile.page'));

const TestPage = lazy(() => import('./(header-footer-layout)/test/test.page'));
const UiKitPage = lazy(() => import('./dev/ui-kit/ui-kit'));

// modals
const LoginModal = lazy(() => import('@modules/modals/auth/login.modal'));
// const ContactModal = lazy(() => import('src/components/modals/contact/contact.modal'));
// const ProjectImageModal = lazy(
// 	() => import('src/components/modals/project-image/project-image.modal')
// );
// const DeleteCommentModal = lazy(
// 	() => import('src/components/modals/delete-comment/delete-comment.modal')
// );

// const SessionExpiredModal = lazy(() => import('src/components/modals/login/session-expired.modal'));

// const DeleteProjectModal = lazy(
// 	() => import('src/components/modals/delete-project/delete-project.modal')
// );

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
				{/* header footer layout */}
				<Route element={<MainLayout />}>
					{/* dev only routes */}
					{import.meta.env.DEV && (
						<>
							<Route path="/test" element={<TestPage />} />
							<Route path={'/ui'} element={<UiKitPage />} />
						</>
					)}

					<Route path={ROUTES.root} element={<LandingPage />} />

					{/* login */}
					{/* <Route path={ROUTES.loginModal} element={<LoginModalPage />} /> */}

					{/* profile */}
					<Route path={ROUTES.profile.root} element={<ProfilePage />} />

					{/* project */}
					<Route path={ROUTES.projects.details} element={<ProjectDetailsPage />} />

					{/* events */}
					<Route path={ROUTES.events.root} element={<EventsPage />} />
					<Route path={ROUTES.events.create} element={<CreateEventPage />} />
					<Route path={ROUTES.events.details} element={<EventsDetailsPage />} />

					{/* 404 */}
					<Route path={ROUTES.any} element={<NotFoundPage />} />

					{/* *~~~ proteted routes ~~~* */}
					<Route element={<AuthRequiredLayout />}>
						{/* <Route path={ROUTES.profile.edit} element={<EditProfilePage />} />

						<Route path={ROUTES.projects.edit} element={<EditProjectPage />} />
						<Route element={<AdminRequiredLayout />}>
							<Route path={ROUTES.dashboard.root} element={<DashboardPage />} />
							<Route
								path={ROUTES.admin.projects.edit}
								element={<EditProjectsAdmin />}
							/>
						</Route> */}
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
		[APP_MODALS.LOGIN_MODAL]: LoginModal,
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

export default function RootLayout() {
	const settingsSvc = useContext<GeneralSettingsService>(geneneralSettingsSvcContext);

	return (
		<ContextComponent>
			<AppInit>
				<BrowserRouter>
					<Suspense fallback={<div></div>}>
						<RoutingComponent />
					</Suspense>

					<ScrollToTop />

					<ToastContainer
						theme={settingsSvc.getTheme() === THEMES.DARK ? 'dark' : 'light'}
					/>
					<AppModals />
				</BrowserRouter>
			</AppInit>
		</ContextComponent>
	);
}
