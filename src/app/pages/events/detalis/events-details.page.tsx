/* eslint-disable no-mixed-spaces-and-tabs */

import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@tanstack/react-query';

import {
	EventDetailsPageCtx,
	EventDetailsPageCtxType,
} from '@modules/events/details/events-details.context';

// services
import DocTitleSvcContext from '@shared/services/doc-title/doc-title.context';
import DocumentTitleService from '@shared/services/doc-title/doc-title.service';
import ModalSvcContext from '@shared/services/modal/modal.context';
import UserSvcContext from '@shared/services/user/user.context';

// data - fetching
import api from '@modules/data-fetching/api';

// module
import EventsDetailsView from '@modules/events/details/event-details.view';
import SummaryTab from '@modules/events/details/tabs/summary.tab';
import AttendeesTab from '@modules/events/details/tabs/attendees.tab';

// shared
import queryClient from '@shared/instances/query-client.instance';
import AuthSvcContext from '@shared/services/auth/auth.context';

// static
import QUERY_KEYS from '@static/query.keys';
import APP_MODALS from '@static/enums/app.modals';
import ROUTES from '@static/router.data';

export default function EventsDetailsPage() {
	// #region dependencies
	useContext<DocumentTitleService>(DocTitleSvcContext).setTitle('Evento');
	const authSvc = useContext(AuthSvcContext);
	const userSvc = useContext(UserSvcContext);
	const modalSvc = useContext(ModalSvcContext);

	const navigate = useNavigate();
	const params = useParams<{ id: string }>();
	const eventId = params.id!;

	// #endregion

	// #region todo
	// +todo not here, and isn't even working
	// useEffect(() => {
	// 	const handleBeforeUnload = () => {
	// 		tabHandler.setActiveTab(PROJECT_DETAILS_TABS.overview);
	// 	};

	// 	window.addEventListener('beforeunload', handleBeforeUnload);

	// 	return () => {
	// 		window.removeEventListener('beforeunload', handleBeforeUnload);
	// 	};
	// }, [tabHandler]);

	// #endregion

	// #region http request

	const eventQuery = useQuery({
		queryKey: [QUERY_KEYS.RETRIEVE_EVENT, eventId],
		queryFn: () => api.events.retrieve(eventId),
	});

	// GET user registration
	const [userRegistered, setUserRegistered] = useState(false);

	const userRegistrationQuery = useQuery({
		queryKey: [QUERY_KEYS.LIST_USER_REGISTERED_EVENTS_IDS, userSvc.getUserData().id, eventId],
		queryFn: () =>
			api.user_events.list_registered_ids({
				event_ids: [eventId],
			}),
		enabled: authSvc.isLoggedIn || true,
	});

	useEffect(() => {
		if (userRegistrationQuery.isSuccess) {
			const registeredEvents = userRegistrationQuery.data;
			setUserRegistered(registeredEvents.includes(eventId));
		}
	}, [userRegistrationQuery.isSuccess, userRegistrationQuery.data, eventId]);

	// POST register
	const registerMutation = useMutation({
		mutationFn: (eventId: string) =>
			api.events_actions.register({
				eventId,
			}),
	});

	// DELETE unregister
	const unregisterMutation = useMutation({
		mutationFn: (eventId: string) =>
			api.events_actions.unregister({
				eventId,
			}),
	});

	// DELETE event
	const deleteMutation = useMutation({
		mutationFn: (eventId: string) => api.events.delete(eventId),
	});

	// #endregion

	// #region tabs

	const [activeTab, setActiveTab] = useState(0);

	const tabs = [
		{
			id: 0,
			label: 'Resumen',
			onClick: () => {
				setActiveTab(0);
			},
			Component: SummaryTab,
			adminOnly: false,
		},
		{
			id: 1,
			label: `Participantes`,
			onClick: () => {
				setActiveTab(1);
			},
			Component: AttendeesTab,
			adminOnly: true,
		},
	];

	// #endregion

	// #region fn

	const [registerLoading, setRegisterLoading] = useState(false);
	const [registerError, setRegisterError] = useState<string | null>(null);

	async function onRegisterClick() {
		// if (!authSvc.isLoggedIn) {
		// 	modalSvc.open(APP_MODALS.LOGIN_MODAL, null);
		// 	return;
		// }

		setRegisterLoading(true);
		setRegisterError(null);

		try {
			await registerMutation.mutateAsync(eventId);
			await queryClient.refetchQueries({
				queryKey: [QUERY_KEYS.RETRIEVE_EVENT, eventId],
			});

			await toast.success('Te has registrado al evento correctamente');
		} catch (error: any) {
			if (error.response?.data?.code === '400_LIMIT_REACHED') {
				setRegisterError('Límite alcanzado para este evento');
				return;
			} else {
				setRegisterError(error.message || 'Error registrandose al evento');
				console.error('Error registering to event:', error);
			}
		} finally {
			setRegisterLoading(false);
		}
	}

	const [unregisterLoading, setUnregisterLoading] = useState(false);
	const [unregisterError, setUnregisterError] = useState<string | null>(null);

	async function onUnregisterClick() {
		// if (!authSvc.isLoggedIn) {
		// 	modalSvc.open(APP_MODALS.LOGIN_MODAL, null);
		// 	return;
		// }

		setUnregisterLoading(true);
		setUnregisterError(null);

		try {
			await unregisterMutation.mutateAsync(eventId);
			await queryClient.refetchQueries({
				queryKey: [QUERY_KEYS.RETRIEVE_EVENT, eventId],
			});

			await toast.success('Has desistido del evento correctamente');
		} catch (error: any) {
			setUnregisterError(error.message || 'Error desistiendo del evento');
			console.error('Error unregistering from event:', error);
		} finally {
			setUnregisterLoading(false);
		}
	}

	const [deleteLoading, setDeleteLoading] = useState(false);
	const [deleteError, setDeleteError] = useState<string | null>(null);

	async function onDeleteClick() {
		// if (!authSvc.isLoggedIn) {
		// 	modalSvc.open(APP_MODALS.LOGIN_MODAL, null);
		// 	return;
		// }

		setDeleteLoading(true);
		setDeleteError(null);

		try {
			await deleteMutation.mutateAsync(eventId);
			await queryClient.refetchQueries({
				queryKey: [QUERY_KEYS.RETRIEVE_EVENT, eventId],
			});

			await toast.success('Evento eliminado correctamente');

			navigate(ROUTES.events.root);
		} catch (error: any) {
			setDeleteError(error.message || 'Error eliminando el evento');
			console.error('Error deleting event:', error);
		} finally {
			setDeleteLoading(false);
		}
	}

	function openContactModal() {
		// if (!authSvc.isLoggedIn) {
		// 	modalSvc.open(APP_MODALS.LOGIN_MODAL, null);
		// 	return;
		// }

		modalSvc.open(APP_MODALS.CONTACT_MODAL, {
			event: {
				title: eventQuery.data!.title,
				country: eventQuery.data!.country,
				city: eventQuery.data!.city,
				address: eventQuery.data!.address,
			},
			host: {
				id: eventQuery.data!.host.id,
				name: eventQuery.data!.host.name,
				email: eventQuery.data!.host.email,
				pfp: eventQuery.data!.host.pfp,
			},
		});
	}
	// #endregion

	// #region page ctx

	const ctx: EventDetailsPageCtxType = {
		state: {
			activeTab,
			tabs,

			userRegistered,

			register: {
				registerLoading,
				registerError,
			},

			unregister: {
				unregisterLoading,
				unregisterError,
			},

			delete: {
				deleteLoading,
				deleteError,
			},
		},

		fn: {
			onRegisterClick,
			onUnregisterClick,
			onDeleteClick,
			openContactModal,
		},

		queries: {
			eventQuery,
			userRegistrationQuery,
		},

		requests: {
			registerMutation,
		},
	};

	return (
		<EventDetailsPageCtx.Provider value={ctx}>
			<EventsDetailsView />
		</EventDetailsPageCtx.Provider>
	);
	// #endregion
}
