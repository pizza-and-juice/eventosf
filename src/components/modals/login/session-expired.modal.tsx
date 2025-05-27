import { useContext, useRef } from 'react';

// import Button from 'src/components/internal/button/button.component';
import ModalService from 'src/shared/services/modal/modal.service';
import ModalSvcContext from 'src/shared/services/modal/modal.context';
import APP_MODALS from 'src/static/enums/app.modals';
import Button from 'src/components/internal/button/button.component';
// import QueryApi from 'src/shared/api/query-api';
// import { toast } from 'react-toastify';

// import { toast } from 'react-toastify';

type LoginModalProps = {
	modalId: APP_MODALS;
	data: undefined;
};

export default function SessionExpiredModal({ modalId }: LoginModalProps) {
	const modalRef = useRef<HTMLDivElement>(null);

	// 1. inject modalSvc
	const modalSvc = useContext<ModalService>(ModalSvcContext);

	function onLogin() {
		modalSvc.closeModal(modalId);
		modalSvc.open(APP_MODALS.LOGIN_MODAL);
	}

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

	return (
		// <!-- modal size manager -->
		<div
			className={` w-full max-w-[406px] max-h-full animate-fadeIn pointer-events-auto `}
			tabIndex={-1}
			ref={modalRef}
		>
			{/* modal box */}
			<div className="relative dark:bg-dk_blue-900 bg-white dark:bg-dark-800 rounded-lg shadow ">
				{/* modal header */}
				<div className="flex items-start justify-between px-8 py-6  rounded-t ">
					<h1 className="text-2xl font-bold text-black dark:text-white">
						Session expired
					</h1>
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
				</div>

				{/* modal body */}
				<div className="px-8 pb-6 space-y-6">
					<p className="text-base leading-relaxed text-black dark:text-gray-400 text-center">
						Please log in again to continue.
					</p>

					{/* buttons con */}
					<div>
						<Button className="blue w-full text-[14px]" onClick={onLogin}>
							Login
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
