// third party
import { useContext, useRef } from 'react';
import { Link } from 'react-router-dom';

// services
import ModalSvcContext from '@shared/services/modal/modal.context';

// components
import '@components/internal/text-link/text-link.component.scss';

// static
import APP_MODALS from '@static/enums/app.modals';

// components
import Tag from '@components/internal/tags/tags.component';

import { ContactModalData } from '../modals.types';
import ROUTES from '@static/router.data';
import { useDefaultUserImg } from '@shared/utils/functions';

type Props = {
	modalId: APP_MODALS;
	data: ContactModalData;
};

export default function ContactModal({ modalId, data }: Props) {
	const modalRef = useRef<HTMLDivElement>(null);

	// 1. inject modalSvc
	const modalSvc = useContext(ModalSvcContext);

	// 3. call the modal hook, it will return this object {show: boolean, closeModal: fn}
	function close() {
		const modalElmt = modalRef.current;
		if (!modalElmt) return;

		modalElmt.classList.add('animate-fadeOut');

		function handleAnimationEnd(e: any) {
			if (!modalElmt) return;
			if (e.animationName !== 'fadeOut') return;

			modalSvc.closeModal(modalId);
			modalElmt.classList.remove('animate-fadeOut');
			modalElmt.removeEventListener('animationend', handleAnimationEnd);
			// modalElmt.add('animate-fadeIn');
		}

		modalElmt.addEventListener('animationend', handleAnimationEnd);
	}

	const details1 = [
		{
			label: 'Evento',
			tag: data.event.title,
		},
		{
			label: 'País',
			tag: data.event.country,
		},
		{
			label: 'Ciudad',
			tag: data.event.city,
		},
		{
			label: 'Dirección',
			tag: data.event.address,
		},
	];

	return (
		// <!-- modal size manager -->
		<div
			className={`w-full max-w-2xl max-h-full animate-fadeIn pointer-events-auto`}
			tabIndex={-1}
			ref={modalRef}
		>
			{/* <!-- Modal box --> */}
			<div className="relative dark:bg-dark-800 bg-white rounded-lg shadow">
				<section
					id="modal-header"
					className="flex items-start justify-between p-4 border-b rounded-t border-gray-200 dark:border-gray-600"
				>
					<h3 className="text-xl font-semibold text-gray-900 dark:text-white">
						Contacto
					</h3>
					<button
						type="button"
						className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
						data-modal-hide="defaultModal"
						onClick={close}
					>
						<span className="icon">
							<i className="far fa-times"></i>
						</span>

						<span className="sr-only">Close modal</span>
					</button>
				</section>

				{/* <!-- Modal body --> */}
				<section id="modal-body" className="p-6 space-y-6">
					<div className="space-y-2">
						{details1.map((item: any, index: number) => (
							<div key={index} className="flex justify-between items-center h-[32px]">
								<h2 className="leading-[26px] font-medium text-black dark:text-white">
									{item.label}
								</h2>
								<Tag>{item.tag}</Tag>
							</div>
						))}
					</div>
					<hr className="border-light-800 dark:border-dark-700" />

					<div>
						<h1 className="text-lg font-semibold text-black dark:text-white">
							Anfitrión
						</h1>

						<div className="flex justify-between items-center gap-x-4 mt-2">
							<Link
								to={ROUTES.profile.root.replace(/:id/, data.host.id)}
								className="flex items-center gap-x-2"
							>
								<img
									src={data.host.pfp}
									className="w-10 h-10 rounded-full object-cover"
									onError={useDefaultUserImg}
								/>
								<h2 className="text-black dark:text-white">{data.host.name}</h2>
							</Link>
							<Link
								to={`mailto:${data.host.email}`}
								className="text-link"
								target="_blank"
								rel="noopener noreferrer"
							>
								{data.host.email}
							</Link>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
