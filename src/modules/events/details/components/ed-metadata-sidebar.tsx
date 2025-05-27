// third party
import { useContext, useRef, useState } from 'react';
import {
	arrow,
	FloatingArrow,
	offset,
	useClick,
	useDismiss,
	useFloating,
	useInteractions,
} from '@floating-ui/react';

// services
import AuthSvcContext from '@shared/services/auth/auth.context';
import UserSvcContext from '@shared/services/user/user.context';

// components
import Button from '@components/internal/button/button.component';

// shared
import useMediaQuery from '@shared/hooks/use-mediaquery';

// modules
import { EventsPageCtx } from '@modules/events/root/events.context';
import { Link } from 'react-router-dom';
import ROUTES from '@static/router.data';
import { EventDetailsPageCtx } from '../events-details.context';
import { useDefaultUserImg } from '@shared/utils/functions';
import ShareProjectPanel from '@components/not-reusable/share-project/share-project.nr.component';

export default function MetadataSidebar() {
	const authSvc = useContext(AuthSvcContext);
	const userSvc = useContext(UserSvcContext);

	const desktop = useMediaQuery('(min-width: 1024px)');

	const {
		state: { register, unregister, delete: deleteEvent, userRegistered },
		queries: { eventQuery },
		fn,
	} = useContext(EventDetailsPageCtx);

	const { registerError, registerLoading } = register;
	const { unregisterError, unregisterLoading } = unregister;
	const { deleteError, deleteLoading } = deleteEvent;

	const { data } = eventQuery;

	const eventData = data!;

	const arrowRef = useRef(null);
	const [showTooltip, setShowTooltip] = useState(false);

	const { refs, floatingStyles, context } = useFloating({
		placement: desktop ? 'left-start' : 'top-start',
		open: showTooltip,
		onOpenChange: setShowTooltip,
		middleware: [offset(10), arrow({ element: arrowRef })],
	});

	const click = useClick(context);

	const dismiss = useDismiss(context);

	const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

	return (
		<div className="sm:flex sm:flex-row-reverse lg:block gap-x-6 space-y-6 sm:space-y-0 lg:space-y-8">
			<div className="grid grid-cols-2 gap-x-2 sm:block sm:space-y-4  sm:w-[170px]  flex-shrink-0 lg:w-full">
				{/* <UpvoteBtn
					size="big"
					onClick={fn.handleUpvoteClick.bind(null, {
						dappHash: dappData.hash,
						upvoted: authSvc.isLoggedIn() && upvoteData.includes(dappData.hash),
					})}
					upvotes={0}
					isUpvoted={authSvc.isLoggedIn() && upvoteData.includes(dappData.hash)}
					className={
						(mutations.upvoteMutation.variables?.dappHash === dappData.hash &&
							mutations.upvoteMutation.isLoading) ||
						(mutations.removeUpvoteMutation.variables?.dappHash === dappData.hash &&
							mutations.removeUpvoteMutation.isLoading)
							? 'loading'
							: ''
					}
				/> */}
				{userRegistered ? (
					<Button
						className={`red small  ${unregisterLoading && 'loading'}`}
						onClick={fn.onUnregisterClick}
					>
						Desistir
					</Button>
				) : (
					<Button
						className={`blue small ${registerLoading && 'loading'}`}
						onClick={fn.onRegisterClick}
					>
						Registrarse
					</Button>
				)}

				{unregisterError && <div className="text-red-500 text-sm">{unregisterError}</div>}

				{registerError && <div className="text-red-500 text-sm">{registerError}</div>}

				{/* <Link
					className=" flex gap-x-2 items-center"
					to={'asd'}
					target="_blank"
					rel="noreferrer noopener"
				>
					<Button className="blue w-full">Open Dapp</Button>
				</Link> */}
			</div>

			<div className="py-6 px-4 grid grid-cols-2 gap-4 border border-black flex-grow min-w-0 /// lg:p-0 lg:block lg:border-none lg:space-y-6">
				{/* created by */}
				<div className="space-y-2 min-w-[127px]">
					<h2 className="text-sm text-agrey-700 dark:text-agrey-400 font-medium ">
						Anfitrión
					</h2>
					<div className="flex items-center gap-x-3">
						<Link
							className="text-link capitalize"
							to={ROUTES.profile.root.replace(/:id/, eventData.host.id)}
						>
							<img
								src={eventData.host.pfp}
								alt=""
								className="w-6 h-6 rounded-full hover:scale-105 hover:shadow-2xl transition duration-300 ease-in-out"
								onError={useDefaultUserImg}
							/>
						</Link>

						<Link
							className="text-link capitalize dark:text-agrey-400"
							to={ROUTES.profile.root.replace(/:id/, eventData.host.id)}
						>
							{eventData.host.name}
						</Link>
					</div>
				</div>
				{/* grant */}
				<div className="mb-4 space-y-2">
					<h2 className="text-sm text-agrey-700 dark:text-agrey-400 font-medium">
						Lugar
					</h2>
					<h2 className="text-black dark:text-white font-medium">
						{eventData.city}, {eventData.country} <br />
						{eventData.address}
					</h2>
				</div>

				<div className="mb-4 space-y-2">
					<h2 className="text-sm text-agrey-700 dark:text-agrey-400 font-medium">
						Aforo máximo
					</h2>
					<h2 className="text-black dark:text-white font-medium">
						{eventData.attendees_capacity} personas
					</h2>
				</div>

				{/* Website Column */}
				{eventData.website && (
					<div className="space-y-2">
						<h2 className="text-sm text-agrey-700 dark:text-agrey-400 font-medium cursor-default">
							Website
						</h2>
						<div>
							{/* Website link */}
							<Link
								className="text-link flex gap-x-2 items-center"
								to={eventData.website}
								target="_blank"
								rel="noreferrer noopener"
							>
								<span>
									<i className="fa-solid fa-external-link hover:text-ablue-200 dark:text-agrey-400 transition duration-300 ease-in-out"></i>
								</span>
							</Link>
						</div>
					</div>
				)}

				{/* share */}
				<div className="space-y-2">
					<h2 className="text-sm text-agrey-700 dark:text-agrey-400 font-medium cursor-default">
						Compartir
					</h2>
					<div className="relative">
						{/* Share button */}

						<button
							className="relative text-link flex gap-x-2 items-center"
							onClick={() => {}}
							{...getReferenceProps()}
							ref={refs.setReference}
						>
							<span>
								<i className="fa-solid fa-share-alt text-agrey-700 dark:text-agrey-400 hover:text-ablue-200 transition duration-300 ease-in-out"></i>
							</span>
						</button>

						{showTooltip && (
							<div
								ref={refs.setFloating}
								style={floatingStyles}
								{...getFloatingProps()}
							>
								<ShareProjectPanel eventId={eventData.id} />
								<FloatingArrow
									ref={arrowRef}
									context={context}
									className="dark:fill-dark-900 fill-light-900"
								/>
							</div>
						)}
					</div>
				</div>

				{/* admins */}
				<div className="space-y-2 hidden lg:block">
					<h2 className="text-sm text-agrey-700 dark:text-agrey-400 font-medium cursor-default">
						Acciones
					</h2>
					<div className="flex flex-col gap-y-2 w-[150px]">
						<Button className="ghostgray space-x-2 small" onClick={fn.openContactModal}>
							<span className="fa-regular fa-user"></span>
							<span>Contactar</span>
						</Button>
						{(userSvc.getUserData().id === eventData.host.id || userSvc.isAdmin()) && (
							<>
								{/* <Link to={ROUTES.events.edit.replace(/:id/, eventData.id)}>
								<Button className="blue space-x-2 small w-full">
									<span className="fa-regular fa-pen"></span>
									<span>Editar</span>
								</Button>
							</Link> */}

								<Button
									className={`red space-x-2 small ${deleteLoading && 'loading'}`}
									onClick={fn.onDeleteClick}
								>
									<span className="fa-regular fa-trash-alt"></span>
									<span>Eliminar</span>
								</Button>

								{deleteError && (
									<div className="text-red-500 text-sm">{deleteError}</div>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
