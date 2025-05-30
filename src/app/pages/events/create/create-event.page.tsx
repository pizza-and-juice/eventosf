// third party
import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

// module
import {
	create_event_schema,
	CreateEventForm,
} from '@modules/events/create-event/create_event.schema';
import {
	CreateEventPageCtxType,
	CreateEventPageCtx,
} from '@modules/events/create-event/create-event.context';
import CreateNetworkView from '@modules/events/create-event/create-event.view';

// services
import AuthSvcContext from '@shared/services/auth/auth.context';
import ModalSvcContext from '@shared/services/modal/modal.context';

// static
import ROUTES from '@static/router.data';

// data-fetching
import api from '@modules/data-fetching/api';
import { CreateEventDto } from '@modules/data-fetching/dto/events.dto';

// styles
import styles from './create-l1.module.css';
import APP_MODALS from '@static/enums/app.modals';
import { toast } from 'react-toastify';
import { dateToText2 } from '@shared/utils/formatters';

export default function CreateEventPage() {
	// #region dependencies

	const authSvc = useContext(AuthSvcContext);
	const modalSvc = useContext(ModalSvcContext);

	const navigate = useNavigate();

	// #endregion

	// #region form

	const [globalError, setGlobalError] = useState<string | null>(null);

	const form = useForm<CreateEventForm>({
		resolver: zodResolver(create_event_schema),
		mode: 'all',

		defaultValues: {
			title: '',
			subtitle: '',
			description: '',
			image: undefined,

			country: '',
			city: '',
			address: '',
			start_date: '',
			end_date: '',

			website: '',

			attendees_capacity: '',

			accept_terms: false,
		},
	});

	const {
		formState: { errors },
	} = form;

	async function manualHandleSubmit() {
		const dto: CreateEventDto = {
			title: form.getValues('title'),
			subtitle: form.getValues('subtitle'),
			description: form.getValues('description'),
			image: form.getValues('image'),

			country: form.getValues('country'),
			city: form.getValues('city'),
			address: form.getValues('address'),
			start_date: dateToText2(form.getValues('start_date')),
			end_date: dateToText2(form.getValues('end_date')),

			attendees_capacity: Number(form.getValues('attendees_capacity')),
		};

		// validate all fields
		const isValid = await form.trigger();

		if (!isValid) {
			return;
		}

		if (!authSvc.isLoggedIn) {
			modalSvc.open(APP_MODALS.LOGIN_MODAL, null);
			return;
		}

		try {
			// send request
			const network_data = await api.events.create(dto);

			// redirect to event page

			toast.success('Evento creado');
			navigate(ROUTES.events.details.replace(':id', network_data.id));

			form.reset();
		} catch (err: any) {
			if (err?.response?.message) {
				setGlobalError(err.response.message);
			} else if (err?.message) {
				setGlobalError(err.message);
			} else {
				setGlobalError('Ocurrió un error al crear el evento. intenta de nuevo mas tarde');
			}
		}
	}

	useEffect(() => {
		function onKey(e: KeyboardEvent) {
			if (e.key === 'l') {
				console.log('errors', errors);
			}
		}

		document.addEventListener('keydown', onKey);

		return () => {
			document.removeEventListener('keydown', onKey);
		};
	}, [errors]);

	// #endregion

	// #region sidebar

	const [activeSection, setActiveSection] = useState<number>(0);
	const link_group = [
		{
			title: 'Crear evento',
			links: [
				{
					name: 'Detalles',
					onClick: () => {
						window.location.href = '#event.essentials';
					},
				},
				{
					name: 'Ubicación',
					onClick: () => {
						window.location.href = '#event.location';
					},
				},
				{
					name: 'Contacto',
					onClick: () => {
						window.location.href = '#event.contact';
					},
				},
				{
					name: 'Participantes',
					onClick: () => {
						window.location.href = '#event.attendees';
					},
				},
				// {
				// 	name: 'Bridges',
				// 	onClick: () => {
				// 		window.location.href = '#network.bridges';
				// 	},
				// },
				// {
				// 	name: 'Initial Supply',
				// 	onClick: () => {
				// 		window.location.href = '#network.initial-supply';
				// 	},
				// },
				// {
				// 	name: 'Fund Wrapper Node',
				// 	onClick: () => {
				// 		window.location.href = '#network.wrapper-node';
				// 	},
				// },
			],
		},
	];

	const refs = useRef<Array<HTMLFieldSetElement | null>>([]);

	useLayoutEffect(() => {
		const sec1 = document.getElementById('event.essentials')!;
		const sec2 = document.getElementById('event.location')!;
		const sec3 = document.getElementById('event.contact')!;
		const sec4 = document.getElementById('event.attendees')!;
		// const sec4 = document.getElementById('network.bridges')!;
		// const sec4 = document.getElementById('network.initial-supply')!;
		// const sec6 = document.getElementById('network.wrapper-node')!;

		const secs = [sec1, sec2, sec3, sec4];

		window.addEventListener('scroll', navHighlighter);

		function navHighlighter() {
			// Get current scroll position
			const scrollY = window.scrollY;

			// Now we loop through sections to get height, top and ID values for each
			secs.forEach((current) => {
				const sectionHeight = current.offsetHeight;
				const sectionTop = current.offsetTop - 125;

				/*
						- If our current scroll position enters the space where current section on screen is, add .active class to corresponding navigation link, else remove it
						- To know which link needs an active class, we use sectionId variable we are getting while looping through sections as an selector
					*/
				if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
					setActiveSection(secs.indexOf(current));
				}
			});
		}

		return () => {
			window.removeEventListener('scroll', navHighlighter);
		};
	}, []);

	// #endregion

	// *~~~ scroll hanlders ~~~* //
	// #region effects
	useEffect(() => {
		document.querySelector('html')!.classList.add(styles.scroll_offset_top);

		return () => {
			document.querySelector('html')!.classList.remove(styles.scroll_offset_top);
		};
	}, []);

	// #endregion

	const ctxObject: CreateEventPageCtxType = {
		form,

		state: {
			activeSection,
			link_group,

			globalError,
		},

		fn: {
			manualHandleSubmit,
		},

		refs: {
			sectionRefs: refs,
		},
	};

	return (
		<CreateEventPageCtx.Provider value={ctxObject}>
			<CreateNetworkView />
		</CreateEventPageCtx.Provider>
	);
}
