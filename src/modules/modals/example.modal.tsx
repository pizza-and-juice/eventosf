'use client';

import { useContext, useEffect, useRef } from 'react';

import Button from '@components/base/button/button.component';
import ModalSvcContext from '@shared/services/modal/modal.context';
import APP_MODALS from '@static/enums/app.modals';

// import { toast } from 'react-toastify';

type ModalProps = {
	modalId: APP_MODALS;
	data: null;
};

export default function ExampleModal({ modalId, data }: ModalProps) {
	const modalRef = useRef<HTMLDivElement>(null);

	// 1. inject modalSvc
	const modalSvc = useContext(ModalSvcContext);

	function onOpen() {
		console.log('example modal opened');
	}

	function onClose() {
		console.log('example modal closed');
	}

	useEffect(() => {
		onOpen();

		return () => {
			onClose();
		};
	}, []);

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

	// 4. handle modal logic
	function onAcept() {
		window.alert('Welcome to hell 😈');
	}

	return (
		<div
			id="modal-size-manager"
			className={` w-full max-w-2xl max-h-full animate-fadeIn pointer-events-auto `}
			tabIndex={-1}
			ref={modalRef}
		>
			<div
				id="modal-box"
				className="relative dark:bg-dark-800 bg-light-800 rounded-lg shadow "
			>
				<section
					id="modal-header"
					className="flex items-start justify-between p-4 border-b rounded-t"
				>
					<h3 className="text-xl font-semibold text-gray-900 dark:text-white">
						Terms of Service
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

				<section id="modal-body" className="p-6 space-y-6">
					<p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
						With less than a month to go before the European Union enacts new consumer
						privacy laws for its citizens, companies around the world are updating their
						terms of service agreements to comply.
					</p>
				</section>

				<section
					id="modal-footer"
					className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600"
				>
					<Button className="blue dark:text-white" type="button" onClick={onAcept}>
						I accept
					</Button>
					<Button className="secondary " type="button" onClick={close}>
						Decline
					</Button>
				</section>
			</div>
		</div>
	);
}
